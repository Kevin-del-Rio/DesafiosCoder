import express from "express";
// import ProductManager from "../daos/Managers/classProduct.js";
import productDaoMongo from "../daos/Mongo/productDaoMongo.js";
import { io } from "../app.js";

const router = express.Router()

// const pm = new ProductManager();
const pm = new productDaoMongo()


router.get('/', (request, response)=>{
    response.render('index', {})
});

router.get("/chats", (request, response) => {
    response.render("chats", {});
})


router.get("/home", async (request, response) => {
    try {
        let products = await pm.getProduct()
        response.render("home", { ...products })    
    } catch (error) {
        console.error(error)
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await pm.getProduct()
        io.on("connection", (socket) => {
            console.log(`Nuevo cliente conectado. Id: ${socket.id}`);

            io.emit("realTimeProducts", products);
        }); 
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.log(error);
    }
});


export default router;