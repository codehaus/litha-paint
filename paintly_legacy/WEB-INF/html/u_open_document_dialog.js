var u_openDocumentDialog;

function u_OpenDocumentDialog(){
   this.nextHandlersSet=-1;
   this.fileName4Open;
   this.selectedId;

   this.show = function(x,y){
   mgn.closeAllWindows();
 
  var splash = document.getElementById("splash");
  if(splash)document.body.removeChild(splash);

    var div=document.createElement("div");
    var id = document.createAttribute("id");
    id.value="u_open_document_div";
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=x+"px";
    div.style.top=y+"px";
    div.style.height="250px";
    div.style.width="400px";
    div.style.background="white";
    div.style.zIndex=5;
    div.cursor="pointer";

	 var u_import = '<fieldset style="margin:3"><legend>Import File (open litha document from your computer)</legend>'
				   + '<form action="upload" method="post" target="hidden_frame" enctype="multipart/form-data" >'
				   + '<table bgcolor="white" cellspacing="0" cellpadding="0" border="0" height="20px" width="99%" align="center">'
				   + '<tr><td align="center" valign="middle">'
				   + '<input class="systemGreenFont" style="margin:10" type="file" name="uploadfile" size="30"/></td>'
				   + '<td align="center" valign="middle">'
				   + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/upload.gif)" type="button" id="popupApply" name="open" value="" style="margin-top:1px" onclick="submit();u_open_doc_form_cancel()">'
				   + '</td></tr></table></form></fieldset>';


	var u_open = '<fieldset style="margin:3"><legend>Open File (open litha document from the server)</legend>'
				  + '<table border="0" bgcolor="white" cellspacing="0" cellpadding="0" width="99%" height="200" align="center">'
				  + '<tr><td align="center" valign="top">'
				  + '<div id="filelist" style="border:solid 1px #25820A;margin:5;position: relative; width: 240px; height: 200px; overflow-x: scroll; overflow-y: scroll;background-color:#ffffff;" class="systemGreenFont"></div>'
				  + '</td>'
				  + '<td style="padding:10" align="center" valign="top">'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/open.gif)" type="button" id="popupApply" name="open" value="" style="margin-top:1px" onclick="openfileperform()"><br>'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/download.gif)" type="button" id="popupApply" name="download" value="" style="margin-top:1px" onclick="downloadfileperform()"><br>'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/delete.gif)" type="button" id="popupApply" name="delete" value="" style="margin-top:1px" onclick="deletefileperform()">'
				  + '</td>'
				  + '</tr></table></fieldset>';

	div.innerHTML = '<table border="0" class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" width="99%" height="250" align="center">'
				  + '<tr><td align="left" class="systemGreenFont" style="padding:5" height="20">&nbsp;</td>'
				  + '<td align="right" style="padding:5">'
				  + '<img id="popupHeaderClose" src="./img/pickers/close.gif" onclick="u_open_doc_form_cancel()"></td></tr>'
				  + '<tr><td align="left"  style="padding:5" valign="top" colspan="2">'+u_import+'</td></tr>'
				  + '<tr><td align="left"  style="padding:5" valign="top" colspan="2">'+u_open+'</td></tr></table>';


    document.body.appendChild(div);
    populateFilesList();
    if(document.releaseCapture)document.releaseCapture();

    this.nextHandlersSet = curEventHandler;
    setHandlersSet(34);
  }

}

function u_performOpenDocument(){
	u_openDocumentDialog = new u_OpenDocumentDialog();
	u_openDocumentDialog.show(100,100);
}

function u_open_doc_form_cancel(){
	if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
	setHandlersSet(u_openDocumentDialog.nextHandlersSet);

	removeMessageWhaitWhileDocumentLoads();
	removeMessagePopulate();

	var u_openFileDialog = document.getElementById("u_open_document_div");
	if(u_openFileDialog){
		document.body.removeChild(u_openFileDialog);
		u_openDocumentDialog='';
	}    
}

function processOnKeyDownOpenFile(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode ==27){
    u_open_doc_form_cancel();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  return true;
}

function deletefileperform(){
	initXMLHttpRequest();
	if (!request) alert("Error initializing XMLHttpRequest!");
	request.open("POST",url,true);
	request.onreadystatechange = processDeleteDocument;
	request.send("<command type=\"delete_document\" filename=\""+u_openDocumentDialog.fileName4Open+"\"/>");  
}
