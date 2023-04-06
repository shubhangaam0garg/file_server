var browse = document.getElementById('upload');
var selectDialog = document.createElement("INPUT");
selectDialog.setAttribute("type", "file");
selectDialog.setAttribute("multiple", "true");
selectDialog.style.display = "none";
var progressUpload = document.getElementsByClassName("progressUpload")[0];
var progress;
addProgressBar();
browse.addEventListener("click", function(){    
    selectDialog.click();
      
});
  
selectDialog.addEventListener("change", function(){
      
    sendFiles(selectDialog.files);
  
});
  
function sendFiles(files){
      
    resetProgressBar();
    var req = new XMLHttpRequest();       
    req.upload.addEventListener("progress", updateProgress);
    req.open("POST", "/uploadFile");
    var form = new FormData();
    for(var file = 0; file < files.length; file++){         
          
        form.append("file" + file, files[file], files[file].name);
          
    } 
    req.send(form);  
}
function updateProgress(e){   
      
    progress.style.width = (((e.loaded/e.total)*100))+ "%";
  
}
function resetProgressBar(){
    progress.style.width = "0%";
}
function addProgressBar(){
    var progressBar = document.createElement("div");
    progressBar.className = "progressBar";
    document.onload = function() {
        document.getElementsByClassName('widget-contents') [0].style.height = '640px';
      }
    var innerDIV = document.createElement("div");
    innerDIV.className = "progress";
    progressBar.appendChild(innerDIV);
    progress = document.getElementsByClassName("progress")[0];
}