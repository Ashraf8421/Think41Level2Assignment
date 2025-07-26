const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  created_at: Date,
  updated_at: Date,
  rating: Number,
  category: String,
  name: String,
  brand: String,
  price: Number,
  gender: String,
  sku: String,
  quantity: Number,
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
