/* eslint-disable no-debugger, no-console */
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const functions = require('firebase-functions');
const mongoose= require('mongoose');
const User= require('./models/user.js');
const Course= require('./models/courses.js');
const Faq= require('./models/faq.js');
const web=require('./WebScrapper.js');
const webhook=require('./index_webhook.js');
const dialogflowserver= require('./indexsurver.js');
const admin = require('firebase-admin');
const axios = require('axios');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp } = require('firebase-admin/app');
var Cookies = require('cookies')

const serviceAccount = require("./serviceAccountKey.json");
const firebaseAd = initializeApp();

const cors = require('cors')({ origin: true });

//  'mongodb+srv://dialogflowTest:r1qYq84C8TnhJTdI@dialogflowdata-disdd.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect('mongodb://dialogflowTest:r1qYq84C8TnhJTdI@dialogflowdata-shard-00-00-disdd.mongodb.net:27017,dialogflowdata-shard-00-01-disdd.mongodb.net:27017,dialogflowdata-shard-00-02-disdd.mongodb.net:27017/test?ssl=true&replicaSet=DialogFlowData-shard-0&authSource=admin&retryWrites=true&w=majority',
{ useNewUrlParser: true ,useUnifiedTopology: true});

var app = express();
app.use(cors);


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const myLogger = function (request, response, next) {
	var admintoken=request.headers.authorization;
	console.log("request");
	console.log(request.headers);
	console.log(admintoken);
	getAuth()
	  .verifyIdToken(admintoken)
	  .then((decodedToken) => {
	     next()

	    // ...
	  })
	  .catch((error) => {
	    // Handle error
			console.error(error);
			response.end();
	  });


}
app.use(myLogger)
//loggedin
//item
//itemsingle
//register
//

app.post('/loggedin',async function(request, response) {
	var admintoken=request.body.admintoken;

	getAuth()
	  .verifyIdToken("admintoken")
	  .then((decodedToken) => {
	    const uid = decodedToken.uid;
			console.log("ggg");
			response.send(true);
			response.end();

	    // ...
	  })
	  .catch((error) => {
	    // Handle error
			console.error(error);
			response.end();
	  });



});



app.post('/userReg',async function(request, response) {
	var adminId;
	var username;
	var password;



getAuth()
  .createUser({
    email: "haseeb0910@gmail.com",
    emailVerified: false,
    password: "pass345678",
    disabled: false
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
		//return true
    console.log('Successfully created new user:', userRecord.uid);
		response.send({user:userRecord})
		response.end();

  }).catch((e)=>{
		console.error("e");
		response.status(400).send({
	   message: 'This is an error!'
	});
		response.end();
	})



});


app.get('/courses', function(request, response) {

	  Course.find().then(result=>{

		 if(result.length>0){

			 response.send({courses:result});
			 response.sendStatus(200);
			 response.end();
		 }else{
			 response.sendStatus(406);
			 response.end();
		 }

	 }


	 ).catch(e=>{
response.sendStatus(500);
//unable to add to db
})
});
app.get('/faqs', function(request, response) {
	 Faq.find().then(result=>{

		 if(result.length>0){

			 response.send({Faqs:result});
			 response.sendStatus(200);
			 response.end();
		 }else{
			 response.sendStatus(406);
			 response.end();
		 }

	 }


	 ).catch(e=>{
response.sendStatus(500);
//unable to add to db
})
});
app.post('/faq/edit', function(request, response) {
	 Faq.find({ _id:request.body.id }).then(result=>{
	 		console.log(result[0]);
	 		response.send({faq:result[0]});
			// return undefined;
	 }).catch(e=>{
response.sendStatus(500);
//unable to add to db
})
	 })

	 app.post('/faq/create', function(request, response) {
		 if(request.body.faq.question!==""&&request.body.faq.answer!==""){
			 try {
				 var faq=new Faq();
			  faq.question=request.body.faq.question;
			  faq.answer=request.body.faq.answer;
			  faq.save();
				response.sendStatus(200);

			 } catch (e) {
			 	response.sendStatus(500);
			 } finally {
			 	response.end();
			 }



}else {
	response.sendStatus(406);// the variables passed not exceptable
}


});
app.post('/faq/edit/update', function(request, response) {
	 Faq.find({ _id:request.body.id }).then(result=>{
	 		console.log(result[0]);
	 		result[0].question=request.body.faq.question;
			result[0].answer=request.body.faq.answer;
			result[0].save();
			response.sendStatus(200)
			response.end();


	 }).catch(e=>{
response.sendStatus(500)
//unable to add to db
})



});
app.post('/scrape',async function(request, response) {
	await returnAllScrappedCourses();
	response.end();







});
async function returnAllScrappedCourses(){
		var courses=await scrapeCourses();
	return courses;
}
async function scrapeCourses(){
	var courses=[];
	var a=['https://www.aston.ac.uk/study/courses/smart-telecom-and-sensing-networks-smartnet-msc-1-year','https://www.aston.ac.uk/study/courses/applied-artificial-intelligence-including-professional-practice-msc/september-2021','https://www.aston.ac.uk/study/courses/artificial-intelligence-with-business-strategy-including-professional-practice-msc','https://www.aston.ac.uk/study/courses/computer-science-including-professional-practice-msc','https://www.aston.ac.uk/study/courses/mechanical-engineering-msc','https://www.aston.ac.uk/study/courses/smart-telecom-and-sensing-networks-smartnet-msc-1-year','https://www.aston.ac.uk/study/courses/data-analytics-including-professional-practice-msc','https://www.aston.ac.uk/study/courses/data-analytics-msc'];

		for (const url of a) {
	const course = 		axios
			.post('https://us-central1-test-eixuyp.cloudfunctions.net/web-webscrapper', {
				url: url
			})
			.then(res => {
var course=new Course();
course.course_name=res.data.course.coursename;

course.course_type=res.data.course.courseType;
course.duration=res.data.course.duration;
course.location=res.data.course.location;
course.supervisor=res.data.course.supervisor;
course.ucas_code=res.data.course.ucasCode;
course.start_date=res.data.course.startDate;
course.cost=res.data.course.cost;

course.requirments=res.data.course.requirments;
course.faq=res.data.course.faq;
course.modules=res.data.course.modules;
//course.tags=request.body.course.tags;
course.save();
				return res.data.course;
			})
			.catch(error => {
				console.error(error)
			})


courses.push(course);
console.log(course);


	}
return courses;

}

app.post('/courses/edit/update', function(request, response) {
	console.log(request.body);

	Course.find({ _id:request.body.id }).then(result=>{
		console.log(result[0]);
		result[0].course_name=request.body.course.course_name;
		result[0].course_type=request.body.course.course_type;
		result[0].duration=request.body.course.duration;
		result[0].location=request.body.course.location;
		result[0].supervisor=request.body.course.supervisor;
		result[0].ucas_code=request.body.course.ucas_code;
		result[0].start_date=request.body.course.start_date;
		result[0].cost=request.body.course.cost;






		result[0].requirments=request.body.course.requirments;
		result[0].faq=request.body.course.faq;
		result[0].modules=request.body.course.modules;
		console.log(request.body.course.modules);
		result[0].tags=request.body.course.tags;
		result[0].overview=request.body.course.overview;




		result[0].save();
		response.sendStatus(200);
		response.end();

}).catch(e=>{
response.sendStatus(500);
//unable to add to db
})
});
app.post('/courses/edit', function(request, response) {
	console.log(request.body);
	Course.find({ _id:request.body.id }).then(result=>{
		console.log(result[0]);
		response.send({course:result[0]});
		response.sendStatus(200);
		response.end();
}).catch(e=>{
response.sendStatus(500);
//unable to add to db
})
});
app.post('/courses/create', function(request, response) {
	try {
		const course=new Course();

		course.course_name=request.body.course.course_name;
		course.course_type=request.body.course.course_type;
		course.duration=request.body.course.duration;
		course.location=request.body.course.location;
		course.supervisor=request.body.course.supervisor;
		course.ucas_code=request.body.course.ucas_code;
		course.start_date=request.body.course.start_date;
		course.cost=request.body.course.cost;

		course.requirments=request.body.course.requirments;
		course.faq=request.body.course.faq;
		course.modules=request.body.course.modules;
		course.tags=request.body.course.tags;
		course.overview=request.body.course.overview;


	course.save();
	response.sendStatus(200);
	} catch (e) {
		response.sendStatus(500);
	} finally {
		response.end();
	}



});

const simple = functions.https.onRequest(app);

			module.exports = {
				simple,web,webhook,dialogflowserver
			};
