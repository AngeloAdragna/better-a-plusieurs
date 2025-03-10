import {io} from 'socket.io-client';


let socket

export const initSocket = () => {
    if (!socket){
        socket = io('http://localhost:3000');
        console.log('Socket initialized')
    }
    return socket;
}

export const getSocket = () => socket;