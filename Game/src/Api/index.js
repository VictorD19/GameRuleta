import { io } from "socket.io-client";

const socketSalas = io(process.env.URL_SERVER, {
    // auth: {
    //     token: ObterToken(),
    // },
    autoConnect: true,
});

export { socketSalas };