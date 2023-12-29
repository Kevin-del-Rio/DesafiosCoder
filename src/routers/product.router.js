import { Router } from "express";
// import ProductManager from '../dao/managers/classProduct.js';
import productDaoMongo from "../daos/Mongo/productDaoMongo.js";
import { io } from "../app.js";
import { productModel } from "../daos/Mongo/model/productModel.js";

const router = Router();

const pm = new productDaoMongo();

// GET localhost:8080 /api/products /
router.get('/', async (req,res) => {
    let { limit , page , query } = req.query;
    let result = {}
    
    try {
        let queryObj = JSON.parse(query ? query : "{}")
        let resultQuery = await productModel.paginate(queryObj ? queryObj : {}, { limit: (limit ? limit : 5) , page: (page ? page : 1) })
        result = {
            status: "success",
            payload: resultQuery.docs,
            totalPages: resultQuery.totalPages,
            prevPage: resultQuery?.prevPage || null,
            nextPage: resultQuery?.nextPage || null,
            page: resultQuery.page,
            hasPrevPage: resultQuery?.hasPrevPage,
            hasNextPage: resultQuery?.hasNextPage,
            prevLink: resultQuery?.hasPrevPage != false ? `http://localhost:8080/api/products?limit=${(limit ? limit : 5)}&page=${parseInt((page ? page : 1))-1}&query=${query ? query : "{}"}` : null,
            nextLink: resultQuery?.hasNextPage != false ? `http://localhost:8080/api/products?limit=${(limit ? limit : 5)}&page=${parseInt((page ? page : 1))+1}&query=${query ? query : "{}"}` : null
        }
        console.log(result)
        res.status(200).json(result);

    } catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
});

// GET localhost:8080  /api/products/query?limit=
router.get('/query', async (req, res) => {
    console.log("/products/query?limit=");
    try {
        let products = await pm.getProduct()
        let limit = parseInt(req.query.limit);
        let prod = products.slice(0, limit);
        return limit > 0
            ? res.status(200).json({ status: "ok", data: prod })
            : res.status(200).json({ status: "ok", data: products });
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
});


// GET localhost:8080  /api/products/:id
router.get('/:pid', async (req, res) => {
    console.log("/products:id");
    try {
        let id = req.params.pid;
        let product = await pm.getProductById(id)
        console.log(product)
        return product
            ? res.status(200).json({ status: "ok", data: product })
            : res
                .status(200)
                .json({ status: "ok", message: "Producto no encontrado" });
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

// POST localhost:8080  /api/products/
router.post('/', async (req, res) => {
    let product = await req.body;
    console.log("/products/ + body");
    try {
        await pm.addProduct(
            product.title,
            product.description,
            product.price,
            product.thumbnail,
            product.status,
            product.stock,
            product.category,
        )
        const products = await pm.getProduct();
        io.emit("realTimeProducts", products);

        return res
            .status(200)
            .send({ status: "success", message: "Product added" });
    }

    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})

// PUT localhost:8080  /api/products/:id
router.put('/:id', async (req, res) => {
    console.log("/products:id + body");
    let id = parseInt(req.params.id)
    let updateProd = req.body;
    try {
        await pm.updateProductById(id, updateProd)
        res.status(200).send({
            status: 'OK',
            message: "Producto actualizado correctamente",
            data: updateProd
        })
    }
    catch (e) {
        res.status(200).send({
            message: "Producto actualizado correctamente",
            data: updateProd
        })
    }
})

// DELETE localhost:8080  /api/products/:id
router.delete('/:id', async (req, res) => {
    console.log("/products:id + body")
    let id = req.params.id;
    try {
        id = String(id)
        await pm.deleteProduct(id);
        const products = await pm.getProduct();
        io.emit("realTimeProducts", products);
        res.status(200).send({
            status: 'success',
            message: "Producto eliminado correctamente",
            data: { id: id }
        })
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail,
            data: { id: id }
        })
    }

})




export default router;

