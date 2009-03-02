
function openfileperform(){
	if(u_openDocumentDialog.fileName4Open){
		if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
		putMessageWhaitWhileDocumentLoads();
		disableToolbars();
		curProjectName = u_openDocumentDialog.fileName4Open;
		performOpen(u_openDocumentDialog.fileName4Open);
		switchArrow();
	}
}

function deletefileperform(){
	initXMLHttpRequest();
	if (!request) alert("Error initializing XMLHttpRequest!");
	request.open("POST",url,true);
	request.onreadystatechange = processDeleteDocument;
	request.send("<command type=\"delete_document\" filename=\""+u_openDocumentDialog.fileName4Open+"\"/>");  
}

function populateFilesList(){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  document.getElementById("filelist").innerHTML="";
  u_openDocumentDialog.fileName4Open='';
  request.onreadystatechange = processFilesList;
  var req = "<command type=\"list\" >";
  req+="</command>";
  request.send(req);     
  putMessagePopulate();  
}


function processFilesList(){
   if (request.readyState == 4) {
       if (request.status == 200) {
         var response = request.responseText; //<list>fileName|fileName2|filename3</list>
         response = response.substring(6,response.length-7).split("|");
		 for(var i=0;i<(response.length);i++){	 
                   document.getElementById("filelist").innerHTML+='<div class="cursorHand" id="'+response[i]+'iiddii'+'" onclick="selectFileName4Open(\''+response[i]+'\')" onmouseover="if(u_openDocumentDialog.selectedId!=\''+response[i]+'iiddii'+'\')this.style.background=\'#F0F0F0\'" onmouseout="if(u_openDocumentDialog.selectedId!=\''+response[i]+'iiddii'+'\')this.style.background=\'#ffffff\'" align="left">&nbsp;'+response[i]+'</div>';
		 }		 		 
	 removeMessagePopulate();
       } else
         alert("Error: server has returned status: " + request.status);
   }

}

function selectFileName4Open(fileName){
  if(u_openDocumentDialog.fileName4Open)document.getElementById(u_openDocumentDialog.fileName4Open+'iiddii').style.background = '#ffffff';
  u_openDocumentDialog.fileName4Open = fileName;
  document.getElementById(fileName+'iiddii').style.background = '#cccccc';
  u_openDocumentDialog.selectedId = fileName+'iiddii';
}

function processDeleteDocument(){
     if (request.readyState == 4) {
       if (request.status == 200) {
         populateFilesList();
       }
     }
}

function putMessageWhaitWhileDocumentLoads(){
    var div = document.createElement("div");
    var id = document.createAttribute("id");
    id.value="message_whait_while_loads";
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=canvas_x+100+"px";
    div.style.top=canvas_y+100+"px";
    div.style.height="30px";
    div.style.width="200px";
    div.style.background="white";
    div.style.zIndex=10;
    div.cursor="pointer";
    div.innerHTML='<table class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" border="0" width="99%" height="30" align="center">'
    + '<tr><td class="systemGreenFont" align="center">Loading... Please wait.</td></tr>'
    + '</table>';
    
    document.body.appendChild(div);
}

function removeMessageWhaitWhileDocumentLoads(){
   var div = document.getElementById("message_whait_while_loads"); 
   if(div) document.body.removeChild(div);
}

function disableToolbars(){
  document.getElementById("font_pane").style.display="none";
  document.getElementById("control_pane").style.display="none";  
}

function enableToolbars(){
  document.getElementById("font_pane").style.display="block";
  document.getElementById("control_pane").style.display="block";  
}

function putMessagePopulate(){
    var div = document.createElement("div");
    var id = document.createAttribute("id");
    id.value="message_populating";
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=canvas_x+150+"px";
    div.style.top=canvas_y+150+"px";
    div.style.height="30px";
    div.style.width="200px";
    div.style.background="white";
    div.style.zIndex=10;
    div.cursor="pointer";
    div.innerHTML='<table class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" border="0" width="99%" height="30" align="center">'
    + '<tr><td class="systemGreenFont" align="center">Populating file list.</td></tr>'
    + '</table>';
    
    document.body.appendChild(div);
}

function removeMessagePopulate(){
   var div = document.getElementById("message_populating"); 
   if(div) document.body.removeChild(div);
}
