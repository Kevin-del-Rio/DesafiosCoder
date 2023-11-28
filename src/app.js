import express from "express";
import __dirname from "./utils.js"
import productRouter from './routers/product.router.js'
import cartsRouter from './routers/carts.router.js'
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
app.use('/api/carts', cartsRouter);


app.listen(APP_PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${APP_PORT}`);
});
