// -------------------- GLOBAL VARIABLES --------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const BACKEND_URL = "https://grocery-backend.onrender.com";

let currentProducts = [
  {name:"Rice (1kg)", price:60, category:"grains", img:"images/rice.jpeg"},
  {name:"Corn Flour (1kg)", price:50, category:"grains", img:"images/cone.webp"},
  {name:"Freedom Oil (1L)", price:90, category:"grains", img:"images/freedom oil.webp"},
  {name:"Green Gram (1kg)", price:68, category:"grains", img:"images/green.webp"},
  {name:"Red Gram (1kg)", price:88, category:"grains", img:"images/red.webp"},
  {name:"Maida Flour (1kg)", price:50, category:"grains", img:"images/mida.webp"},
  {name:"Wheat Flour (1kg)", price:55, category:"grains", img:"images/wheat.webp"},
  {name:"Sugar (1kg)", price:55, category:"grains", img:"images/sugar.jpeg"},
  {name:"Sunflower Oil (1L)", price:160, category:"grains", img:"images/oil.jpeg"},
  {name:"Tomato (1kg)", price:40, category:"vegetables", img:"images/tamoto.jpeg"},
  {name:"Onions (1kg)", price:40, category:"vegetables", img:"images/onion.jpeg"},
  {name:"Lays Chips", price:20, category:"snacks", img:"images/lays.jpeg"},
  {name:"Andhra Mixture (500g)", price:70, category:"snacks", img:"images/mixture.jpeg"},
  {name:"Cake", price:40, category:"snacks", img:"images/cake.webp"},
  {name:"Dark Fantasy", price:90, category:"snacks", img:"images/dark.webp"},
  {name:"Fuse", price:20, category:"snacks", img:"images/fuse.webp"},
  {name:"JimJam", price:10, category:"snacks", img:"images/jimjam.webp"},
  {name:"Kitkat", price:40, category:"snacks", img:"images/kitkat.webp"},
  {name:"Kurkure", price:30, category:"snacks", img:"images/kurkkure.webp"},
  {name:"Oreo", price:50, category:"snacks", img:"images/orea.webp"},
  {name:"Snickers", price:20, category:"snacks", img:"images/snikers.webp"},
  {name:"Maggi Noodles", price:15, category:"snacks", img:"images/maggi.jpeg"},
  {name:"Milk (1L)", price:50, category:"dairy", img:"images/milk.jpeg"},
  {name:"Good Day Biscuits", price:30, category:"dairy", img:"images/goodday.jpeg"},
  {name:"Dairy Milk Chocolate", price:40, category:"dairy", img:"images/dairymilk.jpeg"},
  {name:"Butter Cookies", price:50, category:"dairy", img:"images/cookies.jpeg"}
];

// -------------------- ADD TO CART --------------------
function addToCart(name) {
  const product = currentProducts.find(p => p.name === name);
  const existing = cart.find(i => i.name === product.name);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} added to cart 🛒`);
  renderCart();
}

// -------------------- RENDER PRODUCTS --------------------
function displayProducts(list = currentProducts) {
  const container = document.getElementById('products-container');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.name}')">Add to Cart</button>
      </div>`;
  });
}

// -------------------- SEARCH / FILTER / SORT --------------------
function searchProducts() {
  const q = document.getElementById('searchBar')?.value.toLowerCase() || '';
  const result = currentProducts.filter(p => p.name.toLowerCase().includes(q));
  displayProducts(result);
}

function filterProducts() {
  const cat = document.getElementById('categoryFilter')?.value || 'all';
  const list = cat === 'all' ? currentProducts : currentProducts.filter(p => p.category === cat);
  displayProducts(list);
}

function sortProducts() {
  const s = document.getElementById('priceSort')?.value || 'default';
  let list = [...currentProducts];
  if (s === 'low') list.sort((a, b) => a.price - b.price);
  else if (s === 'high') list.sort((a, b) => b.price - a.price);
  displayProducts(list);
}

// -------------------- CART --------------------
function renderCart() {
  const container = document.getElementById('cartContainer');
  const totalContainer = document.getElementById('totalContainer');
  if (!container) return;

  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    totalContainer.textContent = '';
    return;
  }

  let total = 0;
  cart.forEach((item, i) => {
    const sub = item.price * item.quantity;
    total += sub;
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="qty">
          <button onclick="changeQty(${i}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${i}, 1)">+</button>
          <button onclick="removeItem(${i})">🗑️</button>
        </div>
      </div>`;
  });
  totalContainer.textContent = `Total Amount: ₹${total}`;
}

function changeQty(i, d) {
  cart[i].quantity += d;
  if (cart[i].quantity <= 0) cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// -------------------- CHECKOUT --------------------
function phonePePay() {
  if (cart.length === 0) return alert("Your cart is empty!");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  alert(`Payment successful! ₹${total} paid via PhonePe 📱`);
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// -------------------- INIT --------------------
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  renderCart();
});
