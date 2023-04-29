const http = require("http");
const app = require("./app");

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
      console.log("client says : " + body);
      return response.end(content);
    });
});

server.listen(port, () => {
    console.log(`test back ${port}`);
});
