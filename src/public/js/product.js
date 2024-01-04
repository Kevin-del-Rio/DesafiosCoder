const container = document.querySelector("#hola");

async function addToCart(pid) {
    const text = document.querySelector('#addResponce');
    let resp = await fetch(`/api/carts/658b8c9173c0cac15340307b/product/${pid}`, {method: 'POST'})
    resp = await resp.json();
    if(resp.status = "ok") {
      text.innerHTML = "Producto agregado correctamente"
    } else {
      text.innerHTML = "A ocurrido un error al agregar el producto"
    }
  }



function ver(id) {
    const pepe = fetch(`http://localhost:8080/api/products/${id}`, {
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

    return pepe
}
