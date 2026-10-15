// tests/orderCalculator.test.js
// Automated Unit Tests for the Online Food Ordering System

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateSubtotal,
  calculateTax,
  calculateDeliveryFee,
  calculateTotal,
  validateOrder,
  createOrderConfirmation
} = require('../src/orderCalculator.js');

describe('Order Price Calculation Tests', () => {

  test('TC01: calculateSubtotal should return 0 for empty or invalid item list', () => {
    assert.equal(calculateSubtotal([]), 0);
    assert.equal(calculateSubtotal(null), 0);
    assert.equal(calculateSubtotal(undefined), 0);
  });

  test('TC02: calculateSubtotal should accurately calculate total for single item', () => {
    const items = [{ price: 8.99, quantity: 2 }];
    const result = calculateSubtotal(items);
    assert.equal(result, 17.98);
  });

  test('TC03: calculateSubtotal should accurately calculate total for multiple items', () => {
    const items = [
      { price: 8.99, quantity: 2 },  // 17.98
      { price: 11.99, quantity: 1 }, // 11.99
      { price: 3.49, quantity: 3 }   // 10.47
    ];
    // Expected: 17.98 + 11.99 + 10.47 = 40.44
    const result = calculateSubtotal(items);
    assert.equal(result, 40.44);
  });

  test('TC04: calculateTax should compute 5% sales tax correctly', () => {
    const subtotal = 40.00;
    const tax = calculateTax(subtotal, 0.05);
    assert.equal(tax, 2.00);
  });

  test('TC05: calculateTax should round fractional cents correctly', () => {
    const subtotal = 17.99;
    // 17.99 * 0.05 = 0.8995 -> 0.90
    const tax = calculateTax(subtotal, 0.05);
    assert.equal(tax, 0.90);
  });

  test('TC06: calculateDeliveryFee should charge standard $3.99 for orders under $30.00', () => {
    const subtotal = 25.00;
    const fee = calculateDeliveryFee(subtotal);
    assert.equal(fee, 3.99);
  });

  test('TC07: calculateDeliveryFee should be $0.00 (FREE) for orders $30.00 and above', () => {
    assert.equal(calculateDeliveryFee(30.00), 0.00);
    assert.equal(calculateDeliveryFee(55.50), 0.00);
  });

  test('TC08: calculateTotal should return correct subtotal, tax, delivery fee, and grand total', () => {
    const items = [
      { price: 10.00, quantity: 2 } // Subtotal = 20.00 (< 30, so delivery fee = 3.99)
    ];
    // Subtotal = 20.00
    // Tax = 20 * 0.05 = 1.00
    // Delivery = 3.99
    // Grand Total = 20.00 + 1.00 + 3.99 = 24.99
    const summary = calculateTotal(items);

    assert.equal(summary.subtotal, 20.00);
    assert.equal(summary.tax, 1.00);
    assert.equal(summary.deliveryFee, 3.99);
    assert.equal(summary.grandTotal, 24.99);
  });

});

describe('Order Validation and Confirmation Tests', () => {

  test('TC09: validateOrder should accept valid order data', () => {
    const validOrder = {
      customerName: 'Rahul Sharma',
      address: '42 MG Road, Bengaluru',
      phone: '9876543210',
      items: [{ name: 'Classic Cheeseburger', price: 8.99, quantity: 1 }]
    };
    assert.equal(validateOrder(validOrder), true);
  });

  test('TC10: validateOrder should throw error when customer name is missing', () => {
    const invalidOrder = {
      customerName: '   ',
      address: '42 MG Road',
      phone: '9876543210',
      items: [{ name: 'Burger', price: 5.00, quantity: 1 }]
    };
    assert.throws(() => validateOrder(invalidOrder), /Customer name is required/);
  });

  test('TC11: validateOrder should throw error when address is missing', () => {
    const invalidOrder = {
      customerName: 'Rahul Sharma',
      address: '',
      phone: '9876543210',
      items: [{ name: 'Burger', price: 5.00, quantity: 1 }]
    };
    assert.throws(() => validateOrder(invalidOrder), /Delivery address is required/);
  });

  test('TC12: validateOrder should throw error when items list is empty', () => {
    const invalidOrder = {
      customerName: 'Rahul Sharma',
      address: '42 MG Road',
      phone: '9876543210',
      items: []
    };
    assert.throws(() => validateOrder(invalidOrder), /Order must contain at least one item/);
  });

  test('TC13: validateOrder should throw error when quantity is zero or negative', () => {
    const invalidOrder = {
      customerName: 'Rahul Sharma',
      address: '42 MG Road',
      phone: '9876543210',
      items: [{ name: 'Pizza', price: 10.00, quantity: -2 }]
    };
    assert.throws(() => validateOrder(invalidOrder), /invalid quantity/);
  });

  test('TC14: createOrderConfirmation should generate confirmation with orderId and status Confirmed', () => {
    const orderData = {
      customerName: 'Aarav Patel',
      address: '15 Park Street',
      phone: '9123456789',
      specialInstructions: 'Please leave at the door',
      items: [
        { id: 1, name: 'Classic Cheeseburger', price: 8.99, quantity: 2 },
        { id: 3, name: 'Margherita Pizza', price: 11.99, quantity: 1 }
      ]
    };
    const confirmation = createOrderConfirmation(orderData);

    assert.ok(confirmation.orderId.startsWith('ORD-'));
    assert.equal(confirmation.status, 'Confirmed');
    assert.equal(confirmation.customer.name, 'Aarav Patel');
    assert.equal(confirmation.pricing.subtotal, 29.97);
    assert.equal(confirmation.pricing.deliveryFee, 3.99); // 29.97 < 30.00
    assert.equal(confirmation.estimatedDeliveryMinutes, 35);
  });

});
