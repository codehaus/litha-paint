function downloadfileperform(){    
	if(u_openDocumentDialog.fileName4Open){
		var fileName = u_openDocumentDialog.fileName4Open;
	    u_open_doc_form_cancel();
	    parent.window.open(baseURL+"/d_load/"+fileName);
	}
}
