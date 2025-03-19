import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {getUsers} from './db.js';

const app = express();
app.use(cors());

async function fetchUsers() {
    try {
        const users = await getUsers();
        console.log(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
}

fetchUsers();


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

    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté");
    });
});

server.listen(8080, () => {
    console.log("Serveur Socket.IO lancé sur http://localhost:8080");
});