let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cartSummary");
const checkoutForm = document.getElementById("checkoutForm");
const thankYouDiv = document.getElementById("thankYou");
const phonepeBtn = document.getElementById("phonepe-pay");

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
    const qty = item.quantity || item.qty || 1;
    const itemTotal = item.price * qty;
    total += itemTotal;

    cartSummary.innerHTML += `
      <div class="checkout-item" style="display:flex; align-items:center; margin-bottom:10px;">
        <img src="${item.image || 'images/default.png'}" alt="${item.name}" width="60" style="margin-right:10px;">
        <div>
          <p><strong>${item.name}</strong> x ${qty}</p>
          <p>₹${itemTotal}</p>
        </div>
      </div>
    `;
  });

  cartSummary.innerHTML += `<p><strong>Total: ₹${total}</strong></p>`;
}

window.onload = loadCartSummary;

// ------------------ FORM SUBMISSION ------------------
checkoutForm.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !email || !address) {
    alert("Please fill all the details!");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert(`Thank you ${name}! Your order has been placed successfully.\nPayment Method: ${payment}`);
  localStorage.removeItem("cart");
  cart = [];
  loadCartSummary();
  checkoutForm.style.display = "none";
  thankYouDiv.style.display = "block";
});

// ------------------ PHONEPE PAYMENT SIMULATION ------------------
if (phonepeBtn) {
  phonepeBtn.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const phoneNumber = prompt("Enter your phone number:");
    if (!phoneNumber) {
      alert("Checkout cancelled");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || item.qty || 1), 0);
    const orderId = "ORDER_" + new Date().getTime();

    try {
      alert(`Redirecting to PhonePe for ₹${totalAmount}...`);
      setTimeout(() => {
        alert(`Payment successful via PhonePe! Order ID: ${orderId}`);
        localStorage.removeItem("cart");
        cart = [];
        loadCartSummary();
        checkoutForm.style.display = "none";
        thankYouDiv.style.display = "block";
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  });
}

