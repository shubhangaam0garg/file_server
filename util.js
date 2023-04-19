const fs = require('fs');
const path = require('path');

function matchImageFile(filename) {
    let filePath = __dirname + "/images/" + filename;
    return fs.existsSync(filePath);

}

function matchJSFile(filename) {
    let filePath = __dirname + "/js/" + filename;
    return fs.existsSync(filePath);

}

function getFilesInDirectory(directoryPath) {
    let files = fs.readdirSync(directoryPath, { withFileTypes: true }).filter(dirent => !dirent.isDirectory()) .map(dirent => dirent.name);
    return files;
}

function getDirecotiresInDirectory(directoryPath) {
    let directories = fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    return directories;
}

function getFilesTable(directoryPath) {
    let files = getFilesInDirectory(directoryPath);
    let tableData = '';
    files.forEach(file => {
        let fileType = getExtension(file);
        let fileSize = getFileSize(directoryPath, file);
        let lastModified = getFileLastModifiedDate(directoryPath, file);
        let downlaodUrl = getDownloadUrl(file)
        tableData = tableData + '<tr>' + '<td>' + '<a href="' + downlaodUrl + '">' + file + '</a></td>' + '<td>' + fileType + '</td>' + '<td>' + fileSize + '</td>' + '<td>' + lastModified + '</td>' + '</tr>';
    });
    return tableData;
}

function getFileSize(directoryPath, file) {
    const stats = fs.statSync(directoryPath + "/" + file);
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes <= (1023)) {
        return Math.round(fileSizeInBytes) + 'B';
    } else {

        if (fileSizeInBytes < (1024 * 1024)) {
            const fileSizeInKilobytes = fileSizeInBytes / (1024);
            return Math.round(fileSizeInKilobytes) + 'KB';
        } else {
            const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            return Math.round(fileSizeInMegabytes) + 'MB';
        }

    }
}

function getFileLastModifiedDate(directoryPath, file) {
    const stats = fs.statSync(directoryPath + "/" + file);
    const date = stats.mtime;
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    return `${year}/${month}/${day} ${hour}:${minute}:${second} `
    
}

function getExtension(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1].toUpperCase();
}

function getDownloadUrl(file, subDirectory) {
    const baseUrl = "/downloadFile?";
    let url = '';
    if(typeof subDirectory !== 'undefined'){
        url = baseUrl + 'directory=' + subDirectory+ '&file='+file;
    }else{
        url = baseUrl + 'file=' + file;
    }
  
    return url;
}

function matchDownlaodFile(filePath) {
    console.log(fs.existsSync(filePath))
    return fs.existsSync(filePath);

}

function getFilesTableJSON(rootDirectory, subDirectory) {
    let directoryPath = '';
    if(typeof subDirectory !== 'undefined'){
        directoryPath = path.join(__dirname,'files',rootDirectory,subDirectory);
    }else{
        directoryPath = path.join(__dirname,'files',rootDirectory);
    }
    let files = getFilesInDirectory(directoryPath);
    let tableData = '';
    let filesJSON = [];

    files.forEach(file => {
        let fileType = getExtension(file);
        let fileSize = getFileSize(directoryPath, file);
        let lastModified = getFileLastModifiedDate(directoryPath, file);
        let downlaodUrl = getDownloadUrl(file,subDirectory)
        filesJSON.push({
            'fileName' : file,
            'fileURL' : downlaodUrl,
            'fileSize' : fileSize,
            'fileTimeStamp' : lastModified,
            'fileType' : fileType
        })

    });
    return filesJSON;
}

function getListedDirecotires(directoryPath){
    let directories = getDirecotiresInDirectory(directoryPath)
    let directoriesJSON = [];
    directories.forEach(directory =>{
        let url = "/filesJS?directory="+directory;
        let name = directory;
        directoriesJSON.push({
            'url':url,
            'name':name
        })
    })
    return directoriesJSON
}

module.exports = { matchImageFile, getFilesTable, matchDownlaodFile, getFilesTableJSON, matchJSFile, getListedDirecotires }
