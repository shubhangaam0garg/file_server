const fs = require('fs');
const path = require('path');

function matchImageFile(filename){
    let filePath = __dirname + "/images/"+filename;
    return fs.existsSync(filePath);    

}

module.exports = {matchImageFile}
