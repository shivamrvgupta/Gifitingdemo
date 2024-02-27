const mongoose = require('mongoose');   

const productsSchema = new mongoose.Schema({
    name: String,
    image: String,
    is_selected : Boolean
});

const Products = mongoose.model('Product', productsSchema);

module.exports = Products;