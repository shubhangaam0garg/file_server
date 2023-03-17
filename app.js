/**
 * @author Shubhangam Garg
 * @date 01/03/2023
 * This is the main server file which contaains necessary info
 * to start the server.
 */

const express = require('express');
const utility = require('./utility');
const path = require('path');
const connection = require('./connection');
const bodyParser = require('body-parser');  
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false })  
port = 8080;


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/serverStatus',(request, response) => {
    serverAddress = request.query.serverAddress;
    port = request.query.port;
    var responseObject = new Object();
    responseObject.time = utility.getTime();
    responseObject.serverAddress = serverAddress;
    responseObject.port = port;
    connection.checkTCPConnection(serverAddress,port)
    .then(() => {
        responseObject.isHostRunning = true;
        responseObject.message = "Connection to the host established"
        response.send(responseObject)
    })
    .catch(() => {
        responseObject.isHostRunning = false;
        responseObject.message = "Couldn't establish connection to the host"
        response.send(responseObject)
    })
    
})
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
  });
  app.get('/logo.png', function(req, res) {
    res.sendFile(__dirname + "/" + "logo.png");
  });

  app.post("/files", urlencodedParser,function(req, res){
    var lab = req.query.labs
        
  });



app.listen(port, () => {
    console.log("Server started, listening on Port 8080")
})