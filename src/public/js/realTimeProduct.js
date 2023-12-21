const socket = io();
const container = document.querySelector("#container");

socket.on("realTimeProducts", (data) => {
  let products = "";
  data.forEach((p) => {
    products += `   
    <div class="col-3 text-center">                  
    <div class="card d-flex align-items-center p-3" style=' height: 200px; '>
    <img src="${p.thumbnail}" style="width: 50%; " class="card-img-top" alt= ${p.title} >
      <div class="card-body">
        <h5 class="card-title">${p.title} </h5>
        <p class="card-text"> ${p.description} </p>
        <p class="card-text">ID: ${p._id}</p>
      </div>
  </div>
  </div> 
 `;
  });
  container.innerHTML = products;

});
// socket.on("realTimeProducts", (data) => {
//   let products = "";
//   data.forEach((p) => {
//     products += `<p>ID: ${p._id} - ${p.title} - $${p.price}<p/>`;
//   });
//   prod.innerHTML += products;
  
// });



const addProduct = document.querySelector("#addProduct");
const formAddProduct = document.querySelector("#formAddProduct");
addProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const product = {
    title: formAddProduct.title.value,
    description: formAddProduct.description.value,
    price: formAddProduct.price.value,
    status: formAddProduct.status.value,
    thumbnail: formAddProduct.thumbnail.value,
    stock: formAddProduct.stock.value,
    category: formAddProduct.category.value
  };


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

// -----------------------------------------------------------------------------

const deleteProduct = document.querySelector("#deleteProduct");
const formDeleteProduct = document.querySelector("#formDeleteProduct");

deleteProduct.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = formDeleteProduct.productId.value;
  if (!id)
    return Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2500,
      title: `Complete el campo ID`,
      icon: "error",
    });

  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (json.status === "success") {
    formDeleteProduct.reset();
    Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2500,
      title: `Producto borrado`,
      icon: "success",
    });
  }
});