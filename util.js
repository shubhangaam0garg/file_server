const fs = require('fs');
const path = require('path');

function matchImageFile(filename) {
    let filePath = __dirname + "/images/" + filename;
    return fs.existsSync(filePath);

}

function getFilesInDirectory(directoryPath) {
    let files = fs.readdirSync(directoryPath);
    return files;
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
    return date;
}

function getExtension(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1].toUpperCase();
}

function getDownloadUrl(file) {
    const baseUrl = "/download?";
    let url = baseUrl + 'file=' + file;
    return url;
}

function matchDownlaodFile(filePath) {
    console.log(fs.existsSync(filePath))
    return fs.existsSync(filePath);

}

module.exports = { matchImageFile, getFilesTable, matchDownlaodFile }
