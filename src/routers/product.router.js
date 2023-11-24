import { Router } from "express";
import ProductManager from "../ManejoArchivos.js";

const router = Router();

const pm = new ProductManager();
let products = [];

let traerProductos = async () => {
  products = await pm.getProduct();
  return products;
};
traerProductos();

// GET localhost:8080 /api/products /
router.get("/", (req, resp) => {
    console.log("/products/");
    return products.length <= 0
      ? resp
          .status(204)
          .json({ status: "No encontrado", message: "Productos no encontrados" })
      : resp.status(200).json({ status: "ok", data: products });
  });

// GET localhost:8080  /api/products/query?limit=
router.get("/query", (req, resp) => {
  console.log("/products/query?limit=");
  let limit = parseInt(req.query.limit);
  let prod = products.slice(1, limit);
  return limit > 0
    ? resp.status(200).json({ status: "ok", data: prod })
    : resp.status(200).json({ status: "ok", data: products });
});

// GET localhost:8080  /api/products/:id
router.get("/:pId", (req, resp) => {
    console.log("/products:id");
  
    let id = parseInt(req.params.pId);
    let producto = products.filter((prod) => prod.id === id);
  
    return producto.length > 0
      ? resp.status(200).json({ status: "ok", data: producto })
      : resp
          .status(200)
          .json({ status: "ok", message: "Producto no encontrado" });
  });


export default router;

