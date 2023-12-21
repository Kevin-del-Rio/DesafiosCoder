import { Schema, model }from 'mongoose';

const cartsCollection = "carts"

const cartsSchema = new Schema({

    products: {
        type: [
            {
                product:{
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {type: Number,
                default : 1}
            }
        ],
        default: []
    }

});

cartsSchema.pre('findById', function(){
    this.populate("products.product")
})
export const cartModel = model(cartsCollection, cartsSchema)
