// -------------------- GLOBAL VARIABLES --------------------
let currentProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const BACKEND_URL = "https://grocery-backend.onrender.com"; // Live backend or fake API

// -------------------- DOMContentLoaded --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("products-container");
  const cartContainer = document.getElementById("cart-container");

  // -------------------- Load Products --------------------
  async function loadProducts() {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      currentProducts = await res.json();
      displayProducts(currentProducts);
    } catch (err) {
      console.error("Failed to load products:", err);
      container.innerHTML = "<p>Failed to load products. Try again later.</p>";
    }
  }

  // -------------------- Display Products --------------------
  function displayProducts(list) {
    if (!container) return;
    container.innerHTML = "";
    list.forEach((p, idx) => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${p.img}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <button class="add-to-cart-btn" data-idx="${idx}">Add to Cart</button>
        </div>
      `;
    });
  }

  // -------------------- Add to Cart --------------------
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const idx = e.target.dataset.idx;
      const p = currentProducts[idx];
      const existing = cart.find(i => i.name === p.name);
      if (existing) existing.quantity++;
      else cart.push({ ...p, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      alert(`${p.name} added to cart!`);
    }
  });

  // -------------------- Render Cart --------------------
  function renderCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach((item, idx) => {
      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" width="60">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
            <div class="qty">
              <button class="change-qty" data-idx="${idx}" data-delta="-1">-</button>
              <span>${item.quantity}</span>
              <button class="change-qty" data-idx="${idx}" data-delta="1">+</button>
            </div>
            <button class="remove-item" data-idx="${idx}">Remove</button>
          </div>
        </div>
      `;
    });

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cartContainer.innerHTML += `<p>Total: ₹${total}</p>`;
    cartContainer.innerHTML += `<button id="checkout-btn">Checkout</button>`;

    // Cart buttons
    document.querySelectorAll(".change-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.idx;
        const delta = parseInt(btn.dataset.delta);
        cart[idx].quantity += delta;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.idx;
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
  }

  // -------------------- Search / Filter / Sort --------------------
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filtered = currentProducts.filter(p => p.name.toLowerCase().includes(searchInput.value.toLowerCase()));
      displayProducts(filtered);
    });
  }

  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const filtered = categoryFilter.value === "all" ? currentProducts : currentProducts.filter(p => p.category === categoryFilter.value);
      displayProducts(filtered);
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sorted = [...currentProducts].sort((a, b) => sortSelect.value === "asc" ? a.price - b.price : b.price - a.price);
      displayProducts(sorted);
    });
  }

  // -------------------- Login --------------------
  window.handleLogin = async function () {
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('loggedUser', username);
        alert("Login successful!");
        window.location.href = 'index.html';
      } else alert("Invalid username or password!");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Server error during login.");
    }
  };

  // -------------------- Signup --------------------
  window.signup = async function () {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Server error during signup.");
    }
  };

  // -------------------- Checkout --------------------
  async function checkout() {
    const phoneNumber = document.getElementById("phone-number")?.value;
    if (!phoneNumber || cart.length === 0) {
      alert("Add items to cart and enter phone number");
      return;
    }

    try {
      // Create order
      const orderRes = await fetch(`${BACKEND_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, phoneNumber })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) { alert("Order creation failed!"); return; }

      // Simulate PhonePe / UPI link
      const amount = cart.reduce((a, b) => a + b.price * b.quantity, 0);
      const upiLink = `upi://pay?pa=merchant-vpa@upi&pn=GroceryStore&tr=${orderData.orderId}&tn=Order+Payment&am=${amount}&cu=INR`;
      window.location.href = upiLink;

      // After payment
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      // window.location.href='thankyou.html'; // redirect after real payment
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Error during checkout.");
    }
  }

  // -------------------- Logged User Display --------------------
  const user = localStorage.getItem('loggedUser');
  if (user) {
    const userDiv = document.createElement('div');
    userDiv.id = 'loggedUser';
    userDiv.innerHTML = `Welcome, ${user} <button id="logoutBtn">Logout</button>`;
    document.body.prepend(userDiv);
    document.getElementById('logoutBtn').onclick = () => {
      localStorage.removeItem('loggedUser');
      window.location.href = 'login.html';
    };
  } else if (window.location.pathname.includes('index.html')) {
    window.location.href = 'login.html';
  }

  // -------------------- Initialize --------------------
  await loadProducts();
  renderCart();
});
