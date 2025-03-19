import {getDatabase, ref, get} from "firebase/database";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { readFile } from "fs/promises";

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

export { db };