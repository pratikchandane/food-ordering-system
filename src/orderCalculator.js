// src/orderCalculator.js
// Business logic functions for calculating order prices, tax, delivery fees, and order validation.

/**
 * Calculates the subtotal for an array of ordered items.
 * @param {Array<{ price: number, quantity: number }>} items 
 * @returns {number} Subtotal rounded to 2 decimal places.
 */
function calculateSubtotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  return Number(subtotal.toFixed(2));
}

/**
 * Calculates sales tax for a given subtotal.
 * Default tax rate is 5% (0.05).
 * @param {number} subtotal 
 * @param {number} taxRate 
 * @returns {number} Tax amount rounded to 2 decimal places.
 */
function calculateTax(subtotal, taxRate = 0.05) {
  if (typeof subtotal !== 'number' || subtotal < 0) {
    return 0;
  }
  const tax = subtotal * taxRate;
  return Number(tax.toFixed(2));
}

/**
 * Calculates delivery fee based on order subtotal.
 * Free delivery on orders $30.00 or more; otherwise standard fee of $3.99.
 * @param {number} subtotal 
 * @param {number} freeDeliveryThreshold 
 * @param {number} standardFee 
 * @returns {number} Delivery fee rounded to 2 decimal places.
 */
function calculateDeliveryFee(subtotal, freeDeliveryThreshold = 30.00, standardFee = 3.99) {
  if (typeof subtotal !== 'number' || subtotal <= 0) {
    return 0;
  }
  if (subtotal >= freeDeliveryThreshold) {
    return 0.00;
  }
  return standardFee;
}

/**
 * Calculates the complete bill breakdown (subtotal, tax, delivery fee, and grand total).
 * @param {Array<{ price: number, quantity: number }>} items 
 * @param {number} taxRate 
 * @returns {{ subtotal: number, tax: number, deliveryFee: number, grandTotal: number }}
 */
function calculateTotal(items, taxRate = 0.05) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  return {
    subtotal,
    tax,
    deliveryFee,
    grandTotal
  };
}

/**
 * Validates the order input data before processing.
 * Throws an Error with a user-friendly message if any check fails.
 * @param {Object} orderData 
 * @returns {boolean} True if valid.
 */
function validateOrder(orderData) {
  if (!orderData || typeof orderData !== 'object') {
    throw new Error('Order data is missing or invalid.');
  }

  // 1. Customer details check
  if (!orderData.customerName || typeof orderData.customerName !== 'string' || orderData.customerName.trim().length === 0) {
    throw new Error('Customer name is required.');
  }

  if (!orderData.address || typeof orderData.address !== 'string' || orderData.address.trim().length === 0) {
    throw new Error('Delivery address is required.');
  }

  if (!orderData.phone || typeof orderData.phone !== 'string' || orderData.phone.trim().length === 0) {
    throw new Error('Contact phone number is required.');
  }

  // 2. Items check
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  for (const item of orderData.items) {
    if (!item.name || typeof item.name !== 'string') {
      throw new Error('Each item must have a valid name.');
    }
    const price = Number(item.price);
    if (isNaN(price) || price <= 0) {
      throw new Error(`Item "${item.name}" has an invalid price.`);
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Item "${item.name}" has an invalid quantity. Quantity must be a positive whole number.`);
    }
  }

  return true;
}

/**
 * Generates an official order confirmation receipt.
 * @param {Object} orderData 
 * @returns {Object} Complete order receipt object.
 */
function createOrderConfirmation(orderData) {
  validateOrder(orderData);

  const pricing = calculateTotal(orderData.items);
  const orderId = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 900 + 100);

  return {
    orderId,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    customer: {
      name: orderData.customerName.trim(),
      address: orderData.address.trim(),
      phone: orderData.phone.trim(),
      specialInstructions: orderData.specialInstructions ? orderData.specialInstructions.trim() : 'None'
    },
    items: orderData.items.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(Number(item.price).toFixed(2)),
      quantity: Number(item.quantity),
      itemTotal: Number((Number(item.price) * Number(item.quantity)).toFixed(2))
    })),
    pricing,
    estimatedDeliveryMinutes: 35
  };
}

module.exports = {
  calculateSubtotal,
  calculateTax,
  calculateDeliveryFee,
  calculateTotal,
  validateOrder,
  createOrderConfirmation
};
