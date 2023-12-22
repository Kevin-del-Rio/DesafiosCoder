import { loadMessages, saveMessage } from "./chats.service.js";

let socketFunctions = (io) => {

    io.on("connection", socket => {

    //Chats
    let loadChats = async () => {
        let messages = await loadMessages()
       io.emit("loadChats", messages)
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
    return io
}

export default socketFunctions