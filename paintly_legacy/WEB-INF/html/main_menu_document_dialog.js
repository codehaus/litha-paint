var mainMenuDocumentDialog;

function menuDocumentDialog(){
   this.nextHandlersSet=-1;
   
   this.show = function(x, y, link){
	   mgn.closeAllWindows();
 
	  var splash = document.getElementById("splash");
	  if(splash)document.body.removeChild(splash);
	  var menuLink = '';
	  var title = '';

	  switch(link){
		  case 'about_us'	: {
			  title='About us';
			  menuLink='about_us.html?'+Math.random();
		  }break;
		  case 'about_soft'	: {
			  title='About software';
			  menuLink='about_soft.html?'+Math.random();
		  }break;
		  case 'gallery'	: {
			  title='Gallery';
			  menuLink='gallery.html?'+Math.random();
		  }break;
		  default:{
			  title='About us';
			  menuLink='about_us.html?'+Math.random();
		  }
	  }

		var div=document.createElement("div");
		var id = document.createAttribute("id");
		id.value="menu_document_dialog";
		div.setAttributeNode(id);
		div.style.position="absolute";
		div.style.left=x+"px";
		div.style.top=y+"px";
		div.style.height="450px";
		div.style.width="600px";
		div.style.background="white";
		div.style.zIndex=5;
		div.cursor="pointer";

		div.innerHTML = '<table class="systemColor" style="border-width:1;border-color:\'#25820A\'" bgcolor="white" cellspacing="0" cellpadding="0" border="0" width="99%" height="450" align="center">'
					  + '<tr><td align="left" class="systemGreenFont" style="padding:5" height="20">' + title + '</td>'
					  + '<td id="popupHeaderClose" width="8%" align="right" onclick="menu_doc_dialog_cancel()" style="padding:5">'
					  + '<img src="./img/pickers/close.gif"></td></tr>'
					  + '<tr><td colspan="2" ><iframe src="'+menuLink+'" width="598" height="450" style="border-width:0"></td></tr>'
					  + '</table>';

		document.body.appendChild(div);
		if(document.releaseCapture)document.releaseCapture();

		this.nextHandlersSet = curEventHandler;
		setHandlersSet(43);
  }

}

  function menu_doc_dialog_cancel(){
    if(canvas.style.display=="block" && canvas.setCapture)canvas.setCapture();
    setHandlersSet(mainMenuDocumentDialog.nextHandlersSet);
    var menuDocDialog = document.getElementById("menu_document_dialog");
    if(menuDocDialog){
      document.body.removeChild(menuDocDialog);
      menuDocDialog='';
    }    
  }