const menu = [
    {id:1, name:"Jollof Rice", price: 50},
    {id:2, name:"Fried Rice", price: 50},
    {id:3, name:"Pounded Yam", price: 50},
    {id:4, name:"Eba", price: 50},
    {id:5, name:"White Rice", price: 50},
    {id:6, name:"Fufu", price: 50},
    {id:7, name:"Banku & Tilapia", price: 50},
    {id:8, name:"Fried Rice", price: 50},
    {id:9, name:"Waakye", price: 50},
    {id:10, name:"Chicken Shawarma", price: 50},
    {id:11, name:"Beef Shawarma", price: 50},
    {id:12, name:"Veg Shawarma", price: 50},
    {id:13, name:"Bread and Egg with Beverage", price: 50},
    {id:14, name:"Bread and Chicken with Beverage", price: 50},
    {id:15, name:"Bread and Beef with Beverage", price: 50},
    {id:16, name:"Bread and Vegetable with Beverage", price: 50},
    {id:17, name:"Bread and Egg with Beverage", price: 50},
    {id:18, name:"Bread and Chicken with Beverage", price: 50},
    {id:19, name:"Bread and Beef with Beverage", price: 50},
    {id:20, name:"Bread and Vegetable Salad with Beverage", price: 50},
    {id:21, name:"Don Simon", price: 25},
    {id:22, name:"Ceres", price: 25},
    {id:23, name:"Bigoo", price: 5},
    {id:24, name:"Bel-Aqua", price: 6},
    {id:25, name:"Bel-Aqua Active", price: 9},
    {id:26, name:"Yomi Yoghurt", price: 25},
    {id:27, name:"Plantain Chips", price: 20},
    {id:28, name:"Fanta", price: 20},
    {id:29, name:"Coke", price: 20},
    {id:30, name:"Sprite", price: 20},
    
    
];
let cart = [];

const menuItems = document.getElementById("menu-items");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-button");

checkoutButton.addEventListener("click", checkout);
    

menu.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-items");
    div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: GHS${item.price}</p>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    menuItems.appendChild(div);
})

function addToCart(id) {
    const item = menu.find(item => item.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - GHS${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });


    totalPrice.textContent = `Total Price: GHS${total}`;
}
function checkout(){
    if(cart.length === 0){
        alert("Your cart is empty");
        return;
    }
    else{
        alert("Checkout successful");
        cart = [];
        updateCart();
    }
}
