reportDocumentDialog = 0;
reportTextAreaSize = 700;

function ReportDocumentDialog(){
   this.nextHandlersSet=-1;
   this.author = 'your name';
   this.email = 'e-mail';
   this.bug_description = 'bug report or message';


   this.show = function(x,y){
   mgn.closeAllWindows();

    if(canvas.style.display=="block"){
     var div=document.createElement("div");
     var id = document.createAttribute("id");
     id.value="report_document_div";
     div.setAttributeNode(id);
     div.style.position="absolute";
     div.style.left=x+"px";
     div.style.top=y+"px";
     div.style.height="250px";
     div.style.width="300px";
     div.style.background="#FFFFFF";
     div.style.zIndex=5;
     div.cursor="pointer";
     if(document.releaseCapture)document.releaseCapture();

	div.innerHTML = '<!--form-->'
				  + '<table border="0" class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" width="99%" height="250" align="center">'
				  + '<tr><td align="left" class="systemGreenFont" style="padding:5" height="20">Bug report</td>'
				  + '<td align="right" style="padding:5">'
				  + '<img id="popupHeaderClose" src="./img/pickers/close.gif" onclick="reportCancel()"></td></tr>'
				  + '<tr><td align="left" style="margin:5;padding:5" class="systemGreenFont">'
				  + '<input class="systemGreenFont" size="22" maxlength="30" type="text" id="author" value="'+this.author+'" onfocus="performField(this)"/>*'
				  + '</td>'
				  + '<td rowspan="3" style="margin:5" align="center" valign="top">'
				  + '<input  style="margin:5;width:66px;height:19;border-width:0;background-image:url(img/pickers/send.gif)" type="button" id="popupApply" name="open" value="" style="margin-top:1px" onclick="reportPerform()" onfocus="performField(this)"><br>'
				  + '</td></tr>'
				  + '<tr><td align="left" style="margin:5;padding:5">'
				  + '<input class="systemGreenFont" size="22" maxlength="30" type="text" id="email" value="'+this.email+'" onfocus="performField(this)"/>'
				  + '</td></tr>'
				  + '<tr><td align="center" style="margin:5">'
				  + '<textarea id="bug_description" style="background-color:#F0F0F0;position:relative;width:200px;height:150px;" wrap="on" class="systemGreenFont" onfocus="performField(this)" onkeyup="formatReportTextArea(this)">'+this.bug_description+'</textarea></div>'
				  + '</td></tr></table><!--/form-->';

     document.body.appendChild(div);    
     //document.getElementById("author").focus();
     this.nextHandlersSet = curEventHandler;
     setHandlersSet(41);
    }
  }
}

	function reportPerform(){
		var _author		= document.getElementById("author").value;
		var _email		= document.getElementById("email").value;
		var _bug_description	= document.getElementById("bug_description").value;

		if(_author != '' && _bug_description != '' && validateReporField('author') && validateReporField('bug_description')){
			if(canvas.style.display == "block" && canvas.setCapture)canvas.setCapture();
			if(_email == reportDocumentDialog.email) _email = '';
			performReporting(_author, _email, _bug_description);
			reportCancel();
		}
	}

	function formatReportTextArea(obj){
		if(obj.value.length > reportTextAreaSize){
			obj.value = obj.value.substring(0, reportTextAreaSize);
			alert('Bug-report message can contains ' + reportTextAreaSize + ' symbols maximum.');
		}
	}

	function validateReporField(varName){
		return (document.getElementById(varName).value != eval('reportDocumentDialog.'+varName));
	}

	function performField(obj){
		if(obj.value == eval('reportDocumentDialog.'+obj.id)) obj.value = '';
	}

	function reportCancel(){
		var repDocumentDialog = document.getElementById("report_document_div");
		if(repDocumentDialog) document.body.removeChild(repDocumentDialog);
		if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
		setHandlersSet(reportDocumentDialog.nextHandlersSet);
	}

	function performReportDocument(){
		reportDocumentDialog = new ReportDocumentDialog();
		reportDocumentDialog.show(100,100);
	}


function processOnKeyDownBugReport(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  /*
  if(keyCode==13){
    publishfileperform();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  */
  if(keyCode==27){
    reportCancel();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;    
  }
  return true;
}


	function performReporting(author, email, description){ 
		initXMLHttpRequest();
		if (!request) alert("Error initializing XMLHttpRequest!");

//		if (request.setRequestHeader)
//			request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');


		var req = '?author='+author+'&email='+email+'&description='+description;
		req = encodeURI(req);

		request.open("GET",baseURL+"/report/"+req,false);
		request.send(false);    
	}