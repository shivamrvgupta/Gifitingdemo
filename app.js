require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const models = require('./models');
const path = require('path');
const db = require('./models/db');

console.log(date);

app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', path.join(__dirname, './views')); // Set views directory
// Parse JSON-encoded request bodies
app.use(bodyParser.json({ extended: true }));

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static("./public"));

app.get('/', async(req,res) => {
    res.render('index');
})

app.get('/ocassion', async(req,res) => {
    res.render('ocassion');
})

app.get('/boxes', async(req,res) => {
    const boxes = await models.Boxes.find({});
    console.log(boxes);
    res.render('boxes',{boxes});
})

app.get('/customizer/:id', async(req,res) => {
    const box_id = req.params.id;
    const chocolates = await models.Products.find({});
    const selectedProductsCount = await models.Products.countDocuments({ is_selected: true });
    console.log(selectedProductsCount)
    const boxes = await models.Boxes.findById(box_id);
    res.render('customizer',{boxes, chocolates, selectedProductsCount});
})

app.post('/update/product', async(req, res) => {
    try {
        const rowId = req.body.rowId;
        const is_selected = req.body.is_selected;
        console.log(is_selected);
        const products = await models.Products.findById(rowId);
        const selectedProductsCount = await models.Products.countDocuments({ is_selected: true });
        console.log(selectedProductsCount)
        // Define your threshold here
        if(is_selected === "true" && selectedProductsCount >= 3){
            console.log("denied")
            return res.status(400).json({ error: 'Threshold reached. Cannot select more products.' });
        }

        if(is_selected === "true"){
            products.is_selected = true;
        }else{
            products.is_selected = false;
        }

        await products.save();
        res.json({ success: true }); // Sending a JSON response indicating success
    } catch (error) {
        res.status(500).json({ error: error.message }); // Sending a JSON response in case of error
    }
});

app.post('/reset/products', async (req, res) => {
    try {
        await models.Products.updateMany({}, { $set: { is_selected: false } });
        res.json({ success: true, message: 'All products deselected successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(8723, function(){
    console.log('Server is running on port 8723');
});


