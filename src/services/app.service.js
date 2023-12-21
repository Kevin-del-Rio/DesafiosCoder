import { loadMessages, saveMessage } from "./chats.service.js";

import { Server } from "socket.io";

let socketFunctions = (httpServer) => {

    const socketServer = new Server(httpServer);
    socketServer.on("connection", socket => {

    //Chats
    let loadChats = async () => {
        let messages = await loadMessages()
        socketServer.emit("loadChats", messages)
    }
    let saveChat = async (data) => {
        await saveMessage(data)
        loadChats()
    }
    socket.on("loadChats", () => {
        loadChats();

    })
    socket.on("saveChat", data => {
        saveChat(data);
    })

})
    return socketServer
}

export default socketFunctions