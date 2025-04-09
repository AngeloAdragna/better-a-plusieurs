import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {getUsers, createUser, deleteUser, login, randomUserId, getUserById} from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

//Créer un utilisateur
app.post("/users", async (req, res) => {
    const user = req.body;
    if (!user.name || !user.password) {
        return res.status(400).json({ error: "Nom ou mot de passe manquant" });
    }

    await createUser(user);
    res.status(201).json({ message: "Utilisateur créé" });
});

//Login utilisateur
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("Body:", req.body.username);
    console.log("Login attempt with name:", username);
    const success = await login(req.body.username, req.body.password);
    if (success) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.delete("/users/:id", async (req, res) => {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé" });
});

async function fetchUsers() {
    try {
        const users = await getUsers();
        console.log(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
}


async function test(){

    await fetchUsers();
    const id =await randomUserId();
    const user = {
        id: id,
        name: "test",
        password: "test",
    };
    await createUser(user);
    await fetchUsers();
    await deleteUser(id);
    await fetchUsers();
    await createUser(user);
    const user2 = await getUserById(id);
    console.log(user2);
    const res = await login("test","test");
    console.log(res);
    const res2 = await login("test","test2");
    console.log(res2);
}

//test();

export default app;

if (process.env.NODE_ENV !== 'test') {
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Utilisateur connecté : ${socket.id}`);

        socket.on("message", (data) => {
            console.log(`Message reçu : ${data}`);
            io.emit("message", data);
        });

        socket.on("pause", (data) => {
            console.log(`Réception d'un évènement Pause : ${data}`)
            socket.broadcast.emit("pause", data)
        });

        socket.on("play", (data) => {
            console.log(`Réception d'un évènement Play : ${data}`)
            socket.broadcast.emit("play", data)
        });

        socket.on("sync", (timeCode) => {
            console.log(`Réception d'un évènement Sync : ${timeCode}`)
            socket.broadcast.emit("sync", timeCode)
        })

        socket.on("disconnect", () => {
            console.log("Utilisateur déconnecté");
        });

    });

    server.listen(8080, () => {
        console.log("Serveur Socket.IO lancé sur http://localhost:8080");
    });
}
