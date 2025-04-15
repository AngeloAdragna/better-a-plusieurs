import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  getUsers, createUser, deleteUser, login,
  randomUserId, getUserById
} from './db.js';
import RoomManager from "./RoomManager.js";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Route de gestion d'un utilisateur
 */
app.post("/users", async (req, res) => {
  const user = req.body;
  if (!user.name || !user.password) {
    return res.status(400).json({ error: "Nom ou mot de passe manquant" });
  }
  await createUser(user);
  res.status(201).json({ message: "Utilisateur créé" });
});

/**
 * Route de connexion
 */
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const success = await login(name, password);
  if (success) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
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
  const { roomName, voteSkip, voteAdd, freeToShare } = req.body;
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

  io.on("connection", (socket) => {
    console.log(`🔌 Utilisateur connecté : ${socket.id}`);

    /**
     * Gestion des rooms
     */
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`✅ ${socket.id} a rejoint la salle : ${roomId}`);
    });

    /**
     * Gestion des messages
     */
    socket.on("message", (data) => {
      console.log(`💬 Message reçu : ${data}`);
      io.emit("message", data);
    });

    /**
     * Gestion des événements vidéo (broadcast uniquement dans la room)
     */
    socket.on("pause", ({ roomId, data }) => {
      console.log(`⏸ Pause dans la salle ${roomId} : ${data}`);
      socket.to(roomId).emit("pause", data);
    });

    socket.on("play", ({ roomId, data }) => {
      console.log(`▶️ Play dans la salle ${roomId} : ${data}`);
      socket.to(roomId).emit("play", data);
    });

    socket.on("sync", ({ roomId, timeCode }) => {
      console.log(`🔄 Sync dans la salle ${roomId} : ${timeCode}`);
      socket.to(roomId).emit("sync", timeCode);
    });

    socket.on("disconnect", () => {
      console.log("❌ Utilisateur déconnecté");
    });
  });

  server.listen(8080, () => {
    console.log("Serveur Socket.IO lancé sur http://localhost:8080");
  });
}
