import { getDatabase, ref, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { readFile } from "fs/promises";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { secret_key } from "./config.js";

let connected_users = [];

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

// Charger la clé de service Firebase (chemin à modifier selon ton projet)
const serviceAccount = JSON.parse(
    await readFile(new URL("../token/token.json", import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://betteraplusieur-default-rtdb.europe-west1.firebasedatabase.app"
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCS_yFVmvnakyQradvMlmC7Pbrj8RuUjWY",
    authDomain: "betteraplusieur.firebaseapp.com",
    databaseURL: "https://betteraplusieur-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "betteraplusieur",
    storageBucket: "betteraplusieur.firebasestorage.app",
    messagingSenderId: "432980510353",
    appId: "1:432980510353:web:f35a632d8a9fefd9d16130",
    measurementId: "G-TGPW7TBDND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

// Example query: Get all documents in the 'users' collection
export async function getUsers() {
    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            return snapshot.val(); // Retourne les données
        } else {
            return {}; // Retourne un objet vide si pas de données
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return null;
    }
}

export async function randomUserId() {
    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");
        const newRef = usersRef.push(); // crée une nouvelle référence
        return newRef.key;
    } catch (error) {
        console.error("Erreur lors de la création d'un nouvel ID :", error);
        return null
    }
}

export async function createUser(user) {
    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");

        // Hash du mot de passe
        user.password = createSHA256Hash(user.password);

        // Vérifie les champs requis
        if (!user.name || !user.password) {
            console.error("Erreur : nom ou mot de passe manquant.");
            return false;
        }

        // Vérifie si un utilisateur avec le même nom existe déjà
        const snapshot = await usersRef.once("value");
        const users = snapshot.val() || {};

        for (const u of Object.values(users)) {
            if (u.name === user.name) {
                console.error("Erreur : l'utilisateur existe déjà.");
                return false;
            }
        }

        // Ajout de l'utilisateur
        await usersRef.push(user);
        console.log("Utilisateur ajouté avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    }
}

export async function deleteUser(userId) {
    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");
        await usersRef.child(userId).remove();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
}

export async function getUserById(id) {
    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");
        const snapshot = await usersRef.child(id).get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.error("Utilisateur non trouvé pour l'id :", id);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération d'un utilisateur :", error);
        return null;
    }
}


export async function login(name, password) {

    try {
        const dbAdmin = admin.database();
        const usersRef = dbAdmin.ref("users");
        const snapshot = await usersRef.once("value");

        if (!snapshot.exists()) return false;

        const users = snapshot.val();
        const hashedPswd = createSHA256Hash(password);
        console.log("Login attempt with hashed password:", hashedPswd);
        for (const [UserId, user] of Object.entries(users)) {
            console.log(user.password)
            if (user.name === name && user.password === hashedPswd) {
                const payload = {
                    id: UserId,
                    name: user.name,
                }
                const token = jwt.sign(payload, secret_key, { expiresIn: '1h' });
                connected_users.push(user);
                return {token, user : payload}
            }
        }
        return null;
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
}

export { db };