const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const Item = require("./models/itemModel");
dotenv.config();

// Routers
const itemsRouter = require('./routers/items-router');

// Middleware
app.set(path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Server routes
app.get(['/', '/home'], (req,res) => res.render('index'));
app.use('/items', itemsRouter);


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmw3c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', function(){
    Item.init(()=>{
        app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
    })
});