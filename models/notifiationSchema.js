const mongoose = require("../config/mongodb");
const notifiationSchema = new mongoose.Schema({
    sender: {type:String, default:"System"},
    receiver: {type:mongoose.Types.ObjectId, required:true, ref:"user"},
    title:String,
    message:String,
    is_read: {type: Boolean, default:false},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
},{
    strict:false
});
const notifiationModel = mongoose.model("notification",notifiationSchema);
module.exports = notifiationModel;
