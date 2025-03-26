import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {getUsers, createUser, deleteUser, login, randomUserId, getUserById} from './db.js';

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

    socket.on("login", async (data) => {
        console.log(`Login reçu : ${data}`);
        const res = await login(data.name,data.password);
        console.log(res);
        io.emit("login", res);
    });

    socket.on("deleteUser", async (data) => {
        console.log(`DeleteUser reçu : ${data}`);
        await deleteUser(data);
        io.emit("deleteUser", data);
    })

    socket.on("createUser", async (data) => {
        console.log(`CreateUser reçu : ${data}`);
        await createUser(data);
        io.emit("createUser", data);
    })
});

server.listen(8080, () => {
    console.log("Serveur Socket.IO lancé sur http://localhost:8080");
});