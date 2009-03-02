var newDocumentDialog;
function NewDocumentDialog(){
  this.nextEventHandler = 0;

  this.show = function(x,y){
	mgn.closeAllWindows();
    var div=document.createElement("div");
    var id = document.createAttribute("id");
    id.value="new_document_div";
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=x+"px";
    div.style.top=y+"px";
    div.style.height="250px";
    div.style.width="300px";
    div.style.background="#FFFFFF";
    div.style.zIndex=5;
    div.cursor="pointer";
	
	div.innerHTML = '<table border="0" class="systemColor" style="padding:0;border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" height="250" width="99%" align="center">'
				  + '<tr><td align="left" class="systemGreenFont" style="padding:5;" height="20">New document</td>'
				  + '<td  width="8%" align="right" style="padding:5">'
				  + '<img id="popupHeaderClose" src="./img/pickers/close.gif" onclick="document_form_cancel()"></td></tr>'
				  + '<tr><td align="center" style="margin:10">'
				  + '<table cellspacing="0" cellpadding="0" border="0" width="50%" align="center" class="systemGreenFont">'
				  + '<tr><td width="50%" align="right">Width:&nbsp;</td>'
				  + '<td><input type="text" id="document_width" class="systemGreenFont" style="width:50px;" maxlength="5"/>'
				  + '</td></tr>'
				  + '<tr><td width="50%" align="right">Height:&nbsp;</td>'
				  + '<td><input type="text" id="document_height" class="systemGreenFont" style="width: 50px;" maxlength="5"/></td>'
				  + '</tr></table>'
				  + '</td>'
				  + '<td align="center" valign="middle" style="margin:10">'
				  + '<input style="margin:10;width:66px;height:19;border-width:0;background-image:url(img/pickers/apply.gif)" type="button" id="popupApply" name="insert" value="" style="margin-top:1px" onclick="new_document_form_submit()">'
				  + '</td>'
				  + '</tr></table>';

    document.body.appendChild(div);
    if(document.releaseCapture)document.releaseCapture();
    document.getElementById("document_height").focus();
    document.getElementById("document_width").focus();
    //alert(document.getElementById("document_width"));
    this.nextEventHandler = curEventHandler;
    setHandlersSet(33);
  }
}


function new_document_form_submit(){             
       var document_width = document.getElementById("document_width").value;
       var document_height = document.getElementById("document_height").value;
       
       if(isNaN(parseInt(document_width))){alert("Width of the document should be integer value");return;}
       if(isNaN(parseInt(document_height))){alert("Height of the document should be integer value");return;}
       if(parseInt(document_width)>2000){alert("Width of the document should not be greater then 2000 pixels");return;}
       if(parseInt(document_height)>2000){alert("Height of the document should not be greater then 2000 pixels");return;}

       sendObjectWithoutDisplay(new Array(document_width,document_height),"new_document");
       projectWidth = parseInt(document_width);
       projectHeight = parseInt(document_height);
       var div = document.getElementById("new_document_div");
       document.body.removeChild(div);
       clearWorkSpace();
       clearr();
       focusedBez = new Array();
       mousee = new Array();
       reflected = new Array();
       scrapCountX = Math.ceil(parseInt(document_width)/parseInt(scrapWidth));
       scrapCountY = Math.ceil(parseInt(document_height)/parseInt(scrapHeight));
       scrapCount = scrapCountX*scrapCountY;
       curProjectName = "document";
       initWorkSpace();
       changeDimension();
       if(canvas.setCapture)canvas.setCapture();
       canvas.style.width = Math.min(clientWidth-canvas_x,projectWidth);
       canvas.style.height = Math.min(clientHeight-canvas_y,projectHeight);
       canvas.style.display="block";
       jg = new jsGraphics("canvas",Math.min(clientWidth-canvas_x,projectWidth),Math.min(clientHeight-canvas_y,projectHeight));
       //setHandlersSet(newDocumentDialog.nextEventHandler);
       switchArrow();
}


function document_form_cancel(){
       var div = document.getElementById("new_document_div");
       document.body.removeChild(div);
    if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
       setHandlersSet(newDocumentDialog.nextEventHandler);

}


function processOnKeyDownNewFile(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==13){
    new_document_form_submit();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  if(keyCode==27){
    document_form_cancel();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  return true;
}  


