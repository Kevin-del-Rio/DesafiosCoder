import { cartModel } from "../models/cartModel.js";

class CartManager {
    constructor() {}

    addCart = async () => {
        try {
           await cartModel.create({})         
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







// addProductCart = async (cid, pid) => {
    //     try {
    //         let auxCart = await this.getCartById(cid);
    //         let productAlreadyInCart = await cartModel.find({ products: { $elemMatch: { product: pid } } })

    //         if (productAlreadyInCart == 0) {
    //             await auxCart.products.push({
    //                 product: pid,
    //                 quantity: 1
    //             })
    //             await cartModel.updateOne({
    //                 _id: cid
    //             }, auxCart)
    //             // console.log(cid , auxCart)
    //         } else {
    //             let updateProduct = await cartModel.findById(cid).populate("products.product")
    //             let index = updateProduct.products.findIndex(
    //                 (p) => p.product,{_id : pid }
    //               );
    //             console.log(updateProduct.products[index].quantity + 1) 
    //              updateProduct = (updateProduct.products[index].quantity + 1)   
    //              await cartModel.findOneAndUpdate({_id:cid, "products.product": pid}, {$set: {"products.$.quantity": updateProduct[0].quantity + 1}}, { new: true })          
    //         }

    //         // await auxCart.findOne() 

    //         // let auxCart = await this.getCartById(cid);   

    //         // if (auxCart.products.length === 0) {
    //         //     let product = []
    //         //     product.push({_id: pid, quantity: 1})
    //         //     await cartModel.updateOne({_id:cid}, {products: product});
    //         // }else{
    //         //     let products = [];
    //         //     let updateProduct = auxCart.products.filter(oneProd => oneProd._id === pid) 
    //         //     let newQuantity = 1;
    //         //     if (updateProduct.length > 0) {
    //         //         newQuantity = parseInt(updateProduct[0].quantity) + 1
    //         //         products = auxCart.products.map(
    //         //             (oneProd) => {
    //         //                 if (oneProd._id === pid){
    //         //                     oneProd = {_id: pid,quantity: parseInt(newQuantity)}
    //         //                 }  
    //         //                 return oneProd
    //         //             }
    //         //             )
    //         //     }else{
    //         //         products = auxCart.products;
    //         //         products.push({_id: pid, quantity: 1})
    //         //     }
    //         //     await cartModel.updateOne({_id:cid}, {products: products})
    //         // }
    //     } catch (error) {
    //         console.error("No se pudo agregar el producto a el carrito desde mongoDB", error)
    //     }
    // };