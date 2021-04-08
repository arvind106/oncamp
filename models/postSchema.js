const mongoose = require("../config/mongodb");
const postSchema = new mongoose.Schema({
    title:{type:String},
    content:{type:String},
    images:[],
    category:{type:mongoose.Types.ObjectId, required:true, ref:"category"},
    user:{type:mongoose.Types.ObjectId, required:true, ref:"user"},
    comments:[{type:mongoose.Types.ObjectId, ref:"comment"}],
    status:{type:String, default:"Active"},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
});
module.exports = mongoose.model("post",postSchema);
