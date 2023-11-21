import fs from 'file-system'
class Product {
  constructor(title, description, price, thumbnail, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;
  }
}

class ProductManager {
  #listaProducts;
  #productDirPath;
  #productsFilePath;
  #fs;

  constructor() {
    this.#listaProducts = new Array();
    this.#productDirPath = './Archivos';
    this.#productsFilePath = this.#productDirPath + '/Productos.json';
    this.#fs =fs
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

  addProduct = async (title, description, price, thumbnail, stock) => {
    let productoNuevo = new Product();
    try {
      await this.#prepararDirectorioBase();
      await this.#traerProductos();

      if (!title || !description || !price || !thumbnail || !stock) {
        console.log('Complete los campos correctamente');
      } else {
        let max = 1;
        let ide = 1;

        let ids = this.#listaProducts.map((id) => id.id);
        max = Math.max(...ids);

        let valor = async (arr) => {
          if (arr.length >= 1) {
            while (arr.some((id) => id === max)) {
              max++;
            }
            return max;
          } else {
            return (max = 1);
          }
        };

        ide = await valor(ids);

        productoNuevo = {
          title,
          description,
          price,
          thumbnail: [thumbnail],
          code: Math.random().toString(30).substring(2),
          stock,
          id: ide,
        };
      }
      console.log('Producto a registrar:');
      console.log(productoNuevo);

      this.#listaProducts.push(productoNuevo);
      await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
    } catch (error) {
      throw Error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
    }
  };
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
    return prod.length > 0 ? console.log(`Producto id = ${id} encontrado: `, prod) : console.error(`Producto con id: ${id} no encontrado.`, ' “Not found” ');
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

  updateProductById = async (id, title, description, price, thumbnail, stock) => {
    await this.#traerProductos();
    const updateProduct = this.#listaProducts.map((prod) => {
      if (prod.id === id) {
        let update = {
          ...prod,
          title,
          description,
          price,
          thumbnail: [thumbnail],
          stock,
        };
        return update;
      } else {
        return prod;
      }
    });
    this.#listaProducts = updateProduct;
    await this.#fs.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#listaProducts));
  };
}

export default ProductManager;

//*********  TEST  ************

// let prod = new ProductManager();
// console.log(prod);
// let productos = async () => {
//   let produ = await prod.getProduct();
//   console.log(produ);
// };

// let persistirproductos = async () => {
//   await prod.addProduct('Remera', 'Nike', 1000, 'sin foto', 10);
//   await prod.addProduct('Gorra', 'Puma', 1000, 'sin foto', 100);
//   await prod.addProduct('Zapatos', 'Reebook', 4700, 'sin foto', 100);
//   await prod.addProduct('Campera', 'Adidas', 3000, 'sin foto', 200);
//   await prod.addProduct('Mochila', 'Nike', 1000, 'sin foto', 10);
//   await prod.addProduct('Medias', 'Puma', 1000, 'sin foto',  100);
//   await prod.addProduct('Camisa', 'Reebook', 4700, 'sin foto',  100);
//   await prod.addProduct('Boxer', 'Adidas', 3000, 'sin foto',  200);
//   await prod.addProduct('Deportivo', 'Reebook', 4700, 'sin foto',  100);
//   await prod.addProduct('Pelota', 'Adidas', 3000, 'sin foto',  200);
// };
// persistirproductos();

// prod.getProductById(12);

// prod.updateProductById(8, 'pepe', 'Persona', 110, 'con foto', 20);

// prod.getProductById(8);

// prod.deleteProduct(8)

// productos();
