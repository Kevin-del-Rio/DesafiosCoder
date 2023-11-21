import express from "express";
import ProductManager from "./ManejoArchivos.js";

const app = express();
const APP_PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pm = new ProductManager();
let products = [];

let traerProductos = async () => {
  products = await pm.getProduct();
  return products;
};
traerProductos();

app.get("/products", (req, resp) => {
  console.log("/products/");
  return products.length <= 0
    ? resp
        .status(204)
        .json({ status: "No encontrado", message: "Productos no encontrados" })
    : resp.status(200).json({ status: "ok", data: products });
});

app.get("/products/query", (req, resp) => {
  console.log("/products/query?limit=");
  let limit = parseInt(req.query.limit);
  let prod = products.slice(1, limit);
  return limit > 0
    ? resp.status(200).json({ status: "ok", data: prod })
    : resp.status(200).json({ status: "ok", data: products });
});

app.get("/products/:pId", (req, resp) => {
  console.log("/products:id");

  let id = parseInt(req.params.pId);
  let producto = products.filter((prod) => prod.id === id);

  return producto.length > 0
    ? resp.status(200).json({ status: "ok", data: producto })
    : resp
        .status(200)
        .json({ status: "ok", message: "Producto no encontrado" });
});

app.listen(APP_PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${APP_PORT}`);
});
