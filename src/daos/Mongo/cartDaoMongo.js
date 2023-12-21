import { cartModel } from "./model/cartModel.js";

class CartManager {
    constructor() {}

    addCart = async (cart) => {
        try {
           await cartModel.create(cart)         
        } catch (error) {
            console.error("No se pudo crear el carrito desde mongoDB", error)
        }

    };

    getCartById = async (id) => {
        try {
            let product = await cartModel.findById(id).populate("products.product")
            if(product){return product} else {console.error("Carrito no encontrado")}
        } catch (error) {
            console.error("No se encontro el carrito desde mongoDB", error)
        }

    };   

    deleteCart = async (id) => {
        try {
            await cartModel.updateOne({_id:id}, {products: []})
            return { status: "success" };
        } catch (error) {
            console.error("No se pudo eliminar el carrito desde mongoDB")
        }
    }
    deleteProductCart = async (cid, pid) => {
        try {
            let result = await cartModel.findByIdAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            );
            return (result)
        } catch (error) {
            console.error("No se pudo eliminar el producto del carrito desde mongoDB")
        }
    }


    updateCartById = async(id, cart)=>{
        try {
            const result = await cartModel.updateOne({_id:id}, cart)
            return result
        } catch (error) {
            console.error("No se pudo modificar el carrito desde mongoDB")
        }

    }

}

export default CartManager; 






