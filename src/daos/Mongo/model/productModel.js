import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products"

const stringRequired = {
    type: String,
    required: true
};
const numberRequired = {
    type: Number,
    required: true
};

const productSchema = new Schema({
    title: stringRequired,
    description: stringRequired,
    code: {type:String, unique: true, required: true},
    price: numberRequired,
    status: {type: Boolean, required: false} || true,
    stock: numberRequired,
    category: {type: String, required: true, index: true},
    thumbnails: {type: Array, required: false}
});

productSchema.plugin(mongoosePaginate)
export const productModel = model(productCollection, productSchema)