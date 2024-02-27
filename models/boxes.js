const mongoose = require('mongoose');   

const boxesSchema = new mongoose.Schema({
    name: String,
    image: String, 
});

const Boxes = mongoose.model('Boxes', boxesSchema);

module.exports = Boxes;