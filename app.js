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
const pages = require('./pages')




const urlencodedParser = bodyParser.urlencoded({ extended: false })


port = 8080;

app.use(cookieParser());
app.set('view engine', 'ejs');



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
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      console.log(foundUser);
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, lab);
      let tableData = util.getFilesTable(directoryPath);
      console.log(tableData);
      res.send(pages.filesPageHeader + pages.fileTableHeader + pages.tableBodyHeader +
        tableData + pages.tableBodyFooter + pages.fileTableFooter + pages.filePageFooter);
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }


});




app.post("/registerUser", urlencodedParser, async (req, res) => {

  try {
    let foundUser = users.find((data) => req.body.username === data.username);
    if (!foundUser) {

      salt = '$2b$10$X4kv7j5ZcG39WgogSl16au'
      let hashPassword = await encryptor.hash(req.body.password, salt);

      let newUser = {
        id: Date.now(),
        username: req.body.username,
        lab: req.body.labs,
        password: hashPassword,
      };
      users.push(newUser);
      fs.writeFileSync('./data/users.json', JSON.stringify(users));
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
  const localHost = "::ffff:127.0.0.1"
  console.log(req.socket.remoteAddress)
  if (req.socket.remoteAddress === localHost) {
    res.sendFile(path.join(__dirname, '/public/userManagement.html'));
  } else {
    res.sendFile(path.join(__dirname, '/public/accessDenied.html'));
  }

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
        res.redirect("/filesJS");
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




app.get("/download", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let fileName = req.query.file;
      let filePath = (__dirname + '/' + lab + '/' + fileName);
      if (util.matchDownlaodFile(filePath)) {
        res.set("Content-Disposition", 'attachment; filename="' + fileName + '"');
        res.sendFile(filePath);
      } else {
        res.sendFile(__dirname + "/public" + "/error404.html");
      }
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }

})



app.get("/filesJSON", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      console.log(foundUser);
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, lab);
      let tableData = util.getFilesTableJSON(directoryPath);
      res.json(tableData);
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }


});


app.get("/filesJS", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, lab);
      let tableData = util.getFilesTableJSON(directoryPath);
      res.render('pages/files', {
        title: 'Files : DESIDOC e-Resource Sharing',
        files: tableData,
        user: foundUser
      });
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
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

app.get("/js/:file", function (req, res) {
  let fileName = req.params.file;
  console.log(fileName);
  if (util.matchJSFile(fileName)) {
    res.sendFile(__dirname + "/js/" + fileName);
  } else {
    res.sendStatus(404)
  }
});

app.post("/logout", urlencodedParser, function (req, res) {
  res.cookie("token", "", { maxAge: 0, httpOnly: true });
  res.redirect("/");
});


app.listen(port, () => {
  console.log("Server started, listening on Port 8080")
  console.log(users)
})