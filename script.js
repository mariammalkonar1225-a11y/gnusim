
const products = [
  { id: 1, name: "Classic Cappuccino", category: "Coffee", price: 149, description: "Smooth espresso with creamy milk foam.", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80", emoji: "☕" },
  { id: 2, name: "Caramel Latte", category: "Coffee", price: 179, description: "Velvety latte with a caramel twist.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80", emoji: "🥤" },
  { id: 3, name: "Iced Mocha", category: "Cold", price: 169, description: "Chilled coffee with chocolate goodness.", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", emoji: "🧋" },
  { id: 4, name: "Strawberry Cooler", category: "Cold", price: 129, description: "A fruity, refreshing little pick-me-up.", image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80", emoji: "🍓" },
  { id: 5, name: "Chocolate Brownie", category: "Dessert", price: 99, description: "Rich chocolate in every delicious bite.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", emoji: "🍫" },
  { id: 6, name: "Strawberry Cheesecake", category: "Dessert", price: 189, description: "Creamy cheesecake with fruity sweetness.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", emoji: "🍰" }
];

let cart = [];

function renderMenu(category = "All") {
  const grid = document.getElementById("menuGrid");
  const filtered = category === "All" ? products : products.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => `
    <article class="menu-card">
      <div class="menu-image">
        <img src="${p.image}" alt="${p.name}"
          onerror="this.style.display='none';this.parentElement.innerHTML='<div style=&quot;display:grid;place-items:center;height:100%;font-size:60px&quot;>${p.emoji}</div>'">
      </div>
      <div class="menu-details">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="menu-bottom">
          <span class="price">₹${p.price}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterMenu(category, button) {
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderMenu(category);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);

  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  renderCart();
  showToast(product.name + " added to your cart!");
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  renderCart();
}

function getBill() {
  const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discount = subtotal >= 100 ? 10 : 0;
  return { subtotal, discount, total: subtotal - discount };
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  document.getElementById("cartCount").textContent = count;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">🛍️<p>Your cart is waiting for something delicious.</p></div>';
  } else {
    container.innerHTML = cart.map(p => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${p.name}</strong><small>₹${p.price} each</small>
        </div>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${p.id}, -1)">−</button>
          <span>${p.quantity}</span>
          <button onclick="changeQuantity(${p.id}, 1)">+</button>
        </div>
        <strong>₹${p.price * p.quantity}</strong>
      </div>
    `).join("");
  }

  const bill = getBill();
  document.getElementById("subtotal").textContent = "₹" + bill.subtotal;
  document.getElementById("discount").textContent = "₹" + bill.discount;
  document.getElementById("total").textContent = "₹" + bill.total;
  updateMemoryPanel();
}

function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}

/* Checkout interface */
function checkout() {
  if (!cart.length) {
    alert("Your cart is empty. Add something delicious first.");
    return;
  }

  document.getElementById("paymentTotal").textContent = "₹" + getBill().total;
  document.getElementById("paymentModal").style.display = "flex";
}

function closePayment() {
  document.getElementById("paymentModal").style.display = "none";
}

function confirmPayment() {
  if (!cart.length) {
    closePayment();
    alert("Your cart is empty.");
    return;
  }

  const selected = document.querySelector('input[name="paymentMethod"]:checked');
  if (!selected) {
    alert("Please choose a payment method.");
    return;
  }

  const bill = getBill();
  const method = selected.value;
  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  closePayment();

  alert(
    "Thank you for choosing Brew & Byte!\n\n" +
    "Order number: BB" + orderNumber + "\n" +
    "Total: ₹" + bill.total + "\n" +
    "Payment method: " + method + "\n\n" +
    "Your order has been placed."
  );

  cart = [];
  renderCart();
}

/* GNUSim8085 bill example */
function toHex(value) {
  return value.toString(16).toUpperCase().padStart(2, "0") + "H";
}

function updateMemoryPanel() {
  const bill = getBill();
  document.getElementById("memSubtotal").textContent = toHex(Math.min(bill.subtotal, 255));
  document.getElementById("memDiscount").textContent = toHex(bill.discount);
  document.getElementById("memTotal").textContent = toHex(Math.min(bill.total, 255));
}

function prepare8085() {
  const bill = getBill();

  if (bill.subtotal > 255) {
    document.getElementById("labMessage").textContent =
      "The 8085 example supports a subtotal up to ₹255. Reduce your cart total and try again.";
    return;
  }

  const hex = bill.subtotal.toString(16).toUpperCase().padStart(2, "0");
  document.getElementById("labMessage").textContent =
    "Enter " + hex + "H at memory location 2050H in GNUSim8085. Expected discount: " +
    toHex(bill.discount) + "; payable: " + toHex(bill.total) + ".";
  updateMemoryPanel();
}

/* Ambient sound generator */
let audioContext = null;
let masterGain = null;
let rainGain = null;
let cafeGain = null;
let musicGain = null;
let audioStarted = false;
let muted = false;
let noiseSources = [];

function makeNoiseBuffer(context, seconds = 3) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function createNoise(context, destination, filterType, frequency, volume) {
  const source = context.createBufferSource();
  source.buffer = makeNoiseBuffer(context);
  source.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;

  const gain = context.createGain();
  gain.gain.value = volume;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start();

  noiseSources.push(source);
  return gain;
}

function createTone(context, destination, frequency, volume) {
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const gain = context.createGain();
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();

  noiseSources.push(oscillator);
  return gain;
}

async function startSounds() {
  const status = document.getElementById("soundStatus");

  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        status.textContent = "Audio is not supported by this browser. Try an updated browser.";
        return;
      }

      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(audioContext.destination);

      rainGain = createNoise(audioContext, masterGain, "lowpass", 1000, 0.35);
      cafeGain = createNoise(audioContext, masterGain, "lowpass", 240, 0.12);

      musicGain = audioContext.createGain();
      musicGain.gain.value = 0.08;
      musicGain.connect(masterGain);

      // Gentle, original electronic tones.
      [261.63, 329.63, 392.00, 440.00].forEach((frequency, index) => {
        createTone(audioContext, musicGain, frequency, index % 2 === 0 ? 0.012 : 0.008);
      });

      audioStarted = true;
    }

    if (audioContext.state === "closed") {
      status.textContent = "Please refresh the page to restart the ambience.";
      return;
    }

    await audioContext.resume();
    applyVolumes();
    document.getElementById("soundToggle").textContent = "Ⅱ Pause sounds";
    status.textContent = "Your cafe is open. Enjoy the ambience ♡";
  } catch (error) {
    status.textContent = "Sound could not start. Please click Start sounds again.";
  }
}

async function toggleSound() {
  if (!audioStarted || !audioContext || audioContext.state === "suspended") {
    await startSounds();
    return;
  }

  if (audioContext.state === "running") {
    await audioContext.suspend();
    document.getElementById("soundToggle").textContent = "▶ Resume sounds";
    document.getElementById("soundStatus").textContent = "Sounds paused.";
  } else {
    await startSounds();
  }
}

function applyVolumes() {
  if (!audioContext || !audioStarted) return;

  const rain = Number(document.getElementById("rainVolume").value) / 100;
  const cafe = Number(document.getElementById("cafeVolume").value) / 100;
  const music = Number(document.getElementById("musicVolume").value) / 100;
  const now = audioContext.currentTime;

  rainGain.gain.setTargetAtTime(muted ? 0 : rain * 0.35, now, 0.08);
  cafeGain.gain.setTargetAtTime(muted ? 0 : cafe * 0.12, now, 0.08);
  musicGain.gain.setTargetAtTime(muted ? 0 : music * 0.08, now, 0.08);
}

function updateVolumeLabels() {
  ["rain", "cafe", "music"].forEach(name => {
    document.getElementById(name + "Value").textContent =
      document.getElementById(name + "Volume").value + "%";
  });

  muted = false;
  applyVolumes();

  if (audioStarted && audioContext && audioContext.state === "running") {
    document.getElementById("soundStatus").textContent = "Your sound mix has been updated.";
  }
}

function muteSounds() {
  muted = true;
  applyVolumes();
  document.getElementById("soundStatus").textContent = "All sounds are muted.";
  document.getElementById("soundToggle").textContent = "▶ Resume sounds";
}

["rainVolume", "cafeVolume", "musicVolume"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateVolumeLabels);
});

/* Notifications */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}

document.getElementById("paymentModal").addEventListener("click", function(event) {
  if (event.target === this) closePayment();
});

renderMenu();
renderCart();