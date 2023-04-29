const http = require("http");
const app = require("./app.js");

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
            return response.end("No Valid Command");
        }

    });
});

server.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});