const mongoose = require("mongoose");

// We create a schema for an item
let itemSchema = mongoose.Schema(
    {
        itemId: {
            type: String,
            required: true
        },
        name: { 
            type: String,
            required: true
        },
        category: { 
            type: String, 
            required: true 
        },
        quantity: {
            type: String,
            required: true
        },
        warehouse: { 
            type: String, 
            required: true 
        }
    }
);

// Create a collection called Item with the schema that we created above
const Item = mongoose.model("Item", itemSchema); 
module.exports = Item;