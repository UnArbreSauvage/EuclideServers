const http = require("http");
const app = require("./app.js");
const email = require("./email.js");

const port = process.env.PORT || 5000;
const server = http.createServer((request,response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Max-Age', 2592000);
    response.writeHead(200,{"Content-Type" : "text/html"});
    let body = [];
    request.on('data',(chunk)=>{
        body.push(chunk);
    }).on('end', () => {

        body = Buffer.concat(body).toString();
        
        if (body == "GetShop") {

            app.GetShop((data)=>{
                console.log(data);
                const content = JSON.stringify(data, null, 3);
                return response.end(content);
            });

        }

        else {
            
            const commands = body.split(";");
            
            if (commands[0] == "Signup") {

                const json = JSON.parse(commands[1]);
                app.CreateUser(json,(result)=>{
                    console.log("Request ended with result : " + result);
                    const content = JSON.stringify({Response : result}, null, 3);
                    if (result == 'Success') {
                        email.SendEmail(json['email']);
                    }
                    return response.end(content);
                });

            } else if (commands[0] == "EmailCode") {

                email.ConfirmEmail(commands[1], parseInt(commands[2]), (author,result)=>{

                    if (result == 'Success') {
                        app.GetUserByEmail(author,(user)=>{
                            app.ConfirmEmail(user,()=>{
                                const data = {Response : result};     
                                const content = JSON.stringify(data, null, 3);
                                return response.end(content);
                            });
                        });
                    } else {
                        const data = {Response : result};     
                        const content = JSON.stringify(data, null, 3);
                        return response.end(content);
                    }

                });

            } else if (commands[0] == "Login") {

                app.Login(commands[1],commands[2],(result,user)=>{

                    if (result == 'Success') {

                        email.SendAlertEmail(user, commands[3], commands[4], commands[5]);
                        const data = {Response : result, Account : user};     
                        const content = JSON.stringify(data, null, 3);
                        return response.end(content);
                    } else {
                        const data = {Response : result, Account : undefined};     
                        const content = JSON.stringify(data, null, 3);
                        return response.end(content);
                    }

                });

            }

        }

    });
});

server.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
