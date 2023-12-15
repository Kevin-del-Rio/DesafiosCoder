import { Router } from 'express';
import cartManager from "../daos/managers/classCart.js"

const router = Router();
const cm = new cartManager();

// --------------------------------------------------
// AGREGAMOS UN CARRITO
router.post('/', async (req, res) => {
    let cart = req.body.products;
    try {
        await cm.addcart(cart)
        return res.send(cart);
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
router.post('/:cid/product/:pid', async (req, res) => {
    // no estoy controlando si el producto existe
    console.log("/carts/id/product/id");
    let cart_id = parseInt(req.params.cid);
    let product_id = parseInt(req.params.pid);
    try {
        if (cart_id === undefined || product_id === undefined) {
            throw {
                code: 400,
                message: 'Error al agregar al carrito',
                detail: `Detalle del error: faltan alguno de los parámetros cid o pid`
            }
        }
        let result = await cm.addProductCart(cart_id, product_id);
        return res.status(200).send(result)
    }
    catch (e) {
        return res.status(e.code).send({
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
        let id = parseInt(req.params.cid);
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

// // BORRRAMOS UN CARRITO
router.delete('/:cid', async (req, res) => {
    try {
        let id = parseInt(req.params.cid);
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
