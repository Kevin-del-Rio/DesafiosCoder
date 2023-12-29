import { Schema, model }from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

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
cartsSchema.plugin(mongoosePaginate)
cartsSchema.pre('findById', function(){
    this.populate("products.product")
    next()
})
export const cartModel = model(cartsCollection, cartsSchema)
