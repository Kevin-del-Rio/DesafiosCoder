import { connect } from "mongoose";

export const connectDb = async () => {
    // await connect('mongodb://127.0.0.1:27017/Ecommerce')
    await connect('mongodb+srv://Kevin:Kevin1@cluster0.mbrgogi.mongodb.net/Ecommerce?retryWrites=true&w=majority')
    console.log('Base de datos conectada')
}

