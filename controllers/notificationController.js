const notificationSchema = require("../models/notifiationSchema");
const config = require("../config/config");
const mongoose = require("mongoose");
const common = require("../helpers/common");
module.exports = {
    list: async function(req, res){
        let user = req.user;
        let notifications = await notificationSchema.find({receiver:user._id}).sort({_id: -1});
        if(!notifications) return res.error("Notifications not found.",'',config.NOT_FOUND_STATUS_CODE);
        res.success("Notifications list.",notifications);
    },
    add: function(req, res){
        notificationSchema.create(req.body, async (err,doc)=>{
            if(err) return res.error("Some error",'',config.SERVER_ERROR_STATUS_CODE);
            return res.success("Notification has been added.");
        })

    },
    update: async function(req, res){
        let nid = req.params.notification_id;
        await notificationSchema.findByIdAndUpdate(nid,{$set:{is_read:true}},{upsert:false, new: false})
        return res.success("Notification has been updated.");
    }
}
