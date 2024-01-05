import { Router } from 'express';
// import cartManager from "../daos/Managers/classCart.js"
import cartDaoMongo from "../daos/Mongo/cartDaoMongo.js"
import { cartModel } from '../daos/Mongo/model/cartModel.js';
// const cm = new cartManager();

const router = Router();
const cm = new cartDaoMongo();

// --------------------------------------------------
// AGREGAMOS UN CARRITO
router.post('/', async (req, res) => {
    try {
        await cm.addCart()
        return res.send();
    }
    catch (e) {
        return res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})

// --------------------------------------------------
// AGREGAMOS UN PRODUCTO AL UN CARRITO
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let { quantity } = req.body;
    quantity == undefined ? quantity = 1 : quantity

    let resi = cm.addProductCart(cid, pid, quantity)

    try {
        res.status(200).json({ status: "ok", data: resi })
        // res.send(resi)


    } catch (error) {
        return res.status(e.code ? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})
// --------------------------------------------------
// MOSTRAMOS LOS PRODUCTOS DE UN CARRITO SELECCIONADO
router.get('/:cid', async (req, res) => {
    console.log("/carts/id");
    try {
        let id = String(req.params.cid);
        let cart = await cm.getCartById(id);
        return res.send(cart);
    }
    catch (e) {
        return res.status(e.code ? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

// // BORRRAMOS UN PRODUCTO DEL CARRITO
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cm.deleteProductCart(cid, pid);
        res.status(201).send({
            status: 'OK',
            message: "Producto eliminado correctamente"
        })
    }
    catch (e) {
        res.status(500).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail
        });
    }
})

// // BORRRAMOS UN CARRITO
router.delete('/:cid', async (req, res) => {
    try {
        let id = String(req.params.cid);
        let cart = await cm.getCartById(id);
        if (cart) {
            let cart = await cm.deleteCart(id);
            return res.status(200).send({
                status: 'OK',
                message: "Carrito eliminado correctamente",
                data: { id: id, cart: cart }
            })
        } else {
            return res.status(200).send({
                status: 'fail',
                message: "Carrito no encontrado",
                data: ''
            })
        }
    }
    catch (e) {
        return res.status(e.code ? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

export default router;
