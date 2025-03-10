import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {initSocket} from "./socket/socket.jsx";
import SocketHandling from "./SocketHandling.jsx";

function App() {
  const [count, setCount] = useState(0)
    useEffect(() => {
        const socket = initSocket();

        socket.on("connect", () => {
            console.log("Connecté au serveur WebSocket !");
        });

        socket.on("chat message", (message) => {
            console.log("Message reçu :", message);
        });

        return () => {
            socket.disconnect(); // Ferme la connexion proprement quand le composant est démonté
        };
    }, []);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
        <SocketHandling />
    </>
  )
}

export default App
