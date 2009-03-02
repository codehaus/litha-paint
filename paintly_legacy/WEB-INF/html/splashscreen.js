var splashTimeoutID;

function SplashScreen(){
  this.show = function(x,y){
    var div = document.createElement("div");
    var id = document.createAttribute("id");
    id.value="splash";
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=x+"px";
    div.style.top=y+"px";
    div.style.height="200px";
    div.style.width="250px";
    div.style.background="black";
    div.style.zIndex=5;
    div.cursor="pointer";
    div.innerHTML="<p style=\"color: white;\">Hello dear user</p><img src=\"img/new_document.PNG\" style=\"position: relative; left: 10px; top: 80px;\" onclick=\"new_document()\" onmouseover=\"this.src='img/new_document_over.PNG'\" onmouseout=\"this.src='img/new_document.PNG'\" /><img src=\"img/open_last.PNG\" style=\"position: relative; left: 10px; top: 80px;\" onclick=\"performAutoopen()\" onmouseover=\"this.src='img/open_last_over.PNG'\" onmouseout=\"this.src='img/open_last.PNG'\" /><img src=\"img/open.PNG\" style=\"position: relative; left: 10px; top: 80px;\" onclick=\"performOpenDocument()\" onmouseover=\"this.src='img/open_over.PNG'\" onmouseout=\"this.src='img/open.PNG'\" />";
    document.body.appendChild(div);
  }
}

function showSplashScreen(){
	var spashWidth = 400;
	var spashHeigth = 194;
	var splash = document.getElementById('splashscreen');
	if(clientWidth < 600 || clientHeight < 400){	   
		hideSplashScreen();
	}else if(splash){
		splash.style.zIndex = 99;
		splash.style.position="absolute";		
		splash.style.left=Math.round((clientWidth - spashWidth) / 2)+"px";
		splash.style.top=Math.round((clientHeight - spashHeigth) / 2)+"px";
		splash.style.display = '';
		splashTimeoutID = setTimeout("hideSplashScreen()", 60000);
	}
}

function hideSplashScreen(){
	var splash = document.getElementById('splashscreen');
	if(splash) document.body.removeChild(splash);
	if(splashTimeoutID) clearTimeout(splashTimeoutID);
}

function new_document(){
  var splash = document.getElementById("splash");
  if(splash)document.body.removeChild(splash);
  newDocumentDialog = new NewDocumentDialog();
  newDocumentDialog.show(100,100);    
}

function open_last(){
}


