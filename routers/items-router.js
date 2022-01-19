const express = require('express');
const router = express.Router();
const Item = require("../models/itemModel");

router.get("/", getItems, sendResult);
router.post("/", addItem, sendResult);
router.put("/:itemId", updateItem, sendResult);
router.delete("/:itemId", deleteItem, sendResult);

// 
async function getItems(req, res, next){
    let filter = Object.fromEntries(
        Object.entries(req.query).filter(([key, value]) => value !== "")
    );
    Object.entries(filter).forEach(([key, value]) => {
        filter[key] = {"$regex" : ".*" + value + ".*", "$options": "i"};
    });
    req.result = await Item.find(filter);
    next()
};

// Add a new item to the database
async function addItem(req, res, next){
    req.result = await Item.create(req.body);
    next();
};

async function updateItem(req, res, next){
    req.result = await Item.findByIdAndUpdate(req.params.itemId, req.body);
    next();
};

async function deleteItem(req, res, next){
    req.result = await Item.findOneAndDelete(req.params.itemId);
    next();
};

function sendResult(req, res){
    if (!req.result){
        res.status(400).send("Error");
    }
    res.status(200).send(req.result);
}

module.exports = router;