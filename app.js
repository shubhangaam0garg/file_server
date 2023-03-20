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
const users = require("./data/users.json");
const encryptor = require('bcrypt');
const fs = require("fs");
const util = require('./util')
const cookieParser = require("cookie-parser");




const urlencodedParser = bodyParser.urlencoded({ extended: false })


port = 8080;

app.use(cookieParser());



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + "/public" + "/style.css");
});



app.get('/logo.png', function (req, res) {
  res.sendFile(__dirname + "/" + "logo.png");
});



app.get("/files", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if(typeof token !== 'undefined'){
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if(typeof foundUser !== 'undefined'){
        console.log(foundUser);
        res.sendFile(__dirname + "/public/files.html");
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("/")
  }
  

});




app.post("/registerUser", urlencodedParser, async (req, res) => {

  try {
    let foundUser = users.find((data) => req.body.username === data.username);
    if (!foundUser) {

      let hashPassword = await encryptor.hash(req.body.password, 10);

      let newUser = {
        id: Date.now(),
        username: req.body.username,
        email: req.body.email,
        lab: req.body.labs,
        password: hashPassword,
      };
      users.push(newUser);
      fs.writeFileSync('users.json', JSON.stringify(users));
      console.log('User list', users);
      res.sendFile(__dirname + "/public/registrationSuccess.html");
    } else {
      res.sendFile(__dirname + "/public/userAlreadyExists.html");
    }
  } catch (err) {
    res.send("Internal server error : " + err);
  }

});




app.get('/userManagement', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/userManagement.html'));
});




app.post("/login", urlencodedParser, async (req, res) => {
  try {
    let foundUser = users.find((data) => req.body.username === data.username);
    if (foundUser) {

      let submittedPass = req.body.password;
      let storedPass = foundUser.password;

      const passwordMatch = await encryptor.compare(submittedPass, storedPass);
      if (passwordMatch) {
        res.cookie("token", foundUser.id, { maxAge: 10000000, httpOnly: true });
        res.redirect("/files");
      } else {
        res.sendFile(__dirname + "/public" + "/invalidLogin.html");
      }
    }
    else {

      let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
      await encryptor.compare(req.body.password, fakePass);

      res.sendFile(__dirname + "/public" + "/invalidLogin.html");
    }
  } catch (err) {
    res.send("Internal server error : " + err);
  }
});



app.get("/images/:file", function (req, res) {
  let fileName = req.params.file;
  if (util.matchImageFile(fileName)) {
    res.sendFile(__dirname + "/images/" + fileName);
  } else {
    res.sendStatus(404)
  }
});


app.listen(port, () => {
  console.log("Server started, listening on Port 8080")
  console.log('User list', users);
})