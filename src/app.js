import express from "express";
import handlebars from 'express-handlebars';
import { Server } from "socket.io"
import { connectDb }  from "./config/index.js"
import __dirname from "./utils.js"
import productRouter from './routers/product.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import socketFunctions from "./services/app.service.js"

connectDb()

const app = express();
const server_port = 8080;

//configuracion para recibir objetos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//uso de carpeta public
app.use(express.static(__dirname + '/public'));

//uso de vistas de  plantillas 
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const server = app.listen(server_port, () => console.log(`Conectado desde el puerto: ${server_port}`));

export const io = new Server(server);

socketFunctions(io)