function exportfileperform(){
	var fileName = document.getElementById("exportfilename").value;
	var fileType = document.getElementById("exportfiletype").value;
	if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
	if(fileName != '' && ifFileNameValid(fileName)){
		performExport(fileName, fileType);
		setHandlersSet(u_saveDocumentDialog.nextHandlersSet);
		curProjectName = fileName;
	}
	else{
		alert("Only alphanumeric characters and _, !, SPACE are allowed in the file name");
	}
}

function performExport(fileName, fileType){ 
  var u_saveDialog = document.getElementById("u_save_document_div");
  if(u_saveDialog) document.body.removeChild(u_saveDialog);
  parent.window.open(baseURL+"/export/"+fileName+"."+fileType+"?filename="+fileName+"&filetype="+fileType,fileName+fileType,"width=500,height=300,toolbar=0,status=1");
}