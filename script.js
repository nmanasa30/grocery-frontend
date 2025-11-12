/* ✅ Category List */
const categories = ["All", "Grains", "Snacks", "Dairy", "Vegetables"];

/* ✅ Products */
const products = [
  { name:"Rice (1kg)", price:60, category:"Grains", img:"images/rice.jpeg" },
  { name:"Corn Flour (1kg)", price:50, category:"Grains", img:"images/cone.webp" },
  { name:"Freedom Oil (1L)", price:90, category:"Grains", img:"images/freedom oil.webp" },
  { name:"Green Gram (1kg)", price:68, category:"Grains", img:"images/green.webp" },
  { name:"Red Gram (1kg)", price:88, category:"Grains", img:"images/red.webp" },
  { name:"Maida Flour (1kg)", price:50, category:"Grains", img:"images/mida.webp" },
  { name:"Wheat Flour (1kg)", price:55, category:"Grains", img:"images/wheat.webp" },
  { name:"Sugar (1kg)", price:55, category:"Grains", img:"images/sugar.jpeg" },
  { name:"Sunflower Oil (1L)", price:160, category:"Grains", img:"images/oil.jpeg" },

  { name:"Tomato (1kg)", price:40, category:"Vegetables", img:"images/tamoto.jpeg" },
  { name:"Onions (1kg)", price:40, category:"Vegetables", img:"images/onion.jpeg" },

  { name:"Lays Chips", price:20, category:"Snacks", img:"images/lays.jpeg" },
  { name:"Andhra Mixture", price:70, category:"Snacks", img:"images/mixture.jpeg" },
  { name:"Cake", price:40, category:"Snacks", img:"images/cake.webp" },
  { name:"Dark Fantasy", price:90, category:"Snacks", img:"images/dark.webp" },
  { name:"Fuse", price:20, category:"Snacks", img:"images/fuse.webp" },
  { name:"JimJam", price:10, category:"Snacks", img:"images/jimjam.webp" },
  { name:"KitKat", price:40, category:"Snacks", img:"images/kitkat.webp" },
  { name:"Kurkure", price:30, category:"Snacks", img:"images/kurkkure.webp" },
  { name:"Oreo", price:50, category:"Snacks", img:"images/orea.webp" },
  { name:"Snickers", price:20, category:"Snacks", img:"images/snikers.webp" },
  { name:"Maggi Noodles", price:15, category:"Snacks", img:"images/maggi.jpeg" },

  { name:"Milk (1L)", price:50, category:"Dairy", img:"images/milk.jpeg" },

  { name:"Good Day Biscuits", price:30, category:"Snacks", img:"images/goodday.jpeg" },
  { name:"Dairy Milk", price:40, category:"Snacks", img:"images/dairymilk.jpeg" },
  { name:"Butter Cookies", price:50, category:"Snacks", img:"images/cookies.jpeg" }
];

let currentProducts = [...products]; // ✅ Used for filters, sorting, search

/* ✅ Render Category Chips */
const chipContainer = document.getElementById("chips");

categories.forEach(cat => {
  const chip = document.createElement("div");
  chip.className = "chip" + (cat === "All" ? " active" : "");
  chip.innerText = cat;
  chip.onclick = () => filterCategory(cat);
  chipContainer.appendChild(chip);
});

/* ✅ Render Products */
function render(list) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  list.forEach((p, index) => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <p class="price">₹${p.price}</p>
        <button class="btn" onclick="addToCart('${p.name}')">Add to Cart</button>
      </div>
    `;
  });
}

render(currentProducts);

/* ✅ CATEGORY FILTER */
function filterCategory(cat) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  [...document.querySelectorAll(".chip")].find(c => c.innerText === cat).classList.add("active");

  if (cat === "All") currentProducts = [...products];
  else currentProducts = products.filter(p => p.category === cat);

  render(currentProducts);
}

/* ✅ SEARCH */
document.getElementById("searchBar").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = currentProducts.filter(p => p.name.toLowerCase().includes(q));
  render(filtered);
});

/* ✅ SORTING */
document.getElementById("sortBox").addEventListener("change", e => {
  let sorted = [...currentProducts];

  if (e.target.value === "low") sorted.sort((a, b) => a.price - b.price);
  if (e.target.value === "high") sorted.sort((a, b) => b.price - a.price);
  if (e.target.value === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));

  render(sorted);
});

/* ✅ Add to Cart (just toast for now) */
function addToCart(name) {
  alert(`${name} added to cart ✅`);

}
function addToCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // find product by name
  const product = products.find(p => p.name === name);
  if (!product) return alert("Product not found!");

  // find existing item
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart 🛒✅`);
}

/* ✅ SLIDER SCRIPT */
let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");

/* Create dots dynamically */
slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.onclick = () => goToSlide(i);
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function goToSlide(index) {
  currentIndex = index;
  showSlide(currentIndex);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

/* Arrows */
document.querySelector(".next").onclick = nextSlide;
document.querySelector(".prev").onclick = prevSlide;

/* Auto Slide */
setInterval(nextSlide, 4000);
// ✅ Back to Top Button
const backBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backBtn.style.display = "flex";
  } else {
    backBtn.style.display = "none";
  }
});

backBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.getElementById("subscribeBtn").addEventListener("click", () => {
  let email = document.getElementById("subscribeEmail").value;
  let msg = document.getElementById("subscribeMsg");

  if (email.trim() === "") {
    msg.style.color = "tomato";
    msg.textContent = "Please enter a valid email.";
    return;
  }

  msg.style.color = "#84C225";
  msg.textContent = "✅ Thank you for subscribing!";
});
function subscribeEmail() {
  let email = document.getElementById("emailInput").value;

  if (email === "") {
    alert("Please enter an email address.");
    return;
  }

  alert("Thank you! You will receive our updates at: " + email);
}