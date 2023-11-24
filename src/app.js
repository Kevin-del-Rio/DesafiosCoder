import express from "express";
import __dirname from "./utils.js"
import productRouter from './routers/product.router.js'
import handlebars from 'express-handlebars';

const app = express();
const APP_PORT = 8080;

//configuracion para recibir objetos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//uso de carpeta public
app.use(express.static(`${__dirname}/public`));

//uso de vistas de  plantillas 
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use('/api/products', productRouter)

// const pm = new ProductManager();
// let products = [];

// let traerProductos = async () => {
//   products = await pm.getProduct();
//   return products;
// };
// traerProductos();

// app.get("/products", (req, resp) => {
//   console.log("/products/");
//   return products.length <= 0
//     ? resp
//         .status(204)
//         .json({ status: "No encontrado", message: "Productos no encontrados" })
//     : resp.status(200).json({ status: "ok", data: products });
// });

// app.get("/products/query", (req, resp) => {
//   console.log("/products/query?limit=");
//   let limit = parseInt(req.query.limit);
//   let prod = products.slice(1, limit);
//   return limit > 0
//     ? resp.status(200).json({ status: "ok", data: prod })
//     : resp.status(200).json({ status: "ok", data: products });
// });

// app.get("/products/:pId", (req, resp) => {
//   console.log("/products:id");

//   let id = parseInt(req.params.pId);
//   let producto = products.filter((prod) => prod.id === id);

//   return producto.length > 0
//     ? resp.status(200).json({ status: "ok", data: producto })
//     : resp
//         .status(200)
//         .json({ status: "ok", message: "Producto no encontrado" });
// });

app.listen(APP_PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${APP_PORT}`);
});
