const firebase = require('firebase');

const config = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.AUTH_DOM,
    databaseURL: process.env.DB_URL,
    storageBucket: process.env.SB_URL,
    projectId: process.env.PROJ_ID,
    messagingSenderId: process.env.MES_SEND_ID
};
const database = firebase.initializeApp(config);

module.exports.firebase = database;