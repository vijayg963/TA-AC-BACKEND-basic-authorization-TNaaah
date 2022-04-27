let mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    name :{
        type : String,
    },
     productId : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'Product'
     },
})
let Category = mongoose.model('Category' , categorySchema);
module.exports = Category;
