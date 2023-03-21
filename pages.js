const filesPageHeader = '<!doctype html>'+
'<html>'+
'<head><meta charset="UTF-8"><link rel="icon" type="image/x-icon" href="/images/logo.ico"> <title>Files : DESIDOC File Server</title>'+
'<link rel="stylesheet" href="./style.css"></head>'+
'<body> <div id="container"> <div id="image"><img src="/logo.png" alt="DRDO Logo" width="100" height="100"></div>'+
'<h2>DESIDOC File server</h2><form id="login-form" action="/logout" method="post"> <input  type="submit" id="logout" value="Logout"></form>';

const filePageFooter = '</body></html>';

const fileTableHeader = '<table class="sortable"> <thead>'+
'<tr><th>Filename</th><th>Type</th><th>Size</th><th>Date Modified</th></tr></thead>';

const tableBodyHeader = '<tbody>';

const tableBodyFooter = '</tbody>';

const fileTableFooter = '</table>';


module.exports = {fileTableHeader, filePageFooter, filesPageHeader, tableBodyFooter, tableBodyHeader, fileTableFooter}