const mongoose = require("../config/mongodb");
const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    username: {type:String, required:true, unique: true},
    email: {type: String, required: true, unique:true},
    avatar: {type: String},
    password: {type: String},
    collage_name: {type: String},
    provider: {type:String},
    last_provider: {type:String},
    is_email_verify: {type: Boolean, default:false},
    email_verify_code:{type:Number, default:0},
    account_type :{type:String, enum:["buyer","seller"], default:"buyer"},
    comments:[{type:mongoose.Types.ObjectId, ref:"comment"}],
    fcm_token:{type:String, default:""},
    device_token:{type:String, default:""},
    followers:[{type: mongoose.Types.ObjectId, ref:'user'}],
    following :[{type: mongoose.Types.ObjectId,  ref:'user'}],
    favorite :[{type: mongoose.Types.ObjectId, ref:'product'}],
    status:{type:String, default:"Active"},
    last_login_at:{type:Date,default:new Date()},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
});
userSchema.virtual('products',{ref: 'product',localField: '_id',foreignField: 'user'});

const userModel = mongoose.model("user",userSchema);
module.exports = userModel;
