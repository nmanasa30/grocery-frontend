const categories = ["All", "Grains", "Snacks", "Dairy", "Vegetables"];

const products = [
  { name: "Rice", price: 1200, category: "Grains", img: "images/rice.jpeg" },
  { name: "Oil", price: 180, category: "Grains", img: "images/oil.jpeg" },
  { name: "Cookies", price: 30, category: "Snacks", img: "images/cookies.jpeg" },
  { name: "Milk", price: 28, category: "Dairy", img: "images/milk.jpeg" },
  { name: "Tomato", price: 35, category: "Vegetables", img: "images/tomato.jpeg" },
  { name: "Potato", price: 25, category: "Vegetables", img: "images/potato.jpeg" }
];

let cartCount = 0;

/* Render Chips */
const chipBox = document.getElementById("chips");

categories.forEach(cat => {
  const c = document.createElement("div");
  c.className = "chip" + (cat === "All" ? " active" : "");
  c.innerText = cat;
  c.onclick = () => filterCategory(cat);
  chipBox.appendChild(c);
});

/* Render Products */
function renderProducts(list) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <button class="add-btn" onclick="addToCart('${p.name}')">Add to Cart</button>
      </div>
    `;
  });
}

renderProducts(products);

/* Filter Category */
function filterCategory(cat) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  [...document.querySelectorAll(".chip")].find(c => c.innerText === cat).classList.add("active");

  if (cat === "All") renderProducts(products);
  else renderProducts(products.filter(p => p.category === cat));
}

/* Search */
document.getElementById("searchBar").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(q)));
});

/* Add to Cart */
function addToCart(name) {
  cartCount++;
  document.getElementById("cartLink").dataset.count = cartCount;
  showToast(name + " added to cart ✅");
}

/* Toast */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => {
    t.style.display = "none";
  }, 1500);
}
