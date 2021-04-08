const productSchema = require("../models/productSchema");
const userSchema = require("../models/userSchema");
const config = require("../config/config");
const mongoose = require("mongoose");
const common = require("../helpers/common");
const formidable = require("formidable");
const moment = require("moment");

module.exports = {
    list: async function(req, res){
        let fquery = req.query;
        let filter = {};
        if(fquery.category){
            filter["category"] = fquery.category;
        }
        if(fquery.sub_category){
            filter["sub_category"] = fquery.sub_category;
        }
        if(fquery.size_low && fquery.size_high){
            filter['size'] = {"$gte":fquery.size_low, "$lte":fquery.size_high};
        }
        if(fquery.price_low && fquery.price_high){
            filter['price'] = {"$gte":fquery.price_low, "$lte":fquery.price_high};
        }
        if(fquery.condition){
            filter['condition'] = fquery.condition;
        }
        if(fquery.search){
            filter["$or"] = [{title:{ $regex: '.*' + fquery.search + '.*',$options: 'i' }},{item_description:{ $regex: '.*' + fquery.search + '.*',$options: 'i' }}]
        }
        // if(fquery.relevance){
        //     if(fquery.relevance == "today"){
        //         filter["created_at"] = "09/30/2020"//moment().format("L");
        //     }else if(fquery.relevance == "yesterday"){
        //         // let d = new Date();
        //         // d.setDate(d.getDate()-1);
        //         // filter["created_at"] = new Date(d);
        //     }else if(fquery.relevance == "thisweek"){
        //
        //     }
        // }
        common.pagination(req,productSchema,filter,[{path:"category",select:{name:1}},{path:"sub_category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            let fr = [];
            await common.foreach(result.items, async (item)=>{
                await common.wait(20)
                let it = item.toJSON();
                it.is_favorite = req.user.favorite.indexOf(it._id) != -1;
                it.likes = (await userSchema.find({"favorite":it._id}) || []).length;
                fr.push(it);
            });
            result.items = fr;
            res.success("Product List",result);
        })
    },
    add: function(req, res){
        let fields = req.body;
        fields.user = req.user;
        let files = req.files;
        common.save_files(files,fields,(mfields)=> {
            productSchema.create(mfields, async (err, doc) => {
                if (err) return res.error("Some error", err, config.BAD_REQUEST_STATUS_CODE);
                common.send_notification('system',req.user._id,"add_product",`New Product added`,`New Product ${doc.title} has been added.`,doc);
                return res.success("Product has been added.");
            });
        });
    },
    get_by_id: async function(req,res){
        let product_id = req.params.product_id;
        let product = await productSchema.findOne({_id:product_id}).populate([
            {path:"category",select:{name:1}},
            {path:"sub_category",select:{name:1}},
            {path:"user",select:{name:1,avatar:1}},
            {path:"comments",match:{type:"product"}, select:{comment:1,rating:1},populate:{path:'user',select:{name:1,avatar:1}}}
            ]);
        product = product.toJSON();
        product.is_offer_sent = await common.get_offred(req.user._id,product_id);
        product.total_rating =0;
        let rating = {1:0,2:0,3:0,4:0,5:0};
        let rating_desc = {1:0,2:0,3:0,4:0,5:0};
        let total =0
        let total_sum =0
        if(product.comments.length >0){
            product.comments.map(c => {
                rating[Math.round(c.rating)] += c.rating;
                rating_desc[Math.round(c.rating)] += 1;
                total_sum+=c.rating;
            });
            Object.keys(rating).map(rk =>{
                total += (rk*rating[rk]);
            })
        }
        product.total_rating = total/total_sum;
        product.rating_desc = rating_desc;
        res.success("Product By Id",product);
    },
    add_or_remove_favorite: async function(req,res){
        let product_id  = req.params.product_id;
        let fu = req.user;
        if(fu.favorite && fu.favorite.indexOf(product_id) != -1){
            fu.favorite.splice(fu.favorite.indexOf(product_id),1);
            await fu.save();
            return res.success("The product has been remove from favorite.");
        }else if(fu.favorite && fu.favorite.indexOf(product_id) == -1){
            fu.favorite.push(product_id);
            await fu.save();
            return res.success("The product has been added in to favorite.");
        }else{
            fu.favorite = [product_id];
            await fu.save();
            return res.success("The product has been added in to favorite.");
        }
    },
    get_my_product: async function(req,res){
        let user = req.user;
        let user_id = 0;
        if(!user && !req.params.user_id){
            return res.error("User id Or access token is required",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(!user){
            user_id = req.params.user_id;
        }else{
            user_id = user._id;
        }
        let filter = {
            user:user_id
        }
        common.pagination(req,productSchema,filter,[{path:"category",select:{name:1}},{path:"sub_category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            res.success("My Product List",result);
        })
    },
    get_my_favorite_product: async function(req,res){
        let user = req.user;
        let filter = {
            _id:{$in:user.favorite}
        }
        common.pagination(req,productSchema,filter,[{path:"category",select:{name:1}},{path:"sub_category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            res.success("My Favorite Product List",result);
        })
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
