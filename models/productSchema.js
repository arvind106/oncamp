const mongoose = require("../config/mongodb");
const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    category:{type:mongoose.Types.ObjectId, required:true, ref:"category"},
    sub_category:{type:mongoose.Types.ObjectId, required:true, ref:"sub_category"},
    size:{type:Number,default:0},
    brand:{type:String,default:""},
    price:{type:Number,default:0},
    shipping:{type:Number,default:0},
    condition:{type:String,enum:["new","used","gently_used"],default:"used"},
    item_description:{type:String,default:""},
    accept_offers:{type:Boolean,default:true},
    images:[],
    user:{type:mongoose.Types.ObjectId, required:true, ref:"user"},
    comments:[{type:mongoose.Types.ObjectId, ref:"comment"}],
    address:String,
    city:String,
    state:String,
    zipcode:Number,
    lat:Number,
    long:Number,
    status:{type:String, default:"Active"},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
});
const productModel = mongoose.model("product",productSchema);
module.exports = productModel;
