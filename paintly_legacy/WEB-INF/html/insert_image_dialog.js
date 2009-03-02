insertImageDialog = 0;

function InsertImageDialog(){
   this.nextHandlersSet=-1;

   this.show = function(x,y){
	mgn.closeAllWindows();
    if(canvas.style.display=="block"){
     var div=document.createElement("div");
     var id = document.createAttribute("id");
     id.value="insert_image_div";
     div.setAttributeNode(id);
     div.style.position="absolute";
     div.style.left=x+"px";
     div.style.top=y+"px";
     div.style.height="250px";
     div.style.width="300px";
     div.style.background="white";
     div.style.valign="middle";
     div.style.zIndex=5;
     div.cursor="pointer";
     if(document.releaseCapture)document.releaseCapture();

	 div.innerHTML = '<form id="insert_image" action="insert_image" method="post" target="hidden_frame" enctype="multipart/form-data" >'
				   + '<table class="systemColor" style="border-width:1;border-color:#25820A" bgcolor="white" cellspacing="0" cellpadding="0" border="0" height="250px" width="99%" align="center">'
				   + '<tr><td align="left" class="systemGreenFont" style="padding:3" height="10">Insert Image</td>'
				   + '<td width="5%" align="right"  style="padding:5">'
				   + '<img id="popupHeaderClose" src="./img/pickers/close.gif" onclick="insert_img_form_cancel()">'
				   + '</td></tr>'
				   + '<tr><td style="padding-top:20" valign="top">'
				   + '<table width="90%" align="center" class="systemGreenFont"><tr>'
				   + '<td style="padding-top:13" width="15%"><input name="uploadRadio" value="UploadFromFile" id="uploadFileRadio" CHECKED type="radio" onclick="importSourceMgn()"/></td>'
				   + '<td>Import from file<br>'
				   + '<input class="systemGreenFont" type="file" name="imgname" id="imgname" size="20"/></td>'
				   + '</tr></table>'
				   + '<input type="hidden" name="curid" id="curid">'
				   + '<input type="hidden" name="from_url" id="from_url" value="false">'
				   + '</td></tr>'
				   + '<tr><td>'
				   + '<table width="90%" align="center" class="systemGreenFont"><tr>'				   
				   + '<td style="padding-top:13" width="15%"><input name="uploadRadio" value="UploadFromUrl" id="uploadUrlRadio" type="radio" onclick="importSourceMgn()"/></td>'
				   + '<td>Import from URL<br>'
				   + '<input class="systemGreenFont" stype="text" name="url_imgname" id="url_imgname" maxsize="28" size="28"/></td>'
				   + '</tr></table>'				   
				   + '</td></tr>'
				   + '<tr><td height="90" align="center" valign="top" >'
				   + '<input  style="margin:10;width:66px;height:19;border-width:0;background-image:url(img/pickers/upload.gif)" type="button" id="popupApply" name="open" value="" style="margin-top:1px" onclick="setImageUploadParam()">'
				   + '</td></tr>'
				   + '</table></form>';

     document.body.appendChild(div);
     this.nextHandlersSet = curEventHandler;
     document.getElementsByName("curid")[0].value = curFigureId;
     idd=curFigureId;
     setHandlersSet(44);
     importSourceMgn();
    }
  }

}

function importSourceMgn(){
	var radioUrl = document.getElementById('uploadUrlRadio');
	var radioFile = document.getElementById('uploadFileRadio');	
	
	var resourceFile = document.getElementById('imgname');
	var resourceUrl = document.getElementById('url_imgname');
	var resourceFromUrl = document.getElementById('from_url');
	
	resourceFile.disabled = !radioFile.checked;
	resourceUrl.disabled = !radioUrl.checked;
	resourceFromUrl.value = radioUrl.checked;
	
	
	if(radioUrl.checked){
		resourceFile.value = '';
	}
	if(radioFile.checked){
		resourceUrl.value = '';
	}
	
}

  function closeInsertDiv(){
    var insert_div = document.getElementById("insert_image_div");   
    document.body.removeChild(insert_div);
    setHandlersSet(insertImageDialog.nextHandlersSet);
  }

function performInsertImage(){
  insertImageDialog = new InsertImageDialog();
  insertImageDialog.show(100,100);
}

function insert_img_form_cancel(){
	if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
	setHandlersSet(insertImageDialog.nextHandlersSet);
	var insertPicDialog = document.getElementById("insert_image_div");
	if(insertPicDialog){
	  document.body.removeChild(insertPicDialog);
	  insertPicDialog='';
	}    
}

function setImageUploadParam(){

	var isUrl	= document.getElementById("from_url");
	var url		= document.getElementById("url_imgname");
	var file	= document.getElementById("imgname");
	var curid	= document.getElementById("curid");
	
	if(thisForm = document.getElementById("insert_image")){	
		if(isUrl && isUrl.value == 'true') {
			if(url != null && url.value != ''){
				curid.value = curFigureId;			
				thisForm.submit();
				closeInsertDiv();
				curFigureId++;
				switchArrow();
			}//if
		} else {
			if(file && file.value != ''){
				curid.value = curFigureId;
				thisForm.submit();
				closeInsertDiv();
				curFigureId++;
				switchArrow();				
			}//if		
		}//if
	}//if
}

function urlValidation(url){
/*
	var baseUrlSignatureS = 'http://';
	var urlRegxp = /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/;

	if(url.length > baseUrlSignatureS.length && urlRegxp.test(url) == true){
		return true;
	}
*/	
	return true;
}

function processOnKeyDownInsertImage(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==13){
    performInsertImage();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  if(keyCode == 27){
    closeInsertDiv();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  return true;

}
