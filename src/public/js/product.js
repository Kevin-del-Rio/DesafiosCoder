const container = document.querySelector("#hola");

async function addToCart(pid) {

    const text = document.querySelector('#addResponce');

    let resp = await fetch(`/api/carts/658b8c9173c0cac15340307b/product/${pid}`, { method: 'POST' })
    resp = await resp.json();
    if (resp.status = "ok") {
        text.innerHTML = "Producto agregado correctamente"
        setTimeout(() => {
            text.innerHTML = ''
        }, 1000);
    } else {
        text.innerHTML = "A ocurrido un error al agregar el producto"
        setTimeout(() => {
            text.innerHTML = ''
        }, 1000);
    }

}



function ver(id) {

    const prod = fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'GET'
    })
        .then(res => res.text())
        .then(data => {
            let hola = JSON.parse(data)
            console.log(hola.data.title)

            let prod = ''
            prod +=
                `
            <div class="card-body">
            <h5 class="card-title">${hola.data.title}</h5>
            <p class="card-text">${hola.data.description}</p>
            <h5>Precio $U ${hola.data.price}</h5>
            <div class="card-body text-end">
        <button onclick="addToCart('${hola.data._id}')">Agregar</button>
    </div>
        </div>
            `
            container.innerHTML = prod

        })
        .catch(err => console.error(err));

    return prod
}

// por el momento los productos en el carrito incrementan cuando en el detalle del producto agregamos dicho roducto
// lo de modificar el valor quantity desde el body esta hecho solo funciona con postman. tendria que implementarlo en la vista
// falta agregarle el total al producto
// me faltan los filtros y ordenamiento
// y tambien lo de modificar el carrito enviandole un por body un arreglo de productos. tengo algo hecho en el cartsDaoManager
// como aun no esta aplicado nada del usuario y session , el carrito _id esta harcodeado
// estoy atrasado con las ultimas 2 clases de coockies y session

// lo que me falta es porque no me ah salido


// const sumar = (id, quantity) => {
//     // console.log(quantity)
//     let cant = parseInt(quantity);
//     cant++;
//     console.log(cant);
//     return cant
// }
// const restar = (id, quantity) =>{
//     quantity = quantity - 1
//     console.log(quantity)
//     return quantity
// }