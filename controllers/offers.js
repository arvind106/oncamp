const productSchema = require("../models/productSchema");
const offerSchema = require("../models/offerSchema");
const config = require("../config/config");
const common = require("../helpers/common");
module.exports = {
    make_offer: async function(req, res){
        let user = req.user;
        const {product_id, product_price} = req.body;
        if(!product_id || !product_price) return res.error("Product id or product price is mandatory.",'',config.BAD_REQUEST_STATUS_CODE)
        let product = await productSchema.findById(product_id).populate("user");
        let offer = {
            product : product._id,
            sender : user._id,
            receiver: product.user._id,
            offer_price: product_price,
        };
        offerSchema.updateOne({product:product._id, sender: user._id,status:"Requested"},offer,{new:true, upsert: true, setDefaultsOnInsert: true}, async (err, doc) => {
            if(err) return res.error("Some error occur.","",config.BAD_REQUEST_STATUS_CODE);
            if(Object.keys(doc).indexOf("upserted") != -1) {
                await common.send_fcm_notification("Congratulation you receive a offer.", `${user.name} gave you an offer.`, product.user.fcm_token);
            }else {
                await common.send_fcm_notification("Offer Modified.", `${user.name} has modify his offer.`, product.user.fcm_token);
            }
            return res.success("Offer has been send successfully.");
        })
    },
    get_offers: async function(req, res){
        let type = req.params.type;
        let user = req.user;
        let con={};
        if(type == "sent"){
            con.sender = user._id;
        }
        if(type == "receive"){
            con.receiver = user._id;
            con.status = {"$ne":"Deleted"};
        }
        await common.pagination(req, offerSchema, con, [{
            path: "product",
            select: {title: 1, images: 1}
        }, {path: "sender", select: {name: 1, avatar: 1}}, {
            path: "receiver",
            select: {name: 1, avatar: 1}
        }], (results) => {
            res.success("Offers List",results);
        });
    },
    delete_offer: async function(req, res){
        let offer_id = req.params.offer_id;
        let offer = await offerSchema.findById(offer_id);
        offer.status = "Deleted";
        await offer.save();
        res.success("Offer has been deleted.");
    },
    accept_offer: async function(req, res){
        let offer_id = req.params.offer_id;
        let offer = await offerSchema.findById(offer_id).populate([{path:"sender",select:{name:1,fcm_token:1}},{path:"receiver",select:{name:1,fcm_token:1}}]);
        offer.status = "Accepted";
        offer.human_status = "Seller Accepted The Offer";
        await offer.save();
        await common.send_fcm_notification("Hurry !!! Offer accepted.", `${offer.receiver.name} accepted your offer.`, offer.sender.fcm_token);
        res.success("Offer has been accepted.");
    },
    decline_offer: async function(req, res){
        let offer_id = req.params.offer_id;
        let offer = await offerSchema.findById(offer_id).populate([{path:"sender",select:{name:1,fcm_token:1}},{path:"receiver",select:{name:1,fcm_token:1}}]);
        offer.status = "Declined";
        offer.human_status = "Seller Declined The Offer";
        await offer.save();
        await common.send_fcm_notification("Sorry !!! Offer Declined.", `${offer.receiver.name} declined your offer.`, offer.sender.fcm_token);
        res.success("Offer has been declined.");
    },
    make_offer_paid: async function(req, res){
        let offer_id = req.params.offer_id;
        let offer = await offerSchema.findById(offer_id);
        offer.status = "Paid";
        await offer.save();
        res.success("Offer has been paid.");
    },
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYmRjODZkN2Y1Y2JmNzMyYzFmYjlmNCIsImlhdCI6MTYwNzYyNzQxMywiZXhwIjoxNjM5MTYzNDEzfQ.XqehK1mUNDgmBVG2VH0QgTCAQYNU6XAnoj4_mZyowsM
