const commentSchema = require("../models/commentSchema");
const productSchema = require("../models/productSchema");
const userSchema = require("../models/userSchema");
const config = require("../config/config");
const common = require("../helpers/common");
module.exports = {
    add: function(req, res){
        let data = req.body;
        data.user = req.user;
        commentSchema.create(data, async (err,doc)=>{
            if(err) return res.error("Some error",err,config.SERVER_ERROR_STATUS_CODE);

            if(data.type == "product") {
                let product = await productSchema.findById(data.resource_id);
                if (product.comments) {
                    product.comments.push(doc._id);
                } else {
                    product.comments = [doc._id];
                }
                await product.save();
            }else{
                let user = await userSchema.findById(data.resource_id);
                if (user.comments) {
                    user.comments.push(doc._id);
                } else {
                    user.comments = [doc._id];
                }
                await user.save();
            }
            return res.success("Comment has been added.");
        })

    },
    update: async function(req, res){
        let cid = req.params.comment_id;
        let comment  = await commentSchema.findOne({_id:cid, user: req.user._id});
        if(comment){
            comment.comment = req.body.comment;
            comment.is_edited = true;
            await comment.save();
            return res.success("Comment has been updated.");
        }else{
            return res.success("You do not have a permission to update another's comment.");
        }
    },
    get_comment: async function(req, res){
        let type = req.params.type;
        if(type == 'product'){
            let comment_ids = await productSchema.findOne({_id:req.params.option_id},{name:1,comments:1});
            comment_ids = comment_ids.comments;
            common.pagination(req,commentSchema,{_id:{$in:comment_ids}},[{path:'user',select:{name:1,avatar:1}}],(results)=>{
                return res.success("Comment by product id",results);
            },undefined);
        }else if(type == 'user'){
            let comment_ids = await userSchema.findOne({_id:req.params.option_id},{name:1,comments:1});
            comment_ids = comment_ids.comments;
            common.pagination(req,commentSchema,{_id:{$in:comment_ids}},[{path:'user',select:{name:1,avatar:1}}],(results)=>{
                return res.success("Comment by user id",results);
            },undefined);
        }else{
            return res.error("User or product id not found",config.BAD_REQUEST_STATUS_CODE);
        }


    }
}
