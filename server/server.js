import express from "express";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {getUsers, createUser, deleteUser, login, randomUserId, getUserById} from './db.js';
import {authenticateToken} from "./middleware/authenticateToken.js";
import RoomManager from "./RoomManager.js";

const app = express();
export default app;
app.use(cors());
app.use(express.json());

/**
 * Route de gestion d'un utilisateur
 */
app.post("/users", async (req, res) => {
  const user = req.body;
  console.log("User to create:", user);
  console.log("password :", user.password);
  if (!user.name || !user.password) {
    return res.status(400).json({ error: "Nom ou mot de passe manquant" });
  }
  let createUserResult = await createUser(user);
    if (!createUserResult) {
        return res.status(400).json({ error: "Utilisateur existe déjà" });
    }
  res.status(201).json({ message: "Utilisateur créé" });
});

/**
 * Route de connexion
 */
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt with name:", username);
    console.log("and password: ", password)
    const loginResult = await login(username, password);

    if (!loginResult) {
        return res.status(401).json({ success: false });
    }

    const { token } = loginResult;
    res.status(200).json({ success: true, token });
});

/**
 * Route de suppression d'un utilisateur
 */
app.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.status(200).json({ message: "Utilisateur supprimé" });
});

/**
 * Route de création d'une route
 */
app.post('/create-room', (req, res) => {
  // TODO : Récupération de l'utilisateur qui a créé la room et ajout de son id dans la room
  const { roomName, voteSkip, voteAdd, freeToShare} = req.body;
  const room = RoomManager.createRoom(roomName, voteSkip, voteAdd, freeToShare);
  res.json({ id: room.getId() });
});

/**
 * Route de récupération des infos d'une room
 */
app.get('/room/:id', (req, res) => {
  const room = RoomManager.getRoomById(req.params.id);
  if (!room) return res.status(404).send('Room not found');
  res.json(room.toJSON());
});

app.get('/room-playlist/:id', (req, res) => {
  const playlist = RoomManager.getRoomById(req.params.id).getVideoPlaylist();
  if (!playlist) return res.status(404).send('Playlist not found');
  res.json(playlist);
});

app.get('/room-history/:id', (req, res) => {
  const history = RoomManager.getRoomById(req.params.id).getVideoHistory();
  if (!history) return res.status(404).send('History not found');
  res.json(history);
}
);

/**
 * Route pour les suggestions de recherche (obligé de le faire dans le back)
 */
app.get("/suggest", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await axios.get("https://suggestqueries.google.com/complete/search", {
      params: {
        client: "youtube",
        ds: "yt",
        q: query
      },
      headers: {
        "User-Agent": "Mozilla/5.0" // parfois nécessaire pour que Google réponde bien
      }
    });

    res.json(response.data); // retourne les suggestions au front
  } catch (err) {
    console.error("Erreur suggestion :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des suggestions" });
  }
});

/**
 * Initialisation du serveur
 */
if (process.env.NODE_ENV !== 'test') {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


  const videoEndedCounter = {}  // Tableau à deux dimensions pour compter le nombre de clients ayant terminé la
                                // lecture de la vidéo courante dans la room

  io.on("connection", (socket) => {
    console.log(`🔌 Utilisateur connecté : ${socket.id}`);
    /**
     * Gestion des rooms
     */
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      io.in(roomId).emit("userJoined", socket.username);
      console.log(`✅ ${socket.username} a rejoint la salle !!!!! : ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        io.in(roomId).emit("userLeft", socket.username);
        console.log(`❌ ${socket.username} a quitté la salle : ${roomId}`);
    });

    socket.on("userConnected", (username) => {
      socket.username = username;
      socket.emit("username", username);
      console.log(`👤 Username associé à ${socket.id} : ${socket.username}`);
    });

    socket.on("getUsername", () => {
      socket.emit("username", socket.username);
    });

    /**
     * Gestion des messages
     */
    socket.on("message", ({ roomId, author,  data }) => {
      console.log(`💬 Message reçu dans la salle ${roomId} : ${data}`);
      io.to(roomId).emit("message", { author, text: data });
    });

    socket.on("startVote", ({ roomId, author, voteType, videoName = null }) => {
      console.log(`🗳️ Vote lancé dans la salle ${roomId} : ${voteType}`);
      const room = RoomManager.getRoomById(roomId);
      if (!room) return;

      let id = Math.random().toString(36).substring(2, 9);

      if (room.startVote(id, voteType, author, videoName)) {
        io.to(roomId).emit("voteStarted", {id, voteType, author, videoName});
        console.log("Vote lancé :", room.getCurrentVoteInfos());

        setTimeout(() => {
          console.log(`⌛ Vote terminé dans la salle ${roomId}`);
          const result = room.endVote();
          io.to(roomId).emit("voteEnded", { id, result });
        }, 15000);
      } else {
        console.log("Impossible de lancer le vote, une autre action est déjà en cours.");
      }
    });


    socket.on("vote", ({roomId, id, vote}) => {
        console.log(`🗳️ Vote reçu : ${vote} pour le vote ${id}`);
        const room = RoomManager.getRoomById(roomId);
        if (!room) return;
        if (room.vote(id, vote)) {
          console.log("Votes mis à jour :", room.getCurrentVoteInfos());
          io.to(roomId).emit("newVote", { id, vote });
        } else {
          console.log("Impossible de voter, le vote n'existe pas ou est déjà terminé.");
        }
    });


    /**
     * Gestion ajout vidéo
     */
    socket.on("videoAddedPlaylist", ({ roomId, video }) => {
      console.log(`📹 Vidéo ajoutée dans la salle ${roomId} : ${video}`);
      const room = RoomManager.getRoomById(roomId);
      if (!room) return;
      room.addVideoToPlaylist(video);
      //console.log("Ajout de la vidéo à la playlist :", room.getVideoPlaylist());
      io.in(roomId).emit("videoAddedPlaylist", room.getVideoPlaylist());
    });

    socket.on("videoAddedHistory", ({ roomId, video }) => {
      console.log(`📜 Vidéo ajoutée à l'historique dans la salle ${roomId} : ${video}`);
      const room = RoomManager.getRoomById(roomId);
      if (!room) return;
      room.addVideoToHistory(video);
      //console.log("Ajout de la vidéo à l'historique :", room.getVideoHistory());
      io.in(roomId).emit("videoAddedHistory", room.getVideoHistory());
    });

    /**
     * Gestion suppression vidéo
     */
    socket.on("videoDeletedPlaylist", ({roomId, video}) => {
      console.log(`📹 Vidéo supprimée dans la salle ${roomId} : ${video}`);
      const room = RoomManager.getRoomById(roomId);
      if (!room) return;
      //console.log("Actualisation de la playlist")
      io.in(roomId).emit("videoAddedPlaylist", room.removeVideoFromPlaylist(video));
    })

    /**
     * Gestion de la fin de lecture de la vidéo dans la room pour chaque client
     */
    socket.on("videoEnded", async (roomId) => {
      console.log(`⏹️ Vidéo terminée dans la room : ${roomId}`)
      const room = RoomManager.getRoomById(roomId)
      if (!room) return

      if (!videoEndedCounter[roomId]) {
        videoEndedCounter[roomId] = 0
      }
      videoEndedCounter[roomId]++    // On compte un client de plus ayant terminé la vidéo

      // Récupération du nombre de clients dans la room
      const clients = await io.in(roomId).fetchSockets();
      const clientsCount = clients.length;

      if (videoEndedCounter[roomId] >= clientsCount) {
        const playlist = room.getVideoPlaylist()
        if (playlist.length > 0) {
          console.log(`Tous les clients de la room ${roomId} ont terminé leur vidéo, passage à la suivante`)
          const nextVideo = playlist[0]
          room.removeVideoFromPlaylist(nextVideo)
          io.in(roomId).emit("videoAddedPlaylist",room.removeVideoFromPlaylist(nextVideo))
          io.in(roomId).emit("selectVideo", nextVideo)

          videoEndedCounter[roomId] = 0   // Réinitialisation du compteur pour la prochaine vidéo
        }
      }
    })

    /**
     * Gestion des événements vidéo (broadcast uniquement dans la room)
     */
    socket.on("pause", ({ roomId, timeCode }) => {
      console.log(`⏸️ Pause dans la salle ${roomId} : ${timeCode}`);
      socket.to(roomId).emit("pause", timeCode);
    });

    socket.on("play", ({ roomId, timeCode, video}) => {
      console.log(`▶️ Play dans la salle ${roomId} : ${timeCode} => videoId = ${video.id}`);
      socket.to(roomId).emit("play", timeCode, video);
    });

    socket.on("sync", ({ roomId, timeCode }) => {
      console.log(`🔄 Sync dans la salle ${roomId} : ${timeCode}`);
      socket.to(roomId).emit("sync", timeCode);
    });

    socket.on("selectVideo", ({roomId, video}) => {
      console.log(`🔀 Selection d'une vidéo dans la salle ${roomId} : ${video.id}`)
      io.in(roomId).emit("selectVideo", video) // Envoyer à toute la room y compris le client qui a initié le changement
    });

    socket.on("disconnect", () => {
      console.log("❌ Utilisateur déconnecté");
    });
  });

  server.listen(8080, '0.0.0.0', () => {
    console.log("Serveur Socket.IO lancé sur http://localhost:8080");
  });
}
