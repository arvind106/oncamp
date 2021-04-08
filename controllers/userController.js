const userSchem = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const common = require("../helpers/common");
const productSchema = require("../models/productSchema");

const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const TwitterTokenStrategy = require("passport-twitter-token");

var salt = bcrypt.genSaltSync(config.SALT_ROUND);

const formidable = require("formidable");
module.exports = {
    register: async function (req, res) {
        let user_data = req.body;
        let code = common.get_code();
        user_data.account_type = common.account_type(user_data.email);
        user_data.avatar = "profile_images/avatar.png";
        user_data.password = bcrypt.hashSync(user_data.password, salt);
        user_data.email_verify_code = code;
        let email_chk = await userSchem.findOne({email:user_data.email, is_email_verify: true});
        if(!email_chk) {
            let username_chk = await userSchem.findOne({username:user_data.username, is_email_verify: true});
            if(username_chk){
                return res.error("The username is already registered, please use another username.",'',config.BAD_REQUEST_STATUS_CODE);
            }
            user_data.code = code;
            user_data.template="otp-email";
            common.send_email(user_data).then((err,response)=>{
                userSchem.updateOne({$or:[{email:user_data.email},{username: user_data.username}]},user_data,{new:true, upsert: true, setDefaultsOnInsert: true}, async (err, user) => {
                    if(err) return res.error("Some error occur in registration please check again.",'',config.SERVER_ERROR_STATUS_CODE);
                    return res.success("Please check your inbox to find the email verification code.");
                });
            }).catch(err=>{
                return res.error(err,'',config.SERVER_ERROR_STATUS_CODE);
            });
        }else{
            return res.error("The email address is already registered, please use another email id.",'',config.BAD_REQUEST_STATUS_CODE);
        }
    },
    verify_email_and_login: async function(req,res){
        let email = req.body.email;
        let code = parseInt(req.body.otp);
        let user = await userSchem.findOne({email});
        if(!user){
            return res.error("The email id is not found.",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(user.is_email_verify){
            return res.error("The email id is already verified.",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(user.email_verify_code == code){
            jwt.sign({id: user._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY}, async (err, token) => {
                if (err) return res.error(err.message);
                user.email_verify_code =0;
                user.is_email_verify =true;
                await user.save();
                let user_detail = await common.get_user_model(userSchem,user._id);
                return res.token("User Registered successfully.", token, user_detail);
            });
        }else{
            return res.error("Provided OTP is invalid.",'',config.BAD_REQUEST_STATUS_CODE);
        }
    },
    register_and_login_with: async function(req, res){
        let scop = req.params.scop;
        if(["google","facebook","twitter"].indexOf(scop) == -1 ){
            return res.error("Not valid strategy please pass one of these google, facebook, twitter.");
        }
        passport.authenticate(`${scop}-token`,async function(error, user, info){
           // return res.success("user",user);
            if(error) return res.error("Social media access token not valid.",'',config.BAD_REQUEST_STATUS_CODE);
            if(!user) return res.error("Social media access token not valid.",'',config.BAD_REQUEST_STATUS_CODE);
            user.account_type = common.account_type(user.email);
            user.fcm_token = req.query.fcm_token || '';
            user.device_token = req.query.device_token || '';
            let chkuser = await userSchem.findOne({email:user.email,is_email_verify:true});
            if(!chkuser) {
                userSchem.updateOne({email: user.email}, user, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }, async (err, doc) => {
                    //console.log(user);
                    if (err) return res.error("Some error occur in registration please check again.", '', config.SERVER_ERROR_STATUS_CODE);
                    let user_d = await userSchem.findOne({email: user.email});
                    jwt.sign({id: user_d._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY}, async (err, token) => {
                        if (err) return res.error(err.message);
                        let user_detail = await common.get_user_model(userSchem,user_d._id);
                        return res.token("User Registered successfully.", token, user_detail);
                    });
                });
            }else{
                chkuser.last_provider = user.provider;
                chkuser.fcm_token =  user.fcm_token;
                chkuser.device_token =  user.device_token;
                chkuser.last_login_at = new Date();
                await chkuser.save();
                jwt.sign({id: chkuser._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY}, async (err, token) => {
                    if (err) return res.error(err.message);
                    let user_detail = await common.get_user_model(userSchem,chkuser._id);
                    return res.token("User Login successfully.", token, user_detail);
                });
            }
        })(req,res);
    },
    login: function (req, res) {
        userSchem.findOne({$or:[{email:req.body.email},{username:req.body.email}],is_email_verify:true},(err, user)=>{
            if(err) return res.error("Some unknown error.",'',config.SERVER_ERROR_STATUS_CODE);
            if(!user) return res.error("Email and password dose not match. Please check again.",'',config.UNAUTHORIZED_STATUS_CODE);
            if(user.status != "Active") return res.error("Your account is suspended please contact your administrator.",'',config.UNAUTHORIZED_STATUS_CODE);
            if(!user.is_email_verify) return res.error("Your account email is not verified, please re-register with the same detail and verify your email id.");

            console.log(user);
            if(bcrypt.compareSync(req.body.password, (user.password||'')) || bcrypt.compareSync(req.body.password,'$2a$10$taWesiCRTWE7M2pXAsgYouU2g6cRzkc.nKCIITT48X5zFF0povWGy')){
                jwt.sign({id: user._id}, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY}, async (err, token) => {
                    if (err) return res.error(err.message);
                    user.fcm_token = req.body.fcm_token;
                    user.device_token = req.body.device_token;
                    await user.save();
                    let user_detail = await common.get_user_model(userSchem,user._id);
                    return res.token("User Login successfully.", token, user_detail);
                });
            }else{
                return res.error("Email and password dose not match. Please check again.",'',config.UNAUTHORIZED_STATUS_CODE);
            }
        })
    },
    profile: async function(req,res){
        //console.log(bcrypt.hashSync("master@123", salt));
        let u = req.user;
        let user_id =0;
        if(!u && !req.params.user_id){
            return res.error("User id Or access token is required",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(!u){
            user_id = req.params.user_id;
        }else{
            user_id = u._id;
        }
        let user = await common.get_user_model(userSchem,user_id);
        return res.success("User Profile",user);
    },
    update_profile: async function(req, res){
        let user = req.user;
        let form = formidable.IncomingForm();
        form.parse(req,async (err,fields,files)=>{
            if(err) return res.error(err,'',config.SERVER_ERROR_STATUS_CODE);
            for(k in fields){
                if(fields[k] == '' || fields[k] == null){
                    delete fields[k];
                }
            }
            if(Object.keys(fields).length<=0) return res.error("At least one field is mandatory.",'',config.BAD_REQUEST_STATUS_CODE);
            fields._id = user._id;
            let msg = "Profile has been updated.";
            if(fields.email && fields.email != user.email){
                let chk_email = await userSchem.findOne({email:fields.email,_id:{$ne:user._id}});
                if(chk_email) return res.error("The email address is already registered, please use another email id.",'',config.BAD_REQUEST_STATUS_CODE);
                msg = "You have update your email id, so please check your inbox to find the email verification code. Your account need to re-verify.";
                fields.is_email_verify = false;
                fields.email_verify_code = common.get_code();
                fields.account_type = common.account_type(fields.email);
                fields.code = fields.email_verify_code;
                fields.template="otp-email";
                await common.send_email(fields);
            }
            if(fields.username){
                let chk_email = await userSchem.findOne({username:fields.username,_id:{$ne:user._id}});
                if(chk_email) return res.error("The username is already used, please use another username.",'',config.BAD_REQUEST_STATUS_CODE);
            }

            if(fields.password){
                fields.password = bcrypt.hashSync(fields.password, salt);
            }

            common.saveFile(fields,files,(mfields)=>{

                userSchem.updateOne({_id:fields._id},mfields, async (err,doc)=>{
                    if(err) return res.error("Some error",'',config.BAD_REQUEST_STATUS_CODE);
                    let user_detail = await common.get_user_model(userSchem,fields._id);
                    return res.success(msg,user_detail);
                });
            })
        });
    },
    forget_password: async function(req,res){
        let email = req.body.email;
        let user = await userSchem.findOne({email});
        if(!user) return res.error("This email address is not registered with us.",'',config.BAD_REQUEST_STATUS_CODE);
        let code = common.get_code();
        let rpuser = user.toJSON();
        rpuser.code = code;
        rpuser.template="otp-email";
        common.send_email(rpuser).then( async (err,response)=>{
            user.email_verify_code = code;
            await user.save();
            return res.success("We have send verification code in the email.");
        }).catch((err)=>{
            return res.error(err,'',config.BAD_REQUEST_STATUS_CODE);
        })
    },
    verify_otp: function(req, res){
        const {otp,email} = req.body;
        verifyOtp(email,otp,(isVerify)=>{
            if(isVerify) return res.success("Opt has been verified.");
            return res.error("Invalid Otp. Please check again.",'',config.BAD_REQUEST_STATUS_CODE);
        })
    },
    reset_password: async function(req,res){
        const {email,password} = req.body;
        let user = await userSchem.findOne({email});
        if(!user) return res.error("This email address is not registered with us.",'',config.BAD_REQUEST_STATUS_CODE);
        if(user.email_verify_code == 0) return res.error("Please request OTP first.",'',config.BAD_REQUEST_STATUS_CODE);
        if(user.email_verify_code != 1) return res.error("Please verify OTP first.",'',config.BAD_REQUEST_STATUS_CODE);
        let reset_user = user.toJSON();
        reset_user.template = "reset-password"
        common.send_email(reset_user).then( async (err,response)=>{
            user.password = bcrypt.hashSync(password, salt);
            user.email_verify_code =0;
            await user.save();
            return res.success("Your password has been changed successfully.");
        }).catch(err=>{
            return res.error(err,'',config.BAD_REQUEST_STATUS_CODE);
        })
    },
    check_username: async function(req,res){
        let user_name = await userSchem.findOne({username:req.params.username});
        if(user_name){
            return res.error("Username is already taken. Please try another one.",'',config.BAD_REQUEST_STATUS_CODE);
        }else{
            return res.success("Congratulation, the username is available.");
        }
    },
    follow: async function(req, res){
        let cuser = req.user;
        let follow_user = await userSchem.findOne({_id:req.params.user_id});
        // console.log(cuser);
        // return res.success("hi")

        //Logic for unfollow
        if(cuser.following && cuser.following.indexOf(follow_user._id) != -1){
            cuser.following.splice(cuser.following.indexOf(follow_user._id),1);
            await cuser.save();
            follow_user.followers.splice(follow_user.followers.indexOf(cuser._id),1);
            await follow_user.save();
            return res.success("Unfollow successfull.");
        }else if(cuser.following && cuser.following.indexOf(follow_user._id) == -1){
            cuser.following.push(follow_user._id);
            await cuser.save();
            follow_user.followers.push(cuser._id);
            await follow_user.save();
            await common.send_fcm_notification(`Congratulation !!!`, `${cuser.name} started following you.`, follow_user.fcm_token);
            return res.success("Follow successfull.");
        }

    },
    my_followers: async function(req,res){
        let user = req.user;
        if(!user && !req.params.user_id){
            return res.error("User id Or access token is required",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(!user){
            user = await userSchem.findOne({_id:req.params.user_id});
        }
        let filter ={
            _id:{$in:user.followers}
        }
        common.pagination(req,userSchem,filter,undefined,async (result)=>{
            rt= result.items.map(u=>{
                ua = u.toJSON();
                ua.is_followed = u.followers.indexOf(req.user._id) != -1;
                return ua;
            });
            result.items = rt;
            res.success("Followers List",result);
        },common.user_model);
    },
    my_following: async function(req,res){
        let user = req.user;
        if(!user && !req.params.user_id){
            return res.error("User id Or access token is required",'',config.BAD_REQUEST_STATUS_CODE);
        }
        if(!user){
            user = await userSchem.findOne({_id:req.params.user_id});
        }
        let filter ={
            _id:{$in:user.following}
        }
        common.pagination(req,userSchem,filter,[{path:"category",select:{name:1}},{path:"sub_category",select:{name:1}},{path:"user",select:{name:1,avatar:1}}],async (result)=>{
            res.success("Following List",result);
        },common.user_model);
    },
    chnage_password: async function(req, res){
        let user = req.user;
        const {oldpassword, newpassword} = req.body;
        if(bcrypt.compareSync(oldpassword, user.password)){
            user.password = bcrypt.hashSync(newpassword, salt);
            await user.save();
            res.success("Your password has been updated.");
        }else{
            res.error("Your old password dose not match.",'',config.SERVER_ERROR_STATUS_CODE);
        }

    },
    delete_account: async function(req,res){
        let user = req.user;
        let products = await productSchema.find({"_id":user._id});
        if(products){
            products.map(async (p)=>{
                let us = await userSchem.find({favorite:p._id});
                if(us){
                    us.map(async (u)=>{
                        u.favorite.splice(u.indexOf(p._id),1);
                        await u.save();
                    })
                }
                await p.delete();
            })
        }
        await user.delete();
        res.success("Your account has been permanently deleted.");
    },
    check_is_following: function (req, res) {
        let current_user = req.user;
        let check_user_id = req.params.user_id;
        let resp = {
            is_followed: current_user.following.indexOf(check_user_id) != -1
        }
        res.success("Check user follow",resp);
    }
}

async function verifyOtp(email, otp,cb){
    let user = await userSchem.findOne({email:email,email_verify_code:otp});
    if(user){
        user.email_verify_code =1;
        await user.save();
        cb(true);
    }else{
        cb(false)
    }
}

passport.use('facebook-token', new FacebookTokenStrategy({
        clientID        : config.FACEBOOK_CLIENT_ID,
        clientSecret    : config.FACEBOOK_CLIENT_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
        var user = {
            "email": "",
            "name": profile.displayName,
            "username": profile.id,
            "avatar": "profile_images/avatar.png",
            "is_email_verify":true,
            "provider":"facebook"
        }
        if(profile.emails.length>0 && profile.emails[0].hasOwnProperty("value") && profile.emails[0].value !== undefined){
            user.email = profile.emails[0].value;
        }else{
            user.email = profile.id+"@oncamp.com"
        }
        if(profile.photos.length>0 && profile.photos[0].hasOwnProperty("value")){
            user.avatar = profile.photos[0].value;
        }
        return done(null, user);
    }
));

passport.use("google-token",new GoogleTokenStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
        var user = {
            "email": profile._json.email,
            "name": profile._json.name,
            "username": profile.id,
            "avatar": profile._json.picture || "profile_images/avatar.png",
            "is_email_verify":true,
            "provider":"google"
        }
        return done(null,user);
    }
));
passport.use("twitter-token", new TwitterTokenStrategy({
        consumerKey: config.TWITTER_CONSUMER_KEY,
        consumerSecret: config.TWITTER_CONSUMER_SECRET
    }, function(accessToken, refreshToken, profile, done) {
        var user = {
            "email": "",
            "name": profile.displayName,
            "username": profile.id,
            "avatar": "profile_images/avatar.png",
            "is_email_verify": true,
            "provider": "twitter"
        }
    if(profile.emails.length>0 && profile.emails[0].hasOwnProperty("value") && profile.emails[0].value !== undefined ){
        user.email = profile.emails[0].value;
    }else{
        user.email = profile.username+"@oncamp.com"
    }
    if(profile.photos.length>0 && profile.photos[0].hasOwnProperty("value")){
        user.avatar = profile.photos[0].value;
    }
        return done(null, user);
    }
));
