const mongoose = require("../config/mongodb");
const categorySchema = new mongoose.Schema({
    name: {type:String, required:true},
    desc:{type:String, default:""},
    icon:{type:String, default:""},
    image:{type:String, default:""},
    sub_categories:[{type: mongoose.Types.ObjectId,ref: 'sub_category'}],
    status:{type:String, default:"Active"},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
},{
    collation: { locale: 'en', strength: 2 }
});
const categoryModel = mongoose.model("category",categorySchema);
const subCategorySchema = new mongoose.Schema({
    name: {type:String, required:true},
    desc:{type:String, default:""},
    icon:{type:String, default:""},
    image:{type:String, default:""},
    category:{type: mongoose.Types.ObjectId,ref: 'category'},
    status:{type:String, default:"Active"},
    created_at:{type:Date,default:new Date()},
    updated_at:{type:Date,default: new Date()}
},{
    collation: { locale: 'en', strength: 2 }
});
const subCategoryModel = mongoose.model("sub_category",subCategorySchema);
module.exports = {categoryModel,subCategoryModel};
