// -------------------- GLOBAL VARIABLES --------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const API_BASE = "https://grocery-backend.onrender.com/api";
const BACKEND_URL = "https://grocery-backend.onrender.com"; // Live backend URL
let currentProducts = []; // store backend products for search/filter/sort
const container = document.getElementById("products-container");
const cartContainer = document.getElementById("cart-container");
// ------------------ LOAD PRODUCTS ------------------
async function loadProductsFromBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/products`);
    const products = await res.json();
    currentProducts = products; // save for search/filter/sort
    loadProducts(products);
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function loadProducts(list) {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product");
    card.setAttribute("data-category", p.category);
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// ------------------ ADD TO CART ------------------
function addToCart(name, price, img){
  const existing = cart.find(i => i.name === name);
  if(existing) existing.quantity++;
  else cart.push({name, price, img, quantity:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  alert(`${name} added to cart!`);
}

// ------------------ RENDER CART ------------------
function renderCart(){
  const cartContainer = document.getElementById('cart-items');
  if(!cartContainer) return;
  cartContainer.innerHTML = '';
  if(cart.length === 0){ cartContainer.innerHTML='<p>Your cart is empty.</p>'; return; }

  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML = `
      <img src="${item.img}" width="60">
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="qty">
          <button onclick="changeQty(${idx}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  const total = cart.reduce((sum,i)=>sum + i.price*i.quantity,0);
  const totalDiv = document.createElement('p');
  totalDiv.textContent = `Total: ₹${total}`;
  cartContainer.appendChild(totalDiv);

  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = 'Checkout';
  checkoutBtn.onclick = handleCheckout;
  cartContainer.appendChild(checkoutBtn);
}

function changeQty(idx, delta){
  cart[idx].quantity += delta;
  if(cart[idx].quantity <= 0) cart.splice(idx,1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// ------------------ SEARCH ------------------
function searchProducts(){
  const query = document.getElementById('searchBar').value.toLowerCase();
  const filtered = currentProducts.filter(p => p.name.toLowerCase().includes(query));
  loadProducts(filtered);
}

// ------------------ FILTER ------------------
function filterProducts(){
  const category = document.getElementById('categoryFilter').value;
  const filtered = category==='all' ? currentProducts : currentProducts.filter(p=>p.category===category);
  loadProducts(filtered);
}

// ------------------ SORT ------------------
function sortProducts(){
  const sortBy = document.getElementById('priceSort').value;
  let sorted = [...currentProducts];

  if(sortBy==='low') sorted.sort((a,b)=>a.price-b.price);
  else if(sortBy==='high') sorted.sort((a,b)=>b.price-a.price);

  // Apply category filter if selected
  const category = document.getElementById('categoryFilter').value;
  if(category!=='all') sorted = sorted.filter(p=>p.category===category);

  loadProducts(sorted);
}

// ------------------ LOGIN ------------------
async function handleLogin() {
  const username = document.getElementById('username')?.value;
  const password = document.getElementById('password')?.value;

  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(data.success){
      localStorage.setItem('loggedUser', username);
      alert("Login successful!");
      window.location.href = 'index.html';
    } else {
      alert("Invalid username or password!");
    }
  } catch(err){
    console.error("Login failed:", err);
    alert("Server error during login.");
  }
}

// ------------------ CHECKOUT ------------------
async function handleCheckout() {
  if(cart.length === 0){ alert("Cart is empty!"); return; }

  try {
    const res = await fetch(`${BACKEND_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart })
    });
    const data = await res.json();
    if(data.success){
      alert(`Order placed! Order ID: ${data.orderId}`);
      cart = [];
      localStorage.removeItem('cart');
      renderCart();
      window.location.href = 'thankyou.html';
    } else {
      alert("Checkout failed!");
    }
  } catch(err){
    console.error("Checkout failed:", err);
    alert("Server error during checkout.");
  }
}
fetch("https://grocery-backend.onrender.com/products")

// ------------------ INITIALIZE ------------------
document.addEventListener('DOMContentLoaded',()=>{
  loadProductsFromBackend();
  renderCart();
// ---------------- SIGNUP ----------------
async function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message);
}

// ---------------- CHECKOUT ----------------
async function checkout() {
    const phoneNumber = document.getElementById("phone-number").value;
    if (!phoneNumber || cart.length === 0) {
        alert("Add items to cart and enter phone number");
        return;
    }

    // Create order
    const orderRes = await fetch(`${API_BASE}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, phoneNumber })
    });
    const orderData = await orderRes.json();
    alert(orderData.message);

    // Simulate Payment
    const paymentRes = await fetch(`${API_BASE.replace("/api", "")}/createPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId, amount: cart.reduce((a,b)=>a+b.price*b.qty,0), phoneNumber })
    });
    const paymentData = await paymentRes.json();
    alert(`Payment status: ${paymentData.status}`);
// Clear cart
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ---------------- INITIALIZE ----------------
loadProducts();
renderCart();
  const user = localStorage.getItem('loggedUser');
  if(user){
    const userDiv = document.createElement('div');
    userDiv.id='loggedUser';
    userDiv.innerHTML=`Welcome, ${user} <button id="logoutBtn">Logout</button>`;
    document.body.prepend(userDiv);
    document.getElementById('logoutBtn').onclick=()=>{ 
      localStorage.removeItem('loggedUser'); 
      window.location.href='login.html';
    };
  } else if(window.location.pathname.includes('index.html')){
    window.location.href='login.html';
  }
});
