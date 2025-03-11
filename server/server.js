import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

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