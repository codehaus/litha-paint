function publishfileperform(){
	var fileName = document.getElementById("publishfilename").value;
	var fileType = document.getElementById("publishfiletype").value;
	if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
	if(ifFileNameValid(fileName)){
		performPublish(fileName, fileType);
	}else{
		alert("Only alphanumeric characters and \"_\", \"-\", \"!\", \".\" are allowed in the file name");
	}
}


function populatePublishFilesList(){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  document.getElementById("publicationslist").innerHTML="";
  u_saveDocumentDialog.fileName4Publish='';
  request.onreadystatechange = processPublishFilesList;
  var req = "<command type=\"list_published_documents\" ></command>";
  putMessagePopulate();
  request.send(req);     
}

function processPublishFilesList(){
   if (request.readyState == 4) {
       if (request.status == 200) {
         var response = request.responseText;
         //<list>fileName^[pub,unpub]^url|fileName2^[pub,unpub]^url|filename3^[pub,unpub]^url</list>
         
         response = response.substring(6,response.length-7).split("|");
		 for(var i=0;i<(response.length);i++){	 
                   var individualItems = response[i].split("^");
                   var imgPublish = ((individualItems[1]=="pub")?('yes.gif'):((individualItems[1]=="unpub")?('no.gif'):('')));
				   var imgSrcPublish = '<img style="margin-left:5;margin-top:2" valign="middle"'
				   + 'onclick="selectFileName4Publish(\''+individualItems[0]+'\',\''+individualItems[2]+'\',\''+individualItems[1] +'\');publishfilereunpublish()" src="img/pickers/' + imgPublish + '" /> ';
				   if(imgPublish == '') imgSrcPublish = '';

                   document.getElementById("publicationslist").innerHTML+='<div class="cursorHand" id="'+individualItems[0]+'iiddii'
					   + '" onclick="selectFileName4Publish(\''+individualItems[0]+'\',\''+individualItems[2]+'\',\''+individualItems[1] +'\')" '
					   + 'onmouseover="if(u_saveDocumentDialog.selectedId!=\''+individualItems[0]+'iiddii'+'\')this.style.background=\'#eeeeee\'" '
					   + 'onmouseout="if(u_saveDocumentDialog.selectedId!=\''+individualItems[0]+'iiddii'+'\')this.style.background=\'#FFFFFF\'"'
					   + 'align="left" valign="middle"> ' + imgSrcPublish + individualItems[0]+'</div>';
		 }		 		 
         removeMessagePopulate();
       } else alert("Error: server has returned status: " + request.status);
   }

}

function selectFileName4Publish(fileName,fileUrl,pubStatus){
  if(u_saveDocumentDialog.fileName4Publish)
	document.getElementById(u_saveDocumentDialog.fileName4Publish+'iiddii').style.background = '#FFFFFF';

  u_saveDocumentDialog.fileName4Publish = fileName;
  document.getElementById(fileName+'iiddii').style.background = '#cccccc';
  u_saveDocumentDialog.selectedId = fileName+'iiddii';
  u_saveDocumentDialog.selectedPuStatus = pubStatus;
  document.getElementById("publishfilename").value=fileName.substring(0, fileName.lastIndexOf('.'));
  document.getElementById("published_url").value=fileUrl;
  document.getElementById("published_url").title=fileUrl;

  publishLink = document.getElementById("published_url_link");
  if(fileUrl == ''){
	  publishLink.style.visibility = 'hidden';
  }else{
	  publishLink.style.visibility = 'visible';
	  publishLink.href = fileUrl;
  }

  var fileExtension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length);
  var fileType = document.getElementById("publishfiletype");

  if(fileExtension != fileType.value){
	  for(var i = 0;i < fileType.length; i++){
		  if(fileType.options[i].value == fileExtension){
			  fileType.selectedIndex = i;
			  break;
		  }
	  }	  
  }

  var btnPublishUnPublish = document.getElementById("btnPubUnpub");
  if(pubStatus == 'pub'){
	btnPublishUnPublish.style.backgroundImage = 'url(img/pickers/unpublish.gif)';
  }else{
	btnPublishUnPublish.style.backgroundImage = 'url(img/pickers/publish.gif)';
  }
}

function publishfiledelete(){
	if(u_saveDocumentDialog.fileName4Publish){
		initXMLHttpRequest();
		if (!request) alert("Error initializing XMLHttpRequest!");
		request.open("POST",url,true);
		request.onreadystatechange = processDeleteDocumentPublish;
		request.send("<command type=\"delete_published_document\" filename=\""+u_saveDocumentDialog.fileName4Publish+"\"/>");  
	}
}

function processDeleteDocumentPublish(){
     if (request.readyState == 4) {
       if (request.status == 200) {
         populatePublishFilesList();
         document.getElementById("published_url").value="";
       }
     }
}

function performPublish(fileName, fileType){ 
  var u_saveDialog = document.getElementById("u_save_document_div");
  if(u_saveDialog) document.body.removeChild(u_saveDialog);
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  request.onreadystatechange = processDocumentPublish;
  var req = "<command type=\"publish_document\" filename=\""+fileName+"\" filetype=\""+fileType+"\" />";
  request.send(req);
  switchArrow();
  curProjectName = fileName;
}

function publishfilereunpublish(){
    initXMLHttpRequest();
    if (!request) alert("Error initializing XMLHttpRequest!");
    request.open("POST",url,true);
    request.onreadystatechange = processDeleteDocumentPublish;
    if(u_saveDocumentDialog.selectedPuStatus=='pub'){
      request.send("<command type=\"unpublish_document\" filename=\""+u_saveDocumentDialog.fileName4Publish+"\"/>");  
    }else{
      request.send("<command type=\"republish_document\" filename=\""+u_saveDocumentDialog.fileName4Publish+"\"/>");  
    }
}

function processDocumentPublish(){
     if (request.readyState == 4) {
       if (request.status == 200) {
         var url = "";
         if(request.responseText.length>=13){
			url = request.responseText.substring(6,request.responseText.length-7);
		 }
		 if (parent.lpcbAfterPublish) parent.lpcbAfterPublish(url);
		 
       }
     }
}

