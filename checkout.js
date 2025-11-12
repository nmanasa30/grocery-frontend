const BACKEND_URL = "https://grocery-backend-7hlc.onrender.com";  // ✅ Your Render backend

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const summaryBox = document.getElementById("cartSummary");
const totalAmount = document.getElementById("totalAmount");
const form = document.getElementById("checkoutForm");
const thankYou = document.getElementById("thankYou");
const phonepeBtn = document.getElementById("phonepeBtn");

/* ✅ Load Cart Summary */
function loadSummary() {
  summaryBox.innerHTML = "";
  if (cart.length === 0) {
    summaryBox.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalAmount.textContent = "Total: ₹0";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const sub = item.price * item.quantity;
    total += sub;

    summaryBox.innerHTML += `
      <div class="checkout-item">
        <div style="display:flex; align-items:center;">
          <img src="${item.img}" width="60" height="60" style="margin-right:10px;">
          <div>
            <p><strong>${item.name}</strong></p>
            <p>₹${item.price} × ${item.quantity}</p>
          </div>
        </div>
        <p>₹${sub}</p>
      </div>
    `;
  });

  totalAmount.textContent = "Total: ₹" + total;
}
loadSummary();

/* ✅ Save order history in localStorage */
function saveOrderHistory(order) {
  let orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  orders.push(order);
  localStorage.setItem("orderHistory", JSON.stringify(orders));
}

/* ✅ Place Order (send to backend + thank you) */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let pincode = document.getElementById("pincode").value.trim();

  if (!name || !phone || !address || !pincode) {
    alert("Please fill all details!");
    return;
  }

  const orderData = { name, phoneNumber: phone, address, pincode, cart };

  try {
    const res = await fetch(`${BACKEND_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.status === "success") {
      saveOrderHistory({ ...orderData, orderId: data.orderId });
      alert("✅ Order saved! Please scan and pay now.");
      localStorage.setItem("currentOrderId", data.orderId);
    } else {
      alert("⚠️ Order failed: " + data.message);
    }

  } catch (err) {
    console.error(err);
    alert("❌ Server error while placing order!");
  }
});

/* ✅ PhonePe payment click */
phonepeBtn.addEventListener("click", async () => {
  if (cart.length === 0) return alert("Cart is empty!");

  alert("📱 Please scan the QR code using PhonePe or GPay to pay.");

  const orderId = localStorage.getItem("currentOrderId");
  if (orderId) {
    try {
      // Notify backend that payment succeeded
      await fetch(`${BACKEND_URL}/api/payment-success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      console.log("Payment success recorded for order:", orderId);
    } catch (err) {
      console.error("Payment update failed", err);
    }
  }

  // Save last order for the success page
  const lastOrder = {
    id: orderId || Date.now(),
    name: document.getElementById("name").value.trim(),
    cart
  };
  localStorage.setItem("lastOrder", JSON.stringify(lastOrder));

  localStorage.removeItem("cart");
  setTimeout(() => (window.location.href = "payment-success.html"), 3000);
});
