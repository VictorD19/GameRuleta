import { io } from "socket.io-client";

const socket = io("ws://localhost:8001", {
    // auth: {
    //     token: ObterToken(),
    // },
    autoConnect: true,
    path: "/ws/socket.io/",
    transports: ['websocket', 'polling']
});

export { socket };