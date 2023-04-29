const firebase = require("firebase/compat/app");
const db = require("firebase/compat/database");
const dbInfo = require("./database.json");

firebase.initializeApp(dbInfo);

function GetShop(Callback) {

    const ref = firebase.database().ref("Shop");
    ref.on('value', (snapshot)=>{
       Callback(snapshot.val());
    });

}

module.exports = { GetShop };