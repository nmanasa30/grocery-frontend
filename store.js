let cart = JSON.parse(localStorage.getItem('cart')) || [];
const BACKEND_URL = "https://grocery-backend.onrender.com";
let currentProducts = [
  { name: "Rice", price: 60, category: "grains", img: "images/rice.jpeg" },
  { name: "Corn Flour", price: 50, category: "grains", img: "images/cone.webp" },
  { name: "Freedom Oil", price: 120, category: "oil", img: "images/oil.jpeg" },
  { name: "Milk", price: 40, category: "dairy", img: "images/milk.jpeg" },
  { name: "Butter", price: 80, category: "dairy", img: "images/butter.jpeg" },
  { name: "Good Day Biscuits", price: 30, category: "dairy", img: "images/goodday.jpeg" },
  { name: "Dairy Milk Chocolate", price: 40, category: "dairy", img: "images/dairymilk.jpeg" },
  { name: "Butter Cookies", price: 50, category: "dairy", img: "images/cookies.jpeg" }
];

// ---------- Logged User ----------
const user = localStorage.getItem('loggedUser');
if(user){
  document.querySelectorAll('#user-welcome').forEach(el=>{
    el.innerHTML = `Welcome, ${user} <button onclick="logout()">Logout</button>`;
  });
}
function logout(){ localStorage.removeItem('loggedUser'); location.href='login.html'; }

// ---------- Display Products ----------
function displayProducts(list){
  const container = document.getElementById('products-container');
  if(!container) return;
  container.innerHTML='';
  list.forEach(p=>{
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCartByName('${p.name}')">Add to Cart</button>
      </div>
    `;
  });
}

// ---------- Add to Cart ----------
function addToCartByName(name){
  const p = currentProducts.find(prod => prod.name === name);
  const existing = cart.find(i => i.name===p.name);
  if(existing) existing.quantity++;
  else cart.push({...p, quantity:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// ---------- Render Cart ----------
function renderCart(){
  const container = document.getElementById('cart-container');
  if(!container) return;
  container.innerHTML='';
  if(cart.length===0){ container.innerHTML='<p>Your cart is empty</p>'; return; }
  cart.forEach((item,idx)=>{
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="qty">
          <button onclick="changeQty(${idx},-1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
    `;
  });
  const total = cart.reduce((sum,i)=>sum+i.price*i.quantity,0);
  container.innerHTML += `<p>Total: ₹${total}</p>`;
}

// ---------- Change Quantity ----------
function changeQty(idx, delta){
  cart[idx].quantity += delta;
  if(cart[idx].quantity<=0) cart.splice(idx,1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// ---------- Search / Filter / Sort ----------
function searchProducts(){
  const query = document.getElementById('searchBar')?.value.toLowerCase()||'';
  displayProducts(currentProducts.filter(p=>p.name.toLowerCase().includes(query)));
}
function filterProducts(){
  const category = document.getElementById('categoryFilter')?.value||'all';
  const filtered = category==='all'?currentProducts:currentProducts.filter(p=>p.category===category);
  displayProducts(filtered);
}
function sortProducts(){
  const sortBy = document.getElementById('priceSort')?.value||'default';
  let sorted = [...currentProducts];
  if(sortBy==='low') sorted.sort((a,b)=>a.price-b.price);
  else if(sortBy==='high') sorted.sort((a,b)=>b.price-a.price);
  displayProducts(sorted);
}

// ---------- Checkout ----------
function checkout(){
  const phone = document.getElementById('phone-number')?.value;
  if(!phone || cart.length===0){ alert("Add items & enter phone number"); return; }
  alert(`Order placed! Payment simulated for ${phone}`);
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  window.location.href='delivery.html';
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded',()=>{
  displayProducts(currentProducts);
  renderCart();
});
