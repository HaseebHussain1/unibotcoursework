/* eslint-disable no-debugger, no-console */
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const functions = require('firebase-functions');
const mongoose= require('mongoose');

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




const simple = functions.https.onRequest(app);

			module.exports = {
				simple,web,webhook,dialogflowserver
			};
