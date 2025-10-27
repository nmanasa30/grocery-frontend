// ------------------ GLOBAL VARIABLES ------------------
const BACKEND_URL = "https://grocery-backend.onrender.com/api";
let products = []; // fetched from backend

  // ------------------ INITIAL SETUP ------------------
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary = document.getElementById("cartSummary");
  const checkoutForm = document.getElementById("checkoutForm");
  const thankYouDiv = document.getElementById("thankYou");
  const phonepeBtn = document.getElementById("phonepe-pay");

  // ------------------ LOAD CART SUMMARY ------------------
  function loadCartSummary() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartSummary.innerHTML = "";

    if (cart.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty!</p>";
      checkoutForm.style.display = "none";
      if (phonepeBtn) phonepeBtn.style.display = "none";
      return;
    }

    let total = 0;
    cart.forEach(item => {
      const qty = item.qty || 1;
      const itemTotal = item.price * qty;
      total += itemTotal;

      cartSummary.innerHTML += `
        <div class="checkout-item">
          <img src="${item.img || 'images/default.png'}" alt="${item.name}">
          <div>
            <p><strong>${item.name}</strong> × ${qty}</p>
            <p>₹${itemTotal}</p>
          </div>
        </div>
      `;
    });

    cartSummary.innerHTML += `<p><strong>Total: ₹${total}</strong></p>`;
  }

  window.onload = loadCartSummary;

  // ------------------ FORM SUBMISSION ------------------
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
      alert("⚠️ Please fill all the details!");
      return;
    }

    if (cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    alert(`✅ Thank you ${name}! Your order has been placed successfully.`);
    localStorage.removeItem("cart");
    cart = [];
    loadCartSummary();
    checkoutForm.style.display = "none";
    thankYouDiv.style.display = "block";
  });
   // Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);


  // ------------------ PHONEPE PAYMENT SIMULATION ------------------
  if (phonepeBtn) {
    phonepeBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("🛒 Your cart is empty!");
        return;
      }

      const phoneNumber = prompt("📱 Enter your PhonePe number:");
      if (!phoneNumber) {
        alert("❌ Payment cancelled!");
        return;
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
      const orderId = "ORDER_" + new Date().getTime();

      alert(`Redirecting to PhonePe for ₹${totalAmount}...`);

      setTimeout(() => {
        alert(`🎉 Payment successful via PhonePe! Order ID: ${orderId}`);
        localStorage.removeItem("cart");
        cart = [];
        loadCartSummary();
        checkoutForm.style.display = "none";
        thankYouDiv.style.display = "block";
      // Auto redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }, 2000);
  });
}

