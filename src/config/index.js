import { connect } from "mongoose";

export const connectDb = async () => {
    await connect('mongodb://127.0.0.1:27017/Ecommerce')
    console.log('Base de datos conectada')
}

