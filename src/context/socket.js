import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io();

socket.on("connect", () => {
    console.log("User Connected", socket.id);
});

socket.on("disconnect", () => {
    console.log("User Disconected");
});


export const SocketContext = createContext();