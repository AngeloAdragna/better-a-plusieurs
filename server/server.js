import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

app.get('/', (req, res) => {
    res.send("Hello, WebSockets & Async!");
});

io.on('connection', (socket) => {
    console.log('client connected:', socket.id);

    socket.on('message', (data) => {
        console.log('Message reçu:', data);
        socket.emit('message', `Echo: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log('Server started on http://localhost:$',PORT);
});