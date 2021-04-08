const categorySchema = require("../models/categorySchema").categoryModel;
const subcategorySchema = require("../models/categorySchema").subCategoryModel;
const config = require("../config/config");
const mongoose = require("mongoose");
const common = require("../helpers/common");
const formidable = require("formidable");

module.exports = {
    list: async function(req, res){
        let categories = await categorySchema.find({status:"Active"}).sort({name:1}).populate({path:"sub_categories",select:"name"});
        if(!categories) return res.error("Category not found.",'',config.NOT_FOUND_STATUS_CODE);
        res.success("Category list with subcategory.",categories);
    },
    add_category: function(req, res){
        let category = req.body;
        let form = formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            fields._id = mongoose.Types.ObjectId();
            common.saveFile(fields,files,(mfields)=>{
                categorySchema.create(mfields, async (err,doc)=>{
                    if(err) return res.error("Some error",'',config.SERVER_ERROR_STATUS_CODE);
                    return res.success("Category has been added.");
                });
            })
        });
        if(Object.keys(category).length>0) {
            categorySchema.create(category, async (err, doc) => {
                if (err) return res.error("Some error", '', config.SERVER_ERROR_STATUS_CODE);
                if (category.subcategories && category.subcategories.length > 0) {
                    let subcategory = category.subcategories.map(sc => {
                        let sid = mongoose.Types.ObjectId();
                        sc._id = sid;
                        sc.category = doc._id;
                        doc.sub_categories.push(sid);
                        return sc;
                    });
                    await subcategorySchema.create(subcategory);
                    await doc.save();
                    res.success("Category and sub-category has been added.");
                } else {
                    res.success("Category has been added.");
                }
            })
        }

    },
    add_sub_ategory: async function(req, res){
        let category_id = req.params.category_id;
        let category = await categorySchema.findById(category_id);
        if(!category) return res.error("Category not found.",'',config.NOT_FOUND_STATUS_CODE);
        let subcat = req.body;
        let form = formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            fields._id = mongoose.Types.ObjectId();
            fields.category = category_id;
            common.saveFile(fields,files,(mfields)=>{
                subcategorySchema.create(mfields, async (err,doc)=>{
                    if(err) return res.error("Some error",'',config.SERVER_ERROR_STATUS_CODE);
                    category.sub_categories.push(doc._id);
                    await category.save();
                    return res.success("Sub-Category has been added.");
                });
            })
        });
        if(Object.keys(subcat).length>0) {
            subcat.category = category_id;
            subcategorySchema.create(subcat, async (err, doc) => {
                if (err) return res.error("Some error", '', config.SERVER_ERROR_STATUS_CODE);
                category.sub_categories.push(doc._id);
                await category.save();
                res.success("Sub-Category has been added.");
            });
        }
    }
}
