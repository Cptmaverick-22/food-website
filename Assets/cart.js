let cart = []; // array of {item, price, quantity}
let total = 0;

function addToCart(item, price) {
  const existingItem = cart.find(i => i.item === item);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, price, quantity: 1 });
  }
  calculateTotal();
  updateCartDisplay();
  renderCartPopup(); // live update
  showAddToCartNotification();
}

function removeFromCart(item) {
  cart = cart.filter(i => i.item !== item); // Remove item
  calculateTotal();
  updateCartDisplay();
  renderCartPopup(); // Re-render the updated cart popup
}

function calculateTotal() {
  total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function updateCartDisplay() {
  const navTotal = document.getElementById("nav-total");
  if (navTotal) {
    navTotal.textContent = total;
  }

  const cartDataInput = document.getElementById("cartData");
  if (cartDataInput) {
    cartDataInput.value = JSON.stringify(cart);
  }
}

function toggleCartPopup() {
  const popup = document.getElementById("cart-popup");
  if (!popup) return;

  if (popup.style.display === "block") {
    popup.style.display = "none";
  } else {
    renderCartPopup();
    popup.style.display = "block";
  }
}

function renderCartPopup() {
  const popup = document.getElementById("cart-popup");
  if (!popup) return;

  if (cart.length === 0) {
    popup.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let html = '<h3>Your Order</h3><ul>';
  cart.forEach(({ item, price, quantity }) => {
    html += `
      <li>
        ${item} - Qty: ${quantity} - ₹${price * quantity}
        <button onclick="removeFromCart('${item}')" class="popup-remove">-</button>
      </li>
    `;
  });
  html += `</ul><p><strong>Total: ₹${total}</strong></p>`;

  html += `
    <div class="popup-buttons">
      <button onclick="closeCartPopup()" class="close-btn">Close</button>
      <button onclick="submitCart()" class="checkout-btn">Checkout</button>
      <button onclick="printCart()" class="print-btn">Print</button>
    </div>
  `;

  popup.innerHTML = html;
}

function printCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const now = new Date();
  const dateTimeString = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });

  const printContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0;">Foodie Express</h1>
        <p style="margin: 5px 0 0;">${dateTimeString}</p>
      </div>

      <h2>Your Order</h2>
      <ul style="list-style: none; padding: 0;">
        ${cart.map(({ item, price, quantity }) => 
          `<li>${item} - Qty: ${quantity} - ₹${price * quantity}</li>`).join("")}
      </ul>
      <h3>Total: ₹${total}</h3>
      <p>Contact Phone: <strong>7003064719</strong></p>
    </div>
  `;

  const printArea = document.getElementById("print-area");
  if (!printArea) {
    alert("Missing print-area div in your HTML.");
    return;
  }

  // Inject content and force rendering
  printArea.innerHTML = printContent;
  printArea.style.display = "block";

  // Wait a short time to ensure DOM updates before printing
  setTimeout(() => {
    window.print();

    // Cleanup after printing
    setTimeout(() => {
      printArea.innerHTML = "";
      printArea.style.display = "none";
    }, 500);
  }, 300); // This delay ensures it works on mobile too
}



function closeCartPopup() {
  const popup = document.getElementById("cart-popup");
  if (popup) popup.style.display = "none";
}

function submitCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const form = document.createElement("form");
  form.action = "checkout.php";
  form.method = "POST";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "cartData";
  input.value = JSON.stringify(cart);

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

// Notification animation
function showAddToCartNotification() {
  const notification = document.getElementById("add-to-cart-notification");
  if (!notification) return;

  notification.style.animation = "none";
  notification.style.display = "block";
  void notification.offsetWidth;
  notification.style.animation = "slideFade 2s forwards";

  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}



