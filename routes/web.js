const route = require("express").Router();
const userC = require("../controllers/userController");
const categoryC = require("../controllers/categoryController");
const notificationC = require("../controllers/notificationController");
const productC = require("../controllers/productController");
const jwtverify = require("../helpers/jwtHelper");
const multer = require("multer");
const product_images = multer({ dest: '/public/products' });
const post_images = multer({ dest: '/public/posts' });
const commentC = require("../controllers/commentController");
const offer = require("../controllers/offers");
const postC = require("../controllers/postController");

route.post("/register",userC.register);
route.post("/register/verify-email-and-login",userC.verify_email_and_login);
route.get("/register-and-login-with/:scop",userC.register_and_login_with);
route.post("/login",userC.login);
route.get("/profile",jwtverify,userC.profile);
route.get("/profile/:user_id",userC.profile);
route.post("/update-profile",jwtverify,userC.update_profile);
route.post("/forget-password",userC.forget_password);
route.post("/reset-password",userC.reset_password);
route.post("/verify-otp",userC.verify_otp);
route.get("/check-username/:username",userC.check_username);
route.get("/follow/:user_id",jwtverify,userC.follow);
route.get("/my-followers",jwtverify,userC.my_followers);
route.get("/my-followers/:user_id",userC.my_followers);
route.get("/my-following",jwtverify,userC.my_following);
route.get("/my-following/:user_id",userC.my_following);
route.post("/change-password",jwtverify,userC.chnage_password);
route.get("/is-followed/:user_id", jwtverify, userC.check_is_following);
route.get("/delete-account",jwtverify,userC.delete_account);

//Add and list category
route.get("/categories",categoryC.list);
route.post("/add-category",categoryC.add_category);
route.post("/add-sub-category/:category_id",categoryC.add_sub_ategory);

//Add and get notification list
route.get("/notifications",jwtverify,notificationC.list);
route.post("/add-notification",jwtverify,notificationC.add);
route.get("/make-read/:notification_id",jwtverify,notificationC.update);

//Add Products
route.get("/products",jwtverify,productC.list);
route.get("/product/:product_id",jwtverify,productC.get_by_id);
route.post("/products",jwtverify, product_images.array("images",6), productC.add);
route.get("/favorite-product/:product_id",jwtverify, productC.add_or_remove_favorite);
route.get("/my-products",jwtverify, productC.get_my_product);
route.get("/my-products/:user_id", productC.get_my_product);
route.get("/my-favorite-products",jwtverify, productC.get_my_favorite_product);

// Comment Management
route.post("/comment",jwtverify,commentC.add);
route.patch("/comment/:comment_id",jwtverify,commentC.update);
route.get("/get-comment/:type/:option_id",jwtverify,commentC.get_comment);

// Sent receive accept reject offer
route.post("/make-offer",jwtverify, offer.make_offer);
route.get("/my-offers/:type",jwtverify, offer.get_offers);
route.get("/accept-offer/:offer_id",jwtverify, offer.accept_offer);
route.get("/decline-offer/:offer_id",jwtverify, offer.decline_offer);
route.get("/make-offer-paid/:offer_id",jwtverify, offer.make_offer_paid);
route.get("/delete-offer/:offer_id",jwtverify, offer.delete_offer);

// Post
route.get("/posts",jwtverify,postC.list);
route.post("/posts",jwtverify, post_images.array("images",6), postC.add);
route.get("/post/:post_id",jwtverify,postC.get_by_id);
route.get("/my-posts", jwtverify, postC.get_my_post);
route.get("/my-posts/:user_id", postC.get_my_post);

module.exports=route;
