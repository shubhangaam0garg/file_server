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
const multer = require('multer');
const winston = require('./logger');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const logger = winston.logger;

port = 8080;

app.use(cookieParser());
app.set('view engine', 'ejs');



app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + "/public" + "/style.css");

});



app.get('/logo.png', function (req, res) {
  res.sendFile(__dirname + "/" + "logo.png");
});



app.get('/download', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.render('pages/login', {
    title: 'Login : DESIDOC e-Resource Sharing',
    destination: 'download'
  });
  logger.log('info', 'Login accessed by ' + ip);
});

app.get('/upload', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.render('pages/login', {
    title: 'Login : DESIDOC e-Resource Sharing',
    destination: 'upload'
  });
  logger.log('info', 'Login accessed by ' + ip);
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

app.get('/uploadFiles', function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, "uploads", lab);
      let tableData = util.getFilesTableJSON(directoryPath);
      res.render("pages/upload", {
        title: "Upload : DESIDOC e-Resource Sharing",
        user: foundUser,
        successMessage: '',
        files: tableData
      })
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }

});


app.post('/uploadFile', function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      console.log(foundUser);
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, "uploads", lab);
      var storage = multer.diskStorage({
        destination: function (req, file, callback) {
          fs.mkdirSync(directoryPath, { recursive: true })
          callback(null, directoryPath);
        },
        filename: function (req, file, callback) {
          callback(null, file.originalname);
        }
      });
      var upload = multer({ storage: storage }).any('file');
      upload(req, res, function (err) {
        if (err) {
          console.log(err);
          return res.end("Error uploading file." + err);
        }
        let tableData = util.getFilesTableJSON(directoryPath);
        res.render('pages/upload', {
          title: 'Uploads : DESIDOC e-Resource Sharing',
          files: tableData,
          user: foundUser,
          successMessage: "Files Uploaded Successfully"
        });

        logger.log('info', 'File Uploaded by : ' + foundUser.username);
      });
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
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
      let destination = req.body.destination;

      const passwordMatch = await encryptor.compare(submittedPass, storedPass);
      if (passwordMatch) {
        res.cookie("token", foundUser.id, { maxAge: 10000000, httpOnly: true });
        if (destination == 'download') {
          res.redirect('/filesJS')
        }
        if (destination == 'upload') {
          res.redirect('/uploadFiles')
        }
        logger.log('info', 'User : ' + foundUser.username + 'Logged IN')
      } else {
        res.sendFile(__dirname + "/public" + "/invalidLogin.html");
        logger.log('info', 'Invalid Password for : ' + foundUser.username)
      }
    }
    else {

      let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
      await encryptor.compare(req.body.password, fakePass);

      res.sendFile(__dirname + "/public" + "/invalidLogin.html");
      logger.log('info', 'Invalid UserName : ' + req.body.username);
    }
  } catch (err) {
    res.send("Internal server error : " + err);
    logger.log('err', err)
  }
});




app.get("/downloadFile", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let fileName = req.query.file;
      let filePath = path.join(__dirname, 'files', lab, fileName);
      if (util.matchDownlaodFile(filePath)) {
        res.set("Content-Disposition", 'attachment; filename="' + fileName + '"');
        res.sendFile(filePath);
        logger.log('info', 'File : ' + filePath + ' downaloaded by ' + foundUser.username);
      } else {
        res.sendFile(__dirname + "/public" + "/error404.html");
        logger.log('info', 'Invalid File request by ' + foundUser.username);
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
      logger.log('info', 'File table generated for : ' + foundUser.username);
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }


});


app.get("/filesJS", function (req, res) {
  let token = req.cookies.token;
  let directory = req.query.directory;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let rootDirectory = path.join(__dirname, 'files', lab);
      let directories = util.getListedDirecotires(rootDirectory)
      let directoryPath = "";
      if (typeof directory !== 'undefined') {
        directoryPath = path.join(__dirname, 'files', lab, directory);
      } else {
        directoryPath = path.join(__dirname, 'files', lab);
      }
      let tableData = util.getFilesTableJSON(lab, directory);
      res.render('pages/files', {
        title: 'Files : DESIDOC e-Resource Sharing',
        files: tableData,
        user: foundUser,
        directories: directories
      });
      logger.log('info', 'File table generated for : ' + foundUser.username);
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }


});

app.get("/uploadedFiles", function (req, res) {
  let token = req.cookies.token;
  console.log(token);
  if (typeof token !== 'undefined') {
    let foundUser = users.find((data) => parseInt(token) === data.id);
    if (typeof foundUser !== 'undefined') {
      let lab = foundUser.lab;
      let directoryPath = path.join(__dirname, "uploads", lab);
      let tableData = util.getFilesTableJSON(directoryPath);
      res.render('pages/uploadedFiles', {
        title: 'Uploads : DESIDOC e-Resource Sharing',
        files: tableData,
        user: foundUser,
        successMessage: "Files Uploaded Successfully"
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
  let destination = req.body.destination;
  if (destination == 'download') {
    res.redirect('/download')
  }
  if (destination == 'upload') {
    res.redirect('/upload')
  }
});


app.listen(port, () => {
  console.log("Server started, listening on Port 8080")
  console.log(users)
})