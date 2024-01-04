import express from "express";
// import ProductManager from "../daos/Managers/classProduct.js";
import productDaoMongo from "../daos/Mongo/productDaoMongo.js";
import cartDaoMongo from "../daos/Mongo/cartDaoMongo.js"
import { io } from "../app.js";
import { productModel } from "../daos/Mongo/model/productModel.js";
import { cartModel } from "../daos/Mongo/model/cartModel.js";

const router = express.Router()

// const pm = new ProductManager();
const pm = new productDaoMongo()
const cm = new cartDaoMongo()

router.get('/', (request, response) => {
    response.render('index', {})
});

router.get("/chats", (request, response) => {
    response.render("chats", {});
})

router.get("/home", async (request, response) => {
    try {
        let products = await pm.getProduct()
        response.render("home", { products })

    } catch (error) {
        console.error(error)
    }
});
router.get("/products", async (req, res) => {
    try {
        const { numPage = 1, limit = 4 } = req.query
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productModel.paginate({}, { limit, page: numPage, lean: true })
        res.render('products', {
            products: docs,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            page
        })

    } catch (error) {
        console.error(error)
    }
});
router.get("/detail/:pid", async (req, res) => {
    const pid = req.params.pid
    try {
        const prod = await productModel.findById(pid).lean()
        console.log(prod)
        res.render('detailProduct', {
            prod
        })
    } catch (error) {
        console.error(error)
    }
});

router.get('/carts/:cid', async (req, res) => {
    let id = req.params.cid
    try {
        const cart = await cm.getCartById(id);
        const products = cart.products;

        res.render("carts", { products });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: "Error ", message: error });
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