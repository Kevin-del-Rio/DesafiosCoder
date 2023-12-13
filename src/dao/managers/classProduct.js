import fs from 'file-system'
import __dirname from "../../utils.js";

const path = __dirname + "/dao/files/";

class Product {
  constructor(title, description, price, thumbnail, status, stock, category) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.status = status;
    this.stock = stock;
    this.category = category
    this.code = Math.random().toString(30).substring(2);
  }

}
class ProductManager {
  #listaProducts;
  #productDirPath;
  #productsFilePath;
  #fs;

  constructor() {
    this.#listaProducts = new Array();
    this.#productDirPath = path;
    this.#productsFilePath = this.#productDirPath + '/Productos.json';
    this.#fs = fs
    this.id = 1;
  }

  #prepararDirectorioBase = async () => {
    await this.#fs.promises.mkdir(this.#productDirPath, { recursive: true });
    if (!this.#fs.existsSync(this.#productsFilePath)) {
      await this.#fs.promises.writeFile(this.#productsFilePath, '[]');
    }
  };

  #traerProductos = async () => {
    let productsFile = await this.#fs.promises.readFile(this.#productsFilePath, 'utf-8');
    if (!productsFile) {
      console.log('No se encontraron Productos');
    } else {
      this.#listaProducts = JSON.parse(productsFile);
    }
  };

  addProduct = async (title, description, price, thumbnail, status, stock, category) => {
    try {
      if (!title || !description || !price || !thumbnail || !stock || !category) {
        console.log('Complete los campos correctamente');
      } else {        
        let productoNuevo = new Product(title, description, price, [thumbnail], status, stock, category);

        await this.#prepararDirectorioBase();
        await this.#traerProductos();

        if (this.#listaProducts.some(prod => prod.code === productoNuevo.code)) {
         return console.error("El código ya existe")
        }

        while (this.#listaProducts.some(prod => prod.id === this.id)) {
          this.id++;
        }

        productoNuevo.id = this.id;
        this.#listaProducts.push(productoNuevo);
      }
      await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
    } catch (error) {
     throw Error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
      
    }
  }

  getProduct = async () => {
    try {
      await this.#prepararDirectorioBase();
      await this.#traerProductos();
      return this.#listaProducts;
    } catch (error) {
      throw Error(`Error consultando los products por archivo, valide el archivo: ${this.#productDirPath},
       detalle del error: ${error}`);
    }
  };

  getProductById = async (id) => {
    await this.#traerProductos();
    let prod = this.#listaProducts.filter((prod) => prod.id === id);
    if (prod.length > 0) {
      console.log(`Producto id = ${id} encontrado: `, prod)
      return prod
    } else {
      console.error(`Producto con id: ${id} no encontrado.`, ' “Not found” ');
    }
  };

  deleteProduct = async (id) => {
    await this.#traerProductos();
    let listaAux;
    let encontrado = this.#listaProducts.some((prod) => prod.id === id);
    if (encontrado) {
      listaAux = this.#listaProducts.filter((prod) => prod.id !== id);
      this.#listaProducts = listaAux;
      console.log(`Producto id = ${id} eliminado con exito: `);
    } else {
      console.error(`Producto no Existe`);
    }
    await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
  };

  updateProductById = async (id, nuevoProducto) => {
    await this.#traerProductos();
    const updateProduct = this.#listaProducts.map((prod) => {
        if (prod.id === id) {
            return { ...prod, ...nuevoProducto }
        } else {
            return prod
        }
    })
    this.#listaProducts = updateProduct;
    await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
    console.log(this.#listaProducts)
}
}

export default ProductManager;

//*********  TEST  ************

// let prod = new ProductManager("../persistencia");
// console.log(prod);
// let productos = async () => {
//   let produ = await prod.getProduct();
//   console.log(produ);
// };

// let persistirproductos = async () => {
//   //                       title, description, price, thumbnail, status , stock, category
//   await prod.addProduct('Monitor', '24"', 1000, 'sin foto', true, 10, "hola");
//   await prod.addProduct('Teclado', '80%', 250, 'sin foto', true, 10, "chau");
//   await prod.addProduct('Cascos', 'Gamer', 500, 'sin foto', false, 100, "hola");
//   await prod.addProduct('Mouse', 'Optico', 110, 'sin foto', false, 20, "chau");
//   await prod.addProduct('Monitor', '19"', 1000, 'sin foto', true, 10, "hola");
//   await prod.addProduct('Teclado', '70%', 250, 'sin foto', false, 10, "chau");
//   await prod.addProduct('Cascos', 'comun', 500, 'sin foto', true, 100, "chau");
//   await prod.addProduct('Mouse', 'Optico', 110, 'sin foto', false, 20, "hola");
// };
// persistirproductos();

// prod.getProductById(12);

// prod.updateProductById(8, 'pepe', 'Persona', 110, 'con foto', 20);

// prod.getProductById(8);

// prod.deleteProduct(8)

// productos();
