// ---------------- GLOBAL CART ----------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------------- PRODUCTS (Frontend List) ----------------
const PRODUCTS = [
  {name:"Rice (1kg)", price:60, img:"images/rice.jpeg"},
  {name:"Corn Flour (1kg)", price:50, img:"images/cone.webp"},
  {name:"Freedom Oil (1L)", price:90, img:"images/freedom oil.webp"},
  {name:"Green Gram (1kg)", price:68, img:"images/green.webp"},
  {name:"Red Gram (1kg)", price:88, img:"images/red.webp"},
  {name:"Maida Flour (1kg)", price:50, img:"images/mida.webp"},
  {name:"Wheat Flour (1kg)", price:55, img:"images/wheat.webp"},
  {name:"Sugar (1kg)", price:55, img:"images/sugar.jpeg"},
  {name:"Sunflower Oil (1L)", price:160, img:"images/oil.jpeg"},
  {name:"Tomato (1kg)", price:40, img:"images/tamoto.jpeg"},
  {name:"Onions (1kg)", price:40, img:"images/onion.jpeg"},
  {name:"Lays Chips", price:20, img:"images/lays.jpeg"},
  {name:"Andhra Mixture", price:70, img:"images/mixture.jpeg"},
  {name:"Cake", price:40, img:"images/cake.webp"},
  {name:"Dark Fantasy", price:90, img:"images/dark.webp"},
  {name:"Fuse", price:20, img:"images/fuse.webp"},
  {name:"JimJam", price:10, img:"images/jimjam.webp"},
  {name:"Kitkat", price:40, img:"images/kitkat.webp"},
  {name:"Kurkure", price:30, img:"images/kurkkure.webp"},
  {name:"Oreo", price:50, img:"images/orea.webp"},
  {name:"Snickers", price:20, img:"images/snikers.webp"},
  {name:"Maggi Noodles", price:15, img:"images/maggi.jpeg"},
  {name:"Milk (1L)", price:50, img:"images/milk.jpeg"},
  {name:"Good Day Biscuits", price:30, img:"images/goodday.jpeg"},
  {name:"Dairy Milk Chocolate", price:40, img:"images/dairymilk.jpeg"},
  {name:"Butter Cookies", price:50, img:"images/cookies.jpeg"}
];

// ---------------- RENDER PRODUCTS ----------------
function loadProducts() {
  const box = document.getElementById("products-container");
  if (!box) return;

  box.innerHTML = "";
  PRODUCTS.forEach((p, i) => {
    box.innerHTML += `
      <div class="product-card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

// ---------------- ADD TO CART ----------------
function addToCart(i) {
  const p = PRODUCTS[i];

  // check if exists
  let item = cart.find(x => x.name === p.name);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      name: p.name,
      price: p.price,
      img: p.img,
      quantity: 1
    });
  }

  saveCart();
  alert(`${p.name} added to cart ✅`);
}
// ---------------- GO TO CHECKOUT ----------------
const checkoutBtn = document.getElementById("checkoutBtn");


window.onload = loadProducts;