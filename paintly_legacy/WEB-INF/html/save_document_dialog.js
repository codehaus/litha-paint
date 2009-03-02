function savefileperform(){
	if(document.getElementById("savefilename")!=null){
	//this check is neccessary due to opera calls this method twice: one by click OK, and second by #13.
		var fileName = document.getElementById("savefilename").value;
		if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
		if(fileName != null && ifFileNameValid(fileName)){
			performSave(fileName);
			//setHandlersSet(u_saveDocumentDialog.nextHandlersSet); doesn't works because previous event handler may be the one who just highlights focused shape.			
		}else{
			alert("Only alphanumeric characters and \"_\", \"-\", \"!\", \".\" are allowed in the file name");
		}
	}
	//populateSaveFilesList();
	u_savefilecancel();
}

function performSaveDocument(){
  if(curProjectName=="document"){
    performSaveDocumentAs();
  }else{
      performSave(curProjectName);
  }  
}

function populateSaveFilesList(){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  document.getElementById("filelist").innerHTML="";
  u_saveDocumentDialog.fileName4Save='';
  request.onreadystatechange = processSaveFilesList;
  var req = '<command type="list"></command>';
  putMessagePopulate();
  request.send(req);     
}

function processSaveFilesList(){
   if (request.readyState == 4) {
       if (request.status == 200) {
         var response = request.responseText; //<list>fileName|fileName2|filename3</list>
         response = response.substring(6,response.length-7).split("|");
		 for(var i=0;i<(response.length);i++){	 
			document.getElementById("filelist").innerHTML+='<div class="cursorHand" id="'+response[i]+'iiddii'+'"'
			+ 'onclick="selectFileName4Save(\''+response[i]+'\')"'
			+ 'onmouseover="if(u_saveDocumentDialog.selectedId!=\''+response[i]+'iiddii\') this.style.background=\'#F0F0F0\'"'
			+ 'onmouseout="if(u_saveDocumentDialog.selectedId!=\''+response[i]+'iiddii\')this.style.background=\'#FFFFFF\'"'
			+ 'align="left">&nbsp;'+response[i]+'</div>';
		 }
         removeMessagePopulate();
       } else alert("Error: server has returned status: " + request.status);
   }

}

function selectFileName4Save(fileName){
  if(u_saveDocumentDialog.fileName4Save)
	document.getElementById(u_saveDocumentDialog.fileName4Save+'iiddii').style.background = '#FFFFFF';
	
  u_saveDocumentDialog.fileName4Save = fileName;
  document.getElementById(fileName+'iiddii').style.background = '#cccccc';
  u_saveDocumentDialog.selectedId = fileName+'iiddii';
  document.getElementById("savefilename").value=fileName;
}

function savefiledelete(){
	if(u_saveDocumentDialog.fileName4Save){
		initXMLHttpRequest();
		if (!request) alert("Error initializing XMLHttpRequest!");
		request.open("POST",url,true);
		request.onreadystatechange = processDeleteDocumentSave;
		request.send('<command type="delete_document" filename="'+u_saveDocumentDialog.fileName4Save+'"/>');  
	}
}

function processDeleteDocumentSave(){
	if (request.readyState == 4) {
		if (request.status == 200) {
			populateSaveFilesList();
		}
	}
}