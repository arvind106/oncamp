const mongoose = require("../config/mongodb");
const imageSchema = new mongoose.Schema({
    path:String,
    name:String,
    mime_type:String,
    size:Number,
    image_for:{type:String,enum:["product","post"],default:"product"}
},{
    strict:false
});
const imagenModel = mongoose.model("image",imageSchema);
module.exports = imagenModel;
