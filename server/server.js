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
    const { name, password } = req.body;
    const success = await login(name, password);
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
        console.log(`User connected: ${socket.id}`);

        socket.on("message", (data) => {
            io.emit("message", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    server.listen(8080, () => {
        console.log("Server is running on http://localhost:8080");
    });
}

