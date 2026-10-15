// public/app.js
// Client-side interactions for Online Food Ordering System

// Application State
let menuItems = [];
const cart = {}; // maps itemId -> quantity
let currentCategory = 'All';

// DOM Elements
const foodGrid = document.getElementById('foodGrid');
const categoryFilters = document.getElementById('categoryFilters');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCountBadge = document.getElementById('cartCountBadge');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTax = document.getElementById('summaryTax');
const summaryDelivery = document.getElementById('summaryDelivery');
const summaryTotal = document.getElementById('summaryTotal');
const perkText = document.getElementById('perkText');
const progressFill = document.getElementById('progressFill');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const btnTotalText = document.getElementById('btnTotalText');

// Confirmation Modal Elements
const confirmationModal = document.getElementById('confirmationModal');
const receiptOrderId = document.getElementById('receiptOrderId');
const receiptDeliveryTime = document.getElementById('receiptDeliveryTime');
const receiptCustomerName = document.getElementById('receiptCustomerName');
const receiptCustomerAddress = document.getElementById('receiptCustomerAddress');
const receiptCustomerPhone = document.getElementById('receiptCustomerPhone');
const receiptItemsList = document.getElementById('receiptItemsList');
const receiptSubtotal = document.getElementById('receiptSubtotal');
const receiptTax = document.getElementById('receiptTax');
const receiptDelivery = document.getElementById('receiptDelivery');
const receiptGrandTotal = document.getElementById('receiptGrandTotal');
const btnNewOrder = document.getElementById('btnNewOrder');

// 1. Initialize Application - Fetch Menu from API
async function initApp() {
  try {
    const response = await fetch('/api/menu');
    const data = await response.json();
    if (data.success && Array.isArray(data.items)) {
      menuItems = data.items;
      renderMenu();
    } else {
      foodGrid.innerHTML = '<div class="empty-cart-state"><p>Could not load menu items.</p></div>';
    }
  } catch (error) {
    console.error('Failed to load menu:', error);
    foodGrid.innerHTML = '<div class="empty-cart-state"><p>Error connecting to server. Ensure Node.js server is running on port 3000.</p></div>';
  }
}

// 2. Render Menu Cards based on Selected Category
function renderMenu() {
  foodGrid.innerHTML = '';

  const filteredItems = currentCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === currentCategory);

  if (filteredItems.length === 0) {
    foodGrid.innerHTML = '<div class="empty-cart-state"><p>No items found in this category.</p></div>';
    return;
  }

  filteredItems.forEach(item => {
    const qty = cart[item.id] || 0;
    const card = document.createElement('div');
    card.className = 'food-card';

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="food-emoji">${item.emoji}</div>
          <span class="food-category-pill">${item.category}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="desc">${item.description}</p>
      </div>
      <div class="card-bottom">
        <span class="food-price">$${item.price.toFixed(2)}</span>
        <div class="qty-control">
          <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="qty-display" id="menu-qty-${item.id}">${qty}</span>
          <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
    `;

    foodGrid.appendChild(card);
  });
}

// 3. Update Item Quantity in Cart
function updateQuantity(itemId, delta) {
  const currentQty = cart[itemId] || 0;
  const newQty = Math.max(0, currentQty + delta);

  if (newQty === 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = newQty;
  }

  // Update menu card quantity badge if visible
  const qtySpan = document.getElementById(`menu-qty-${itemId}`);
  if (qtySpan) {
    qtySpan.textContent = newQty;
  }

  renderCart();
}

// 4. Calculate Bill & Render Cart Sidebar
function renderCart() {
  const cartEntries = Object.entries(cart);
  const totalItemCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);

  cartCountBadge.textContent = `${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}`;

  // If cart is empty
  if (cartEntries.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.</p>
        <small>Click '+' on any food item to start ordering!</small>
      </div>
    `;
    summarySubtotal.textContent = '$0.00';
    summaryTax.textContent = '$0.00';
    summaryDelivery.textContent = '$0.00';
    summaryTotal.textContent = '$0.00';
    btnTotalText.textContent = '$0.00';
    placeOrderBtn.disabled = true;

    perkText.textContent = 'Add $30.00 to unlock FREE delivery!';
    progressFill.style.width = '0%';
    return;
  }

  // Calculate pricing breakdown
  let subtotal = 0;
  cartItemsContainer.innerHTML = '';

  cartEntries.forEach(([itemIdStr, qty]) => {
    const itemId = Number(itemIdStr);
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    const itemTotal = item.price * qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-info">
        <span class="cart-row-title">${item.name}</span>
        <span class="cart-row-sub">$${item.price.toFixed(2)} × ${qty}</span>
      </div>
      <div class="cart-row-actions">
        <div class="qty-control">
          <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="qty-display">${qty}</span>
          <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <span class="cart-row-price">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });

  const tax = Number((subtotal * 0.05).toFixed(2));
  const isFreeDelivery = subtotal >= 30.00;
  const deliveryFee = isFreeDelivery ? 0.00 : 3.99;
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  // Update summary numbers
  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  summaryTax.textContent = `$${tax.toFixed(2)}`;
  summaryDelivery.textContent = isFreeDelivery ? 'FREE ($0.00)' : `$${deliveryFee.toFixed(2)}`;
  summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;
  btnTotalText.textContent = `$${grandTotal.toFixed(2)}`;
  placeOrderBtn.disabled = false;

  // Free delivery progress bar calculation
  if (isFreeDelivery) {
    perkText.textContent = '🎉 Congratulations! You unlocked FREE delivery!';
    progressFill.style.width = '100%';
  } else {
    const diff = (30.00 - subtotal).toFixed(2);
    const pct = Math.min(100, Math.round((subtotal / 30.00) * 100));
    perkText.textContent = `Add $${diff} more to unlock FREE delivery!`;
    progressFill.style.width = `${pct}%`;
  }
}

// 5. Category Filtering
categoryFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    renderMenu();
  }
});

// 6. Handle Order Submission (Checkout)
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cartEntries = Object.entries(cart);
  if (cartEntries.length === 0) {
    alert('Please select at least one food item before placing your order.');
    return;
  }

  const itemsPayload = cartEntries.map(([itemIdStr, qty]) => {
    const item = menuItems.find(m => m.id === Number(itemIdStr));
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: qty
    };
  });

  const orderPayload = {
    customerName: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('customerPhone').value.trim(),
    address: document.getElementById('customerAddress').value.trim(),
    specialInstructions: document.getElementById('specialInstructions').value.trim(),
    items: itemsPayload
  };

  try {
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing Order...';

    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const result = await response.json();

    if (result.success && result.order) {
      showOrderConfirmation(result.order);
    } else {
      alert(`Order Failed: ${result.error || 'Unknown error occurred.'}`);
    }
  } catch (error) {
    console.error('Order Submission Error:', error);
    alert('Could not submit order. Please check server status.');
  } finally {
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = `Place Order • <span id="btnTotalText">${summaryTotal.textContent}</span>`;
  }
});

// 7. Display Order Confirmation Receipt Modal
function showOrderConfirmation(order) {
  receiptOrderId.textContent = order.orderId;
  receiptDeliveryTime.textContent = `${order.estimatedDeliveryMinutes} mins`;
  receiptCustomerName.textContent = order.customer.name;
  receiptCustomerAddress.textContent = order.customer.address;
  receiptCustomerPhone.textContent = order.customer.phone;

  receiptItemsList.innerHTML = '';
  order.items.forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = 'receipt-row';
    itemRow.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>$${item.itemTotal.toFixed(2)}</span>
    `;
    receiptItemsList.appendChild(itemRow);
  });

  receiptSubtotal.textContent = `$${order.pricing.subtotal.toFixed(2)}`;
  receiptTax.textContent = `$${order.pricing.tax.toFixed(2)}`;
  receiptDelivery.textContent = order.pricing.deliveryFee === 0 ? 'FREE' : `$${order.pricing.deliveryFee.toFixed(2)}`;
  receiptGrandTotal.textContent = `$${order.pricing.grandTotal.toFixed(2)}`;

  confirmationModal.classList.add('active');
}

// 8. Reset Application for a New Order
btnNewOrder.addEventListener('click', () => {
  // Clear cart
  for (const key in cart) {
    delete cart[key];
  }
  checkoutForm.reset();
  confirmationModal.classList.remove('active');
  renderMenu();
  renderCart();
});

// Expose helper to global window for inline onclicks
window.updateQuantity = updateQuantity;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
