var menu_top;
var menu_left;
var menu_height;
var highlightedDiv;

function MenuItem(num,img,cap,func){
  this.num=num;
  this.img=img;
  this.cap=cap;
  this.func=func;
}


function ContextMenu(id, zIx){
  this.nextEventHandler;
  this.menuItems = new Array();
  this.id = id;
  this.isShown = false;
  this.zInd = zIx;

  this.setMenuItem = function(menuItem){
    this.menuItems[this.menuItems.length]=menuItem;
  }

  this.show = function(x,y){
    var div = document.createElement("div");
    var id = document.createAttribute("id");
    id.value=this.id;
    div.setAttributeNode(id);
    div.style.position="absolute";
    div.style.left=x+"px";
    div.style.top=y+"px";
    div.style.width="100px";
    div.style.background="#FFFFFF";
    div.style.zIndex=(this.zInd+1000);
    div.cursor="pointer";
    if(this.menuItems.length > 0){
		var innerHTMLValue = '<table bgcolor="#25820A" cellpadding="0" cellspacing="1" align="center" width="100px" border="0"><tr><td><table bgcolor="#FFFFFF" cellpadding="0" cellspacing="2" align="center" width="98px" border="0" height="99%" valign="middle"><tr><td>';
		var objPrefix = "_";
		for(var i=0;i<this.menuItems.length;i++){
		
			innerHTMLValue += '<div class="'+cssPrefix+'icon" onmouseover="'+objPrefix+'highlightMenuItem(this)" width="96px" onmousedown="'+objPrefix+this.menuItems[i].func+'()">'
						   +  '<table><tr class="'+cssPrefix+'systemGreenFont"><td width="35" class="cursorHand"><img id="'+this.id+this.menuItems[i].num+'Img" src="' + this.menuItems[i].img.src + '"></td>'
						   +  '<td class="'+cssPrefix+'cursorHand" id="'+this.id+this.menuItems[i].num+'">' + this.menuItems[i].cap + '</td></tr></table></div>';
	
		}
		innerHTMLValue += '</td></tr></table></td></tr></table>';
		div.innerHTML = innerHTMLValue;
    }
    document.body.appendChild(div);    

    menu_top = div.offsetTop;
    menu_left = div.offsetLeft;
    menu_height = document.getElementById(""+this.id+this.menuItems[0].num).offsetHeight;    

    //div.onmousemove=highlightMenuItem;
//    div.onkeydown=processKeyDownContextMenu;
    this.nextEventHandler=curEventHandler;
    setHandlersSet(22);
    this.isShown=true;
  }

  this.close=function(restorePrevHandler){
    canvas.style.cursor = "auto";
    var div = document.getElementById(this.id);
    if(div){
      document.body.removeChild(div);
    }
    eval(this.closeFuncNameCallBack+"()");
    if(canvas.setCapture)canvas.setCapture();
    if(restorePrevHandler){setHandlersSet(this.nextEventHandler);}
    this.isShown=false;
    canvas.style.cursor="default";
  }
 
  this.closeFuncNameCallBack='';

  this.setCallBackOnClose = function(funcName){
    this.closeFuncNameCallBack = funcName;
  }
}

function highlightMenuItem(obj){
  if(obj && obj.childNodes[0]){
//	  obj = obj.childNodes[0];
	  if(obj != null){ 
		  obj.className = 'icon_selected';
	  }
	  if(highlightedDiv != null && highlightedDiv != obj){
		  highlightedDiv.className = 'icon';
	  }
	  highlightedDiv=obj;
  }
/*
  if(obj && obj.childNodes[0] && obj.childNodes[0].childNodes[0]){
	  obj = obj.childNodes[0].childNodes[0];
	  if(obj != null){ 
		  obj.className = 'icon_selected';
	  }
	  if(highlightedDiv != null && highlightedDiv != obj){
		  highlightedDiv.className = 'icon';
	  }
	  highlightedDiv=obj;
  }
*/
}

/*
function highlightMenuItem(evt){
      var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
      var j = Math.floor((y-menu_top)/menu_height);
      var img = document.getElementById(""+this.id+j+'Img');
      if(img){
        if(highlightedDiv){
			img.style.borderColor = "white";
			img.style.borderWidth = "1px";
          //highlightedDiv.style.background='gray';
          //highlightedDiv.style.color='black';
        }
		img.style.borderColor = "#B82100";
		img.style.borderWidth = "1px";        
        //div.style.background = 'blue';
        //div.style.color = 'white';
        highlightedDiv=img;
      }
}
*/
function closeContextMenu(){
  if (contextmenu) {
  	contextmenu.close(true);
  }
}

function processKeyDownContextMenu(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==27){//ESC pressed
    closeContextMenu();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
}

