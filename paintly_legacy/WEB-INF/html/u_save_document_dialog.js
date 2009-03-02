var u_saveDocumentDialog;
var u_saveTitle		= 'Save/Export';
var u_publishTitle	= 'Publish to WEB';

var u_saveFileList;
var u_publishFileList;


function u_SaveDocumentDialog(){
   this.nextHandlersSet=-1;
   this.selectedId = curProjectName+"iiddii";
   this.selectedPuStatus;
   this.fileName4Save = '';

   this.show = function(x,y){
   u_publishFileList = 0;
   mgn.closeAllWindows();
   this.fileName4Publish;

    if(canvas.style.display=="block"){
     var div=document.createElement("div");
     var id = document.createAttribute("id");
     id.value="u_save_document_div";
     div.setAttributeNode(id);
     div.style.position="absolute";
     div.style.left=x+"px";
     div.style.top=y+"px";
     div.style.height="370px";
     div.style.width="400px";
     div.style.background="#FFFFFF";
     div.style.zIndex=5;
     div.cursor="pointer";
     if(document.releaseCapture)document.releaseCapture();
     
     export_HTML  = '<fieldset style="margin:3"><legend>Export document (save to your computer)</legend>'
                  + '<table border="0" width="95%" align="center"><tr>'
				  + '<td align="center" style="margin:5" valign="middle">'
				  + '<input class="systemGreenFont" size="27" maxlength="27" type="text" id="exportfilename" value="'+curProjectName+'"/>'
				  + '<select class="systemGreenFont" id="exportfiletype">'
				  + '<option value="png">PNG</option>'
				  + '<option value="svg">SVG</option>'
				  + '<option value="jpg">JPEG</option>'
				  + '<option value="tif">TIFF</option></select>'
				  + '</td>'
				  + '<td style="margin:5" align="center" valign="middle">'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/export.gif)" type="button" id="popupApply" name="open" value="" style="margin-top:1px" onclick="exportfileperform()">'
				  + '</td></tr></table></fieldset><br>';
				  
	save_HTML     = '<fieldset style="margin:3"><legend>Save document (save to the server)</legend>'
				   + '<table border="0" width="95%" align="center"><tr>'
	               + '<td align="center" style="margin:2">'
				   + '<input class="systemGreenFont" type="text" size="37" maxlength="27" id="savefilename" value="'+curProjectName+'"/>'
				   + '</td>'
				   + '<td rowspan="2" style="padding:2" align="center" valign="top">'
				   + '<input id="popupApply" style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/save.gif)" type="button" name="save" value="" onclick="savefileperform()"><br>'
				   + '<input id="popupApply" style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/delete.gif)" type="button"  name="delete" value="" onclick="savefiledelete()">'
				   + '</td></tr>'
				   + '<tr><td align="center" style="margin:5" valign="top">'
				   + '<div class="systemGreenFont" id="filelist" style="border:solid 1px #25820A;background-color:#FFFFFF;position:relative;width:240px;height:170px;overflow-x:scroll;overflow-y:scroll;"></div>'
				   + '</td></tr></table></fieldset>';

	publish_HTML  = '<fieldset style="margin:3"><legend>Publish document</legend>'
				  + '<table border="0" width="95%" align="center"><tr><td align="center" style="margin:5">'
				  + '<input class="systemGreenFont" size="29" maxlength="27" type="text" id="publishfilename" value="'+curProjectName+'"/>'
				  + '<select class="systemGreenFont" id="publishfiletype">'
				  + '<option value="png">PNG</option>'
				  + '<option value="svg">SVG</option>'
				  + '<option value="jpg">JPEG</option>'
				  + '<option value="tif">TIFF</option></select>'
				  + '</td>'
				  + '<td rowspan="2" style="padding:2" align="center" valign="top">'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/publish.gif)" type="button" id="popupApply" name="publish" value="" style="margin-top:1px" onclick="publishfileperform()"><br>'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/delete.gif)" type="button" id="popupApply" name="delete" value="" style="margin-top:1px" onclick="publishfiledelete()"><br>'
				  + '<input  id="btnPubUnpub" style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/unpublish.gif)" type="button" id="popupApply" name="unpublish" value="" style="margin-top:1px" onclick="publishfilereunpublish()">'
				  + '</td></tr>'
				  + '<tr><td align="center" style="margin:5">'
				  + '<div id="publicationslist" style="border:solid 1px #25820A;background-color:#FFFFFF;position:relative;width:240px;height:210px;overflow-x:scroll;overflow-y:scroll;" class="systemGreenFont"></div>'
				  + '</td></tr>'
				  + '<tr><td colspan="2" align="center" valign="middle">'
				  + '<textarea class="systemGreenFont" style="width:300px" WRAP="ON" id="published_url"></textarea> <a href="" id="published_url_link" class="systemGreenFont" style="visibility:hidden" target="_blank">view</a>'
				  + '</td></tr></table></fieldset>'; 


	div.innerHTML = '<!--form-->'
				  + '<table border="0" class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" width="99%" height="250" align="center">'
				  + '<tr><td align="left" class="systemGreenFont" style="padding:5" height="20">'
				  + '<!--Export document-->'
				  + '</td>'
				  + '<td align="right" style="padding:5">'
				  + '<img id="popupHeaderClose" src="./img/pickers/close.gif" onclick="u_savefilecancel()"></td></tr>'
				  + '<tr><td align="left"  valign="top" colspan="2">'
				  + '<div class="tabber" id="u_save_tabber">'
				  + '<div class="tabbertab">'
				  + '<h2>'+u_saveTitle+'</h2>'
				  + '<p>'+export_HTML+save_HTML+'</p>'
				  + '</div><div class="tabbertab">'
				  + '<h2>'+u_publishTitle+'</h2>'
				  + '<p>'+publish_HTML+'</p>'
				  + '</div>'
				  + '</div>'				  
				  + '</td>'
				  + '<td style="margin:5" align="center" valign="middle"></td></tr></table><!--/form-->';

     document.body.appendChild(div);    
     document.getElementById("exportfilename").focus();
     this.nextHandlersSet = curEventHandler;
     populateSaveFilesList();
     tabberAutomatic(tabberOptions);
     setHandlersSet(42);
    }
  }
}

function u_savefilecancel(){
	var u_saveFileDialog = document.getElementById("u_save_document_div");
	if(u_saveFileDialog) document.body.removeChild(u_saveFileDialog);
	if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
	removeMessagePopulate();
	setHandlersSet(u_saveDocumentDialog.nextHandlersSet);
}

function u_performSaveDocument(){
	u_saveDocumentDialog = new u_SaveDocumentDialog();
	u_saveDocumentDialog.show(100,100);
}


function processOnKeyDownExportFile(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==27){
    u_savefilecancel();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;    
  }
  return true;
}