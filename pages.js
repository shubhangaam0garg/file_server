const filesPageHeader = '<!doctype html>'+
'<html>'+
'<head><meta charset="UTF-8"><link rel="icon" type="image/x-icon" href="/images/logo.ico"> <title>Files : DESIDOC e-Resource Sharing</title>'+
'<link rel="stylesheet" href="./style.css">'+
'<script src="/js/jquery-3.5.1.js"></script>'+
'<script src="/js/bootstrap.bundle.min.js"></script>'+
'<script src="/js/jquery.dataTables.min.js"></script>'+
'<script type="text/javascript" language="javascript" class="sortable">$(document).ready(function () {'+
'console.log("INTO SCRIPT")'+
  "$('#filesTable').DataTable();"+
  "$('.dataTables_length').addClass('bs-select');"+
"});</script>"+
'</head><body><script type="text/javascript" language="javascript" class="sortable">$(document).ready(function () {'+
'console.log("INTO SCRIPT")'+
  "$('#filesTable').DataTable();"+
  "$('.dataTables_length').addClass('bs-select');"+
'});</script> <div id="container"> <div id="image"><img src="/logo.png" alt="DRDO Logo" width="100" height="100"></div>'+
'<h2>DESIDOC e-Resource Sharing</h2><form id="login-form" action="/logout" method="post"> <input  type="submit" id="logout" value="Logout"></form>';

const filePageFooter = '</body></html>';

const fileTableHeader = '<table id= "filesTable" class="sortable"> <thead>'+
'<tr><th>Filename</th><th>Type</th><th>Size</th><th>Date Modified</th></tr></thead>';

const tableBodyHeader = '<tbody>';

const tableBodyFooter = '</tbody>';

const fileTableFooter = '</table>';


module.exports = {fileTableHeader, filePageFooter, filesPageHeader, tableBodyFooter, tableBodyHeader, fileTableFooter}