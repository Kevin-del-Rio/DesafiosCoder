import fs from 'file-system'
import __dirname from "../../utils.js";

const path = __dirname + "/Managers/files/";

class CartManager {
    #cartDirPath;
    #cartsFilePath;
    #fs;
    constructor() {
        this.#cartDirPath = path;
        this.#cartsFilePath = this.#cartDirPath + "/Carts.json";
        this.#fs = fs
    }

    #prepararDirectorioBaseCart = async () => {
        await this.#fs.promises.mkdir(this.#cartDirPath, { recursive: true });
        if (!this.#fs.existsSync(this.#cartsFilePath)) {
            await this.#fs.promises.writeFile(this.#cartsFilePath, "[]");
        }
    }

    #traerCarts = async () => {
        let cartsFile = await this.#fs.promises.readFile(this.#cartsFilePath, "utf-8");
        if (!cartsFile) {
            console.log("No se han encontrado carritos")
        } else {
            cartsFile = JSON.parse(cartsFile);
            return Object.values(cartsFile);
        }

    }

    getCartById = async (id) => {
        try {
            await this.#prepararDirectorioBaseCart();
            let cart = await this.#traerCarts();

            let car = cart.filter(c => c.id === id)
            console.log(car)
            console.log("id " , id)
            if (car.length > 0) {
                return car;
            }
            else {
                console.log("Cart no encontrado");
            }
        }
        catch (error) {
            console.log(error, `Error consiguiendo cart con id: ${id}`)
        }
    }

    addcart = async () => {
        let newCart = { products: [] };
        try {
            console.log("Creando nuevo carrito:");
            await this.#prepararDirectorioBaseCart()
            let carts = await this.#traerCarts();
            let id = 0;
            if (carts.length > 0) {
                if (carts[carts.length - 1]) {
                    id = carts[carts.length - 1].id + 1;
                } else { id = carts[0].id + 1; }
            } else { id = 1; }
            carts.push({ id: id, ...newCart });
            console.log("Actualizando lista carritos:");
            await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(carts))
        } catch (error) {
            console.log(error, `Error creando carrito nuevo: ${newCart.id}`)
        }
    }

    // getNextId(products) {
    //     const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    //     return maxId + 1;
    //   }

    addProductCart = async (cid, pid) => {
        try {
            const carts = await this.#traerCarts();
            const newCarts = carts.map((c) => {
                if (c.id === Number(cid)) {
                    const index = c.products.findIndex((p) => p.product === Number(pid));
                    if (index === -1) {
                        c.products.push({ product: Number(pid), quantity: 1 });
                        return c;
                    }
                    c.products[index].quantity++;
                }
                return c;
            });
            await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(newCarts))
        } catch (error) {
            console.log(error);
        }
    };

    deleteCart = async (id) => {
        try {
            await this.#prepararDirectorioBaseCart();
            let carts = await this.#traerCarts();

            id = parseInt(id)
            let encontrado = carts.find(element => element.id === id);
            if (encontrado) {
                carts = carts.filter(element => element.id !== id);
                await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(carts))
            } else {
                console.log(`No se encontro el carrito con id ${id}`)
            }
        }
        catch (error) {
            console.log(error, 'Error al Eliminar el Carrito')
        }
    }

    getCart = async () => {
        try {
            let carts = [];
            await this.#prepararDirectorioBaseCart()
            carts = await this.#traerCarts();
            return carts;
        } catch (error) {
            console.log(error, 'Error al consultar archivos de Persistencia')
        }
    }
}

export default CartManager;


//*********  TEST  ************

// let cart = new CartManager();
// // console.log(cart);

// let carts = async () => {
//     let carti = await cart.getCart();
//     carti.map((x) => console.log(x))
//     // console.log(carti)
// }
// let persistirCarts = async () => {
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
// };

// persistirCarts();
// cart.addProductCart(5, 4);
// cart.deleteCart(9)
// cart.getCartById(2)
// carts();

