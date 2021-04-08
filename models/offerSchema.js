const mongoose = require("../config/mongodb");
const offerSchema = new mongoose.Schema({
    product:{type:mongoose.Types.ObjectId, required:true, ref:"product"},
    sender:{type:mongoose.Types.ObjectId, required:true, ref:"user"},
    receiver:{type:mongoose.Types.ObjectId, required:true, ref:"user"},
    offer_price:{type:Number, required:true, default: 0},
    status:{type:String,required:true, enum:["Requested","Accepted","Declined","Paid","Deleted"],default:"Requested"},
    human_status:{type:String,default:"Unanswered"},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
});
module.exports = mongoose.model("offer",offerSchema);
