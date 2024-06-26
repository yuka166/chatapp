import { useState, createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://nice-chat-app.fly.dev', {
    withCredentials: true,
    transports: ['websocket'],
    autoConnect: false
}),
    SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {

    const [userID, setUserID] = useState();

    socket.on('getId', id => {
        setUserID(id)
    });

    return (
        <SocketContext.Provider value={{ socket, userID }}>{children}</SocketContext.Provider>
    );
};
export { SocketContext, SocketProvider };