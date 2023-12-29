const socket = io();
const container = document.querySelector("#container");

const eliminarProducto = async (id) => {
  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
  });

  const json = await response.json();
  if (json.status === "success") {
    Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2500,
      title: `Producto borrado`,
      icon: "success",
    });
  }
}

socket.on("realTimeProducts", (data) => {
  let products = "";
  data.forEach((p) => {
    products += `    
    <div key="${p._id}" class="card m-2" style="width: 18rem;">
    <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img"
        aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false">
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#868e96"></rect><text x="38%" y="50%" fill="#dee2e6" dy=".3em">Image
            cap</text>
    </svg>
    <div class="card-body">
        <h5 class="card-title">${p.title}</h5>
        <p class="card-text">${p.description}</p>
        <h5>Precio $U ${p.price}</h5>
    </div>
    <div class="card-body text-end">
        <button onclick="eliminarProducto('${p._id}')">Delete</button>
    </div>
</div>`

      ;
  });
  container.innerHTML = products;
});




const addProduct = document.querySelector("#addProduct");
const formAddProduct = document.querySelector("#formAddProduct");
addProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const statusValue = getStatusValue();
  const product = {
    title: formAddProduct.title.value,
    description: formAddProduct.description.value,
    price: formAddProduct.price.value,
    status: statusValue,
    thumbnail: formAddProduct.thumbnail.value,
    stock: formAddProduct.stock.value,
    category: formAddProduct.category.value
  };

  function getStatusValue() {
    const statusTrueRadio = document.getElementById('statusTrue');
    const statusFalseRadio = document.getElementById('statusFalse');
  
    if (statusTrueRadio.checked) {
      return true;
    } else if (statusFalseRadio.checked) {
      return false;
    } else {
      return true;
    }
  }


  const response = await fetch("http://localhost:8080/api/products/", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const json = await response.json();
  if (json.status === "success") {
    formAddProduct.reset();
    Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2500,
      title: `Producto agregado`,
      icon: "success",
    });
  }

});

