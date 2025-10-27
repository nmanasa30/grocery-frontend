
// -------------------- CENTRAL DATA --------------------
const currentProducts = [
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

// cart stored as array of {name, price, img, quantity}
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ---------- Helpers ----------
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log("Cart saved:", cart);
}

// Universal addToCart (can be called from inline attributes or buttons)
window.addToCart = function(indexOrName, priceOrUndefined, imgOrUndefined) {
  // Accept either (index) or (name, price, img)
  let product;
  if (typeof indexOrName === "number") {
    product = currentProducts[indexOrName];
    if (!product) { alert("Product not found"); return; }
  } else {
    product = { name: indexOrName, price: priceOrUndefined || 0, img: imgOrUndefined || 'images/default.png' };
  }

  const existing = cart.find(item => item.name === product.name);
  if (existing) existing.quantity++;
  else cart.push({ name: product.name, price: product.price, img: product.img || 'images/default.png', quantity: 1 });

  saveCart();
  alert(`${product.name} added to cart 🛒`);
  // If cart page visible, re-render
  if (document.getElementById('cart-items')) renderCartPage();
};

// ---------- INDEX / PRODUCTS PAGE ----------
// Renders into element id="productList" if present
function renderProductList(list = currentProducts) {
  const productList = document.getElementById('productList') || document.getElementById('products-container');
  if (!productList) return;
  productList.innerHTML = ''; // clear existing

  list.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'product';
    card.dataset.category = p.category || 'all';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button class="add-btn" data-idx="${idx}">Add to Cart</button>
    `;
    productList.appendChild(card);
  });

  // Delegated event for add buttons
  productList.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(btn.dataset.idx);
      addToCart(i);
    });
  });
}

// ---------- SEARCH, FILTER, SORT ----------
function setupSearchFilterSort() {
  const searchBar = document.getElementById('searchBar') || document.getElementById('search');
  const categoryFilter = document.getElementById('categoryFilter') || document.getElementById('category-filter');
  const priceSort = document.getElementById('priceSort') || document.getElementById('priceSort') || document.getElementById('sort-select');

  function applyAll() {
    let list = [...currentProducts];

    // search
    const q = (searchBar && searchBar.value) ? searchBar.value.trim().toLowerCase() : '';
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    // filter
    const cat = categoryFilter ? categoryFilter.value : 'all';
    if (cat && cat !== 'all') list = list.filter(p => p.category === cat);

    // sort
    const s = priceSort ? priceSort.value : 'default';
    if (s === 'low') list.sort((a,b)=>a.price-b.price);
    if (s === 'high') list.sort((a,b)=>b.price-a.price);
    if (s === 'asc') list.sort((a,b)=>a.price-b.price);
    if (s === 'desc') list.sort((a,b)=>b.price-a.price);

    renderProductList(list);
  }

  if (searchBar) searchBar.addEventListener('input', applyAll);
  if (categoryFilter) categoryFilter.addEventListener('change', applyAll);
  if (priceSort) priceSort.addEventListener('change', applyAll);
}

// ---------- CART PAGE RENDER ----------
function renderCartPage() {
  const cartItems = document.getElementById('cart-items') || document.getElementById('cart-items-container') || document.getElementById('cart-container');
  const cartTotal = document.getElementById('cart-total') || document.getElementById('cart-total') || document.getElementById('totalContainer');

  if (!cartItems) return;

  cartItems.innerHTML = '';
  if (!cart || cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    if (cartTotal) cartTotal.textContent = '';
    return;
  }

  let total = 0;
  cart.forEach((it, idx) => {
    const subtotal = (it.price || 0) * (it.quantity || 1);
    total += subtotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${it.img || 'images/default.png'}" alt="${it.name}" width="60">
      <div class="cart-info">
        <h4>${it.name}</h4>
        <p>Price: ₹${it.price}</p>
        <p>Subtotal: ₹${subtotal}</p>
      </div>
      <div class="cart-actions">
        <button class="dec" data-idx="${idx}">−</button>
        <span class="qty">${it.quantity}</span>
        <button class="inc" data-idx="${idx}">+</button>
        <button class="rm" data-idx="${idx}">🗑️</button>
      </div>
    `;
    cartItems.appendChild(itemDiv);
  });

  if (cartTotal) cartTotal.textContent = `Total Amount: ₹${total}`;

  // buttons
  cartItems.querySelectorAll('.inc').forEach(b => b.addEventListener('click', (e)=>{
    const i = parseInt(b.dataset.idx); cart[i].quantity++; saveCart(); renderCartPage();
  }));
  cartItems.querySelectorAll('.dec').forEach(b => b.addEventListener('click', (e)=>{
    const i = parseInt(b.dataset.idx); if (cart[i].quantity>1) cart[i].quantity--; else cart.splice(i,1); saveCart(); renderCartPage();
  }));
  cartItems.querySelectorAll('.rm').forEach(b => b.addEventListener('click', (e)=>{
    const i = parseInt(b.dataset.idx); cart.splice(i,1); saveCart(); renderCartPage();
  }));
}

// ---------- CHECKOUT (PhonePe simulation) ----------
window.phonePePay = function() {
  if (!cart || cart.length === 0) { alert("Cart empty"); return; }
  const total = cart.reduce((s,i)=>s + (i.price||0)*(i.quantity||1), 0);
  alert(`Simulated PhonePe payment of ₹${total} successful!`);
  cart = []; saveCart(); renderCartPage();
  // redirect to thank you page if exists: window.location.href='thankyou.html';
};

// ---------- INIT on DOM ready ----------
document.addEventListener('DOMContentLoaded', () => {
  // Render product list on index page if productList exists OR products-container exists
  if (document.getElementById('productList') || document.getElementById('products-container')) {
    renderProductList(currentProducts);
    setupSearchFilterSort();
  }

  // If the page has static product elements (already in HTML) and the user uses inline onclick addToCart('Name', price)
  // we already provided window.addToCart that accepts (name, price, img). So both modes supported.

  // Render cart if cart page present
  if (document.getElementById('cart-items') || document.getElementById('cart-container') || document.getElementById('cart-items-container')) {
    renderCartPage();
  }

  // debug helpers in console
  console.log("App initialized. Products:", currentProducts.length, "Cart items:", cart.length);
});
