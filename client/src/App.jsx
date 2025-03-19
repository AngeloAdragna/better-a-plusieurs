import React from "react";
import WebSocketChat from "./components/WebSocketChat";
import BarPage from "./components/BarPage";
import "./styles/App.css";

function App() {
    return (
        <div className="App">
            <BarPage />
            <WebSocketChat />
        </div>
    );
}

export default App;