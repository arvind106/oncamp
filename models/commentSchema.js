const mongoose = require("../config/mongodb");
const commentSchema = new mongoose.Schema({
    user: {type:mongoose.Types.ObjectId, required:true, ref:"user"},
    type:{type:String,enum:["profile","product"],default:"product"},
    helpfull: [{type:mongoose.Types.ObjectId, required:true, ref:"user"}],
    rating:Number,
    comment:String,
    is_edited: {type: Boolean, default:false},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
});
const commentModel = mongoose.model("comment",commentSchema);
module.exports = commentModel;
