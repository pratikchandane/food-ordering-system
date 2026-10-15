// src/menuData.js
// This file stores the food items, their categories, descriptions, and prices.

const menuItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 8.99,
    description: "Grilled beef patty with melted cheddar, lettuce, tomato, and house sauce.",
    emoji: "🍔"
  },
  {
    id: 2,
    name: "Veggie Delight Burger",
    category: "Burgers",
    price: 7.49,
    description: "Crispy vegetable patty with fresh lettuce, onions, and creamy mayo.",
    emoji: "🥪"
  },
  {
    id: 3,
    name: "Margherita Pizza",
    category: "Pizzas",
    price: 11.99,
    description: "Stone-baked pizza with San Marzano tomato sauce, fresh mozzarella, and basil.",
    emoji: "🍕"
  },
  {
    id: 4,
    name: "Pepperoni Feast Pizza",
    category: "Pizzas",
    price: 13.99,
    description: "Loaded with smoky beef pepperoni, mozzarella cheese, and oregano.",
    emoji: "🍕"
  },
  {
    id: 5,
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    price: 10.49,
    description: "Fettuccine pasta tossed in rich garlic parmesan cream sauce.",
    emoji: "🍝"
  },
  {
    id: 6,
    name: "Mediterranean Greek Salad",
    category: "Salads",
    price: 6.99,
    description: "Crisp cucumbers, tomatoes, kalamata olives, and crumbled feta cheese.",
    emoji: "🥗"
  },
  {
    id: 7,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 5.49,
    description: "Warm molten chocolate cake dusted with powdered sugar.",
    emoji: "🍰"
  },
  {
    id: 8,
    name: "Iced Berry Lemonade",
    category: "Beverages",
    price: 3.49,
    description: "Refreshing lemonade infused with fresh crushed berries and mint.",
    emoji: "🥤"
  }
];

module.exports = { menuItems };
