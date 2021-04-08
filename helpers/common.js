const config = require("../config/config");
const fs = require("fs");
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
const path = require("path");
const axios = require("axios");
const notification = require("../models/notifiationSchema");
const columns = ["_id","name","username","email","avatar","collage_name","account_type","fcm_token","followers","following","favorite"];
const offerSchema = require("../models/offerSchema");
module.exports={
	send_email: function(data){
		return new Promise((resolve,reject)=>{
			const EmailTemplate = require('email-templates').EmailTemplate
			let templateDir = path.join(__dirname,'..','templates',data.template);
			if(!fs.existsSync(templateDir)){
				reject(`Email template not found. in path ${templateDir}`);
			}else {
				let transporter = require("../config/email");
				let template = new EmailTemplate(templateDir);
				data.logo = `http://localhost:${config.PORT}/email-images/logo.png`;
				template.render(data, async (err, result) => {
					if (err){
						reject("Email template not found.");
					}else {
						transporter.sendMail({
							from: `"${config.SMTP_FROM_NAME}" <${config.SMTP_FROM_EMAIL}>`, // sender address
							to: data.email, // list of receivers
							subject: result.subject, // Subject line
							html: result.html, // html body
						}, (err, response) => {
							if (err){
								resolve("Email Server not working please try after some time.");
							}else {
								resolve("Email send successfully.")
							}
						});
					}
				});
			}
		})

	},
	user_model:columns,
	account_type:function(email){
		let email_domain = email.split("@");
		let is_student = /(\.edu(\.[a-z]+)?|\.ac\.[a-z]+)$/.test(email_domain);
		return is_student?'seller':'buyer';
	},
	limitString: function(str,limit){
		return str.length>limit?str.substr(0,limit)+"...":str;
	},
	saveFile:saveImage,
	removeFile:function(path){
		let dir =path;
		if(!Array.isArray(path)){
			dir = [path];
		}
		dir.map(f=>{
			if (fs.existsSync(f)) {
				fs.rmdirSync(path)
			}
		})
	},
	get_file_content:getFileContent,
	foreach:asyncForEach,
	wait:waitFor,
	get_code:function(){
		const char = '123456789';
		const length = 4;
		let randomvalue = '';
		for ( let i = 0; i < length; i++) {
			randomvalue += char.charAt(Math.floor(Math.random() * char.length));
		}
		return randomvalue;
	},
	save_files: async function(files,fields,cb){
		const start = async ()=> {
			fields.images = [];
			await asyncForEach(files, async (file) => {
				await waitFor(100);
				let dest = path.join(__dirname,'..',file.destination);
				if(!fs.existsSync(dest)){
					await fs.mkdirSync(dest,{recursive:true});
				}
				let filename = `${file.filename}_${file.originalname}`;
				let file_path = file.path;
				let new_path = path.join(dest,filename);
				fields.images.push(`${file.destination}/${filename}`);
				fs.renameSync(file_path,new_path);
			});
			cb(fields);
		}
		start();
	},
	pagination: async function (req,model,filter,populate,cb,columns) {
		let perpage = parseInt(req.query.perpage) || config.PER_PAGE_RECORD
		let page = parseInt(req.query.page) || 1
		let skip = (page -1) * perpage;
		let total_records = await model.countDocuments();
		let filtered_records = await model.countDocuments(filter);
		let total_pages = Math.ceil(filtered_records/perpage);
		let data = null;
		if(populate === undefined) {
			if(columns !== undefined){
				data = await model.find(filter, columns).sort({"created_at": -1}).skip(skip).limit(perpage);
			}else{
				data = await model.find(filter).sort({"created_at": -1}).skip(skip).limit(perpage);
			}
		}else{
			if(columns !== undefined) {
				data = await model.find(filter,columns).sort({"created_at": -1}).skip(skip).limit(perpage).populate(populate);
			}else{
				data = await model.find(filter).sort({"created_at": -1}).skip(skip).limit(perpage).populate(populate);
			}
		}
		let response={
			items:data,
			total_records:total_records,
			filtered_records:filtered_records,
			current_page:page,
			total_pages:total_pages,
			perpage:perpage,
			first_page:1,
			last_page:total_pages,
			previous_page: `?perpage=${perpage}&page=${(page==1?1:page-1)}`,
			next_page : `?perpage=${perpage}&page=${(page==total_pages?total_pages:page+1)}`,

		}
		cb(response)
	},
	send_notification : function(sender,receiver,type,title,msg,data,is_firebase=false){
		let ndata = {
			sender: sender,
			receiver: receiver,
			title: title,
			message: msg,
			type: type,
			data: data
		}
		notification.create(ndata);
	},
	get_user_model: async function(model,user_id){
		let user = await model.findOne({_id:user_id},columns).populate([
			{path:"favorite",select:{title:1,images:1}},
			{path:"products",select:{title:1,images:1}},
			{path:"followers",select:{name:1,avatar:1}},
			{path:"following",select:{name:1,avatar:1}},
			{path:"comments",match:{type:"profile"}, select:{comment:1,rating:1},populate:{path:'user',select:{name:1,avatar:1}}}
		]);
		if(!user) return res.error("User not found.",'',config.BAD_REQUEST_STATUS_CODE);
		user = user.toJSON({virtuals:true});
		user.total_rating =0;
		let rating = {1:0,2:0,3:0,4:0,5:0};
		let rating_desc = {1:0,2:0,3:0,4:0,5:0};
		let total =0
		let total_sum =0
		if(user.comments.length >0){
			user.comments.map(c => {
				rating[Math.round(c.rating)] += c.rating;
				rating_desc[Math.round(c.rating)] += 1;
				total_sum+=c.rating;
			});
			Object.keys(rating).map(rk =>{
				total += (rk*rating[rk]);
			})
		}
		user.total_rating = total/total_sum;
		user.rating_desc = rating_desc;
		return user;
	},
	send_fcm_notification: async function(title, body, fcmToken){
		let msg_url = "https://fcm.googleapis.com/fcm/send";
		let server_key = "AAAAehWYzD8:APA91bF9VGpvd_aCHxhA38M4PtCIYk0HAz3FJT8IMEsI3S-TIB4YUdRxXUxJAg0Kzy7WcyzD1sarud557BDmMQoKdVNd-_jkSRKCcZyrr0qNyk1p5-jQFJf-o1tlgoBkDLeozM66xH3w";
		let notification = {
			notification: {
				'body': body,
				'title': title
			},
			priority: 'high',
			data: {
				click_action: 'FLUTTER_NOTIFICATION_CLICK',
				id: '1',
				status: 'done'
			},
			to: fcmToken
		};
		let config = {
			method: 'post',
			url: msg_url,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `key=${server_key}`,
			},
			data:notification
		}
		axios(config)
			.then(function (response) {
				//console.log(response.data)
			})
			.catch(error=>{
				//console.log(error);
			})
	},
	get_offred : async function(user,product){
		let offer = await offerSchema.find({sender:user,product:product, status:{$ne:"Paid"},status:{$ne:"Deleted"},status:{$ne:"Declined"}});
		console.log(offer);
		return offer.length >=1;
	}
}
function getFileContent(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, body) => {
			if (error) reject(error);
			if (response.statusCode != 200) {
				reject('Invalid status code <' + response.statusCode + '>');
			}
			resolve(body);
		});
	});
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


async function saveImage(fields,fiels,cb){
    let fkeys = Object.keys(fiels);
    const start = async ()=>{
    await asyncForEach(fkeys, async (key)=>{
        await waitFor(100);
        let akeyo = key.split(".");
        let akey = akeyo[0];
        let file = fiels[key];
        let oldpath = file.path;
        let path = __dirname+"/../public/"+akey+"/"+fields._id;
        let newpath =  path+"/"+file.name;
        let dbpath = akey+"/"+fields._id+"/"+file.name;
        let s3_path = "yvita/"+fields._id+"/"+file.name;
        if(config.USE_S3_FILESYSTEM){
        	dbpath = config.S3_URL+s3_path;
        }
        if(akeyo.length>1){
        	if(akey in fields){
        		fields[akey].push(dbpath);
        	}else{
        		fields[akey] = [dbpath];
        	}
        }else{
        	fields[akey] = dbpath;
        }

        fs.exists(path,async (is_exist)=>{
            if(!is_exist){
                await fs.mkdirSync(path,{recursive:true});
            }
            fs.rename(oldpath, newpath, function (err) {
                if (err) { console.log(err) }

                upload_s3(newpath,s3_path,dbpath);
              });
        });
    });
    cb(fields);
}
start();
}

function upload_s3(newpath,file,dbpath){
	if(config.USE_S3_FILESYSTEM){
		var mime = require('mime-types');
		var params = {
			Bucket: config.S3_BUCKET_NAME,
			Body : fs.createReadStream(newpath),
			Key : file,
			ContentType:mime.lookup(newpath),
			ACL:"public-read"
		};
		const client = require("../config/s3");
		client.upload(params, function (err, data) {
			if (err) { console.log(err); }
		});
	}
}

function delete_s3(path){
	if(config.USE_S3_FILESYSTEM){
		var params = {
			Bucket: config.S3_BUCKET_NAME,
			Key : path,
			RequestPayer: "requester",
		};
		console.log(params);
		const client = require("../config/s3");
		client.deleteObject(params, function (err, data) {
			if (err) { console.log(err); }
			console.log(data);
		});
	}
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
