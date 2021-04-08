const postSchema = require("../models/postSchema");
const config = require("../config/config");
const common = require("../helpers/common");

module.exports = {
    list: async function(req, res){
        let fquery = req.query;
        let filter = {};
        if(fquery.category){
            filter["category"] = fquery.category;
        }
        common.pagination(req,postSchema,filter,[{path:"category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            res.success("Product List",result);
        })
    },
    add: function(req, res){
        let fields = req.body;
        fields.user = req.user;
        let files = req.files;
        common.save_files(files,fields,(mfields)=> {
            postSchema.create(mfields, async (err, doc) => {
                if (err) return res.error("Some error", err, config.BAD_REQUEST_STATUS_CODE);
                common.send_notification('system',req.user._id,"add_post",`New Post added`,`New post ${doc.title} has been added.`,doc);
                return res.success("Post has been added.");
            });
        });
    },
    get_by_id: async function(req,res){
        let post_id = req.params.post_id;
        let post = await postSchema.findOne({_id:post_id}).populate([
            {path:"category",select:{name:1}},
            {path:"user",select:{name:1,avatar:1}},
            {path:"comments",match:{type:"post"}, select:{comment:1,rating:1},populate:{path:'user',select:{name:1,avatar:1}}}
            ]);
        post = post.toJSON();
        post.total_rating =0;
        let rating = {1:0,2:0,3:0,4:0,5:0};
        let rating_desc = {1:0,2:0,3:0,4:0,5:0};
        let total =0
        let total_sum =0
        if(post.comments.length >0){
            post.comments.map(c => {
                rating[Math.round(c.rating)] += c.rating;
                rating_desc[Math.round(c.rating)] += 1;
                total_sum+=c.rating;
            });
            Object.keys(rating).map(rk =>{
                total += (rk*rating[rk]);
            })
        }
        post.total_rating = total/total_sum;
        post.rating_desc = rating_desc;
        res.success("Post By Id",post);
    },
    get_my_post: async function(req,res){
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
        common.pagination(req,postSchema,filter,[{path:"category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            res.success("My Post List",result);
        })
    }
}
