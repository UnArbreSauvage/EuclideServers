const nodeMailer = require('nodemailer');

const authors = {};
const transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'euclidestudios@gmail.com',
        pass : 'fvhrhvlrzfyyavsm'
    }
});

function generateCode() {
    const len = 6;
    var code = "";
    for (let i = 0 ; i < len ; i++) {
        const randLetter = Math.floor(Math.random() * 10);
        code += randLetter.toString();
    }

    return code;
}

function SendEmail(destinator) {

    const code = generateCode();
    authors[destinator] = code;

    const info = transporter.sendMail({
        from : 'EuclideStudios euclidestudios@gmail.com',
        to : destinator,
        subject : 'Your verification code',
        html : 'Hi, welcome to Euclide Studios Services ! We are happy to see you over here. Here is your code to validate your account : ' + code + '. Welcome and have a nice day !'
    });

}

function ConfirmEmail(author, code, Callback) {
    if (authors[author] == code) {
        console.log(`${author} has verified his email successfully !`);
        delete authors[author];
        Callback(author,"Success");
    } else {
        console.log(`${author} has redeemed code ${code} instead ${authors[author]}, Wrong code.`);
        Callback(author,"Wrong Code.");
    }
}

function SendAlertEmail(user, postal, country, city) {
    transporter.sendMail({
        from : 'EuclideStudios euclidestudios@gmail.com',
        to : user['email'],
        subject : 'New Connection',
        html : `Hi ${user['firstname']} ! \nSomeone has connected to your account. Here some information about the user : \nPostal : ${postal}, \nCountry : ${country}, \nCity : ${city}.`
    });
}

module.exports = { SendEmail, ConfirmEmail, SendAlertEmail };