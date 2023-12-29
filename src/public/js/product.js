
function addToCart(productId) {
    fetch(`api/carts/658b8c9173c0cac15340307b/product/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
    })
        .then(res => res.text())
        .then(data => console.log(data))
        .catch(err => console.error(err));
}
function ver(productId) {
    
    const pepe = fetch(`http://localhost:8080/api/products/658b8b5f73c0cac15340305e`, {
        method: 'GET'
    })
        .then(res => res.text())
        .then(data => {
        // mandar data al modal

        })
        .catch(err => console.error(err)); 
         
    return pepe
}
