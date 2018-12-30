const firebase = require("firebase");
const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
};

firebase.initializeApp(config);
const db = firebase.database();
const auth = firebase.auth();
//const store = firebase.storage();
module.exports = { db, auth };
