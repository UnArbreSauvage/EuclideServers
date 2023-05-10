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

function ValidateEmail(input) {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (input.match(validRegex))
        return true;

    return false;
  
}

function CreateUser(User, Callback) {

    var ref = firebase.database().ref("Users");
    var hasAlreadyUpdated = false;
    ref.on('value', (snapshot)=>{
        if (hasAlreadyUpdated == false) {
            hasAlreadyUpdated = true;
            var count = 0;
            snapshot.forEach((child)=>{
                if (child.key == User['username']) {
                    Callback("Username is already taken");
                    return;
                } else if (child.child("email").val() == User['email']) {
                    Callback("Email is already taken");
                    return;
                } else if (child.child("phoneNumber").val() == User['phoneNumber']) {
                    Callback("Phone number is already taken");
                    return;
                }

                count++;
                if (count == snapshot.numChildren()) {
                    if (ValidateEmail(User['email'])) {
                        setTimeout(()=>{
                            User['level'] = 0;
                            User['maxXp'] = 50;
                            User['xp'] = 0;
                            User['HasVerifiedEmail'] = false;
                            ref = firebase.database().ref("Users").child(User['username']);
                            ref.set(User,()=>{
                                Callback('Success');
                                return;
                            });
                        },2500);
                    } else {
                        Callback("Email is not in a valid format.");
                        return;
                    }
                }

            });
        }
        
    });
    

}

function GetUserByEmail(email, Callback) {
    var ref = firebase.database().ref("Users");
    ref.on('value', (snapshot)=>{
        snapshot.forEach((child)=>{
            if (child.child('email').val() == email) {
                Callback(child.key);
            }
        });
    });
}

function ConfirmEmail(user, Callback) {
    const ref = firebase.database().ref(`Users/${user}/HasVerifiedEmail`);
    ref.set(true,()=>{
        Callback();
    });
}

function Login(username, password, Callback) {

    const ref = firebase.database().ref(`Users/${username}`);
    ref.on('value',(profile)=>{
        if (profile.child('password').val() == password) {
            Callback('Success', profile.val());
        } else {
            Callback('No account founded / wrong password');
        }
    });

}

module.exports = { GetShop, CreateUser, ConfirmEmail, GetUserByEmail, Login };