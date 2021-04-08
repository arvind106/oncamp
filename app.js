const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/config");
const response = require("./helpers/response");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const users={};
app.use(cors());

  io.on('connection', socket => {
      socket.on("user", (data) => {
      });
      socket.on("disconnect", (socket) => {
      });

  });


app.use(function(req,res,next){
    res.success = function(msg,data=[]){
        response.success(res,msg,data);
    };
    res.error = function(msg,data,status){
        status = status||201;
        response.error(res,msg,data,status);
    };
    res.token = function(msg,token,data=[]){
        response.token(res,msg,token,data);
    };
    res.emit_msg = function(event,msg){
        if(req.user){
        }
    };
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use("/api/"+config.API_VERSION, require("./routes/web.js"));


// const faker = require("faker");
// for(let i=0; i<199; i++) {
//     let product = require("./models/productSchema");
//     let indata = {
//         title: faker.commerce.productName(),
//         category: "5f81d821cfdb41726cb7948a",
//         sub_category: "5f82b042a4ca3649b1f9e7b8",
//         size: parseInt((Math.random()*10).toFixed(0)),
//         brand: faker.commerce.department(),
//         price: parseInt(faker.commerce.price()),
//         shipping: parseInt(faker.commerce.price()),
//         condition: 'used',
//         item_description: faker.commerce.productDescription(),
//         images: ["/public/products/5534223de38e8b6cd2ddd46d4f86e9b0_61956978748__9286E5AB-257C-4A19-AD53-2AB4D714F05E.JPG"],
//         user: "5f8b1cc5dd3db41f8c192fca",
//         address: faker.address.streetAddress(),
//         city: faker.address.city(),
//         state: faker.address.state(),
//         zipcode: parseInt(faker.address.zipCode()),
//         lat: faker.address.latitude(),
//         long: faker.address.longitude(),
//     }
//     let con = Math.random().toFixed(1);
//     if (con > 0.1 && con < 0.4) {
//         indata.condition = "new";
//     }
//     if (con > 0.4 && con < 0.7) {
//         indata.condition = "used";
//     }
//     if (con > 0.7 && con < 1) {
//         indata.condition = "gently_used";
//     }
//     console.log(indata);
//     product.create(indata)
// }

// const common = require("./helpers/common");
//
// common.send_fcm_notification("Testing Notification","This is a new notification","fUysyb_kSyyDZjBO9Nd146:APA91bFvLLO4AtWtq7xsmaKQSvpWIXVLfAeogeUbKMybF65aaVRg2bZirfxFWcqjMf7lYI9uEsiHU5wtXQtiMSrELsDmBBbbyVxe43XQIf4Qf5yP1KPpG-rzAXN2Icgil-aAmiMrM_18");

const swaggerUi = require('swagger-ui-express');
const apiDoc = require('./swagger/apiDoc');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDoc));
app.use(express.static('public'));
app.use("/public/",express.static('public'));
server.listen(config.PORT,config.IP,(req,res)=>{
    console.log(`Server started on http://${config.IP}:${config.PORT}`);
})



