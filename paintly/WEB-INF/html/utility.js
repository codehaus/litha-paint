var hexChars = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");

var prevButton; //the button, that is currently highlighted

function getInverseColor(color){
  var color1 = color.substring(1,3);
  var color2 = color.substring(3,5);
  var color3 = color.substring(5,7);
  var colorInt1 = parseInt(color1,16);
  var invColor1 = byte2hex(colorInt1 ^ 255);
  var colorInt2 = parseInt(color2,16);
  var invColor2 = byte2hex(colorInt2 ^ 255);
  var colorInt3 = parseInt(color3,16);
  var invColor3 = byte2hex(colorInt3 ^ 255);
  return "#"+invColor1+invColor2+invColor3;  
}

function byte2hex(val){
  return hexChars[Math.floor(val/16)]+hexChars[val%16];
}

function getElementParam(objElement, styleParam){
	var value = 0;
	if(styleParam == '') styleParam = 'width';
	if(objElement != null){
		if(browser.indexOf('Opera') != -1){
			var elementStyle = objElement.getAttribute('style');
			var strWidth = styleParam+':';
			startPos = elementStyle.indexOf(strWidth);
			if(startPos != -1){
				endPos = elementStyle.indexOf(';', startPos);
				value = elementStyle.substring(startPos + strWidth.length, endPos);
			} else value = '';
		}else{
			eval('value = objElement.style.'+styleParam);
		}
		if(value.indexOf('px') != -1 && styleParam != 'clip'){
			value = parseInt(value.substring(0, value.indexOf('px')));
		}
	}
	return value;
}

function ifFileNameValid(str){
  var validChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_!-.";
  for(var i=0;i<str.length;i++){
    if(validChars.indexOf(str.charAt(i))==-1) return false;
  }
  return true;
}

function processOverButton(btn){
  if(prevButton!=null){ 
    prevButton.className='icon';
  }
  prevButton = btn;
  btn.className='icon_selected'; 
  if(contextmenu!=null && contextmenu.isShown==true) closeContextMenu();
}

function performMainMenu(link){
	if(mainMenuDocumentDialog == null || mainMenuDocumentDialog == 'undefined')	mainMenuDocumentDialog = new menuDocumentDialog();
	mainMenuDocumentDialog.show(100,100,link);
}

function onClickBody(){
	hideSplashScreen();
	document.body.onclick = null;
}

var tabberOptions = {
  'manualStartup':true,

  /* Optional: code to run after each tabber object has initialized */
  /*
  'onLoad': function(argsObj) {
    if (argsObj.tabber.id == 'tab2') {
      alert('Finished loading tab2!');
    }
  },
  */

  'onClick': function(argsObj) {

    var t = argsObj.tabber;
    var id = t.id;
    var i = argsObj.index;
    var e = argsObj.event;

    if (id == 'u_save_tabber') {
		if(t.tabs[i].headingText == u_publishTitle && !u_publishFileList){
			populatePublishFilesList();
			u_publishFileList = 1;
		}
	  return true;
    }
  },
  
  /* Optional: set an ID for each tab navigation link */
  'addLinkId': true
};

function pointToSegmentDist(px, py, x1, y1, x2, y2){
  var ratio;
  var dx;
  var dy;
  var res = 10000;

  if(Math.abs(x1-x2)<0.001 && Math.abs(y1-y2)<0.001){
    res = Math.sqrt((px-x1)*(px-x1)+(py-y1)*(py-y1));
  }
  else{
    dx    = x2 - x1;
    dy    = y2 - y1;
    ratio = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
    if(ratio < 0){res = Math.sqrt((px-x1)*(px-x1)+(py-y1)*(py-y1));}
    else if(ratio > 1){res = Math.sqrt((px-x2)*(px-x2)+(py-y2)*(py-y2));}
    else{
      res = Math.sqrt((px-((1 - ratio) * x1 + ratio * x2))*(px-((1 - ratio) * x1 + ratio * x2))+(py-((1 - ratio) * y1 + ratio * y2))*(py-((1 - ratio) * y1 + ratio * y2)));
    }
  }
  return res;
}

function pointToBezDist(px,py,x0,y0,x1,y1,x2,y2,x3,y3,iteration){
   if(iteration==undefined){
     iteration=4;
   }

   if(iteration==0){
      return Math.min(Math.min(pointToSegmentDist(px,py,x0,y0,x1,y1),pointToSegmentDist(px,py,x1,y1,x2,y2)),pointToSegmentDist(px,py,x2,y2,x3,y3));
   }

   var res = splitBezier(x0,y0,x1,y1,x2,y2,x3,y3);
   var a = pointToBezDist(px,py,res[0],res[1],res[2],res[3],res[4],res[5],res[6],res[7],iteration-1);
   var b = pointToBezDist(px,py,res[8],res[9],res[10],res[11],res[12],res[13],res[14],res[15],iteration-1);
   return Math.min(a,b);  
}

function pointToObjDist(px,py,fObj){
  var res = 1000000;
  var dist;

  for(var i=0;i<fObj.length-7;i++){
    dist = pointToBezDist(px,py,fObj[6+i][p][0],fObj[6+i][p][1],fObj[6+i][m][0],fObj[6+i][m][1], fObj[7+i][r][0],fObj[7+i][r][1],fObj[7+i][p][0], fObj[7+i][p][1],4);
    if(dist<res) res = dist;
  }
  if(fObj[fObj.length-1][termProp]==1){
    dist = pointToBezDist(px,py,fObj[fObj.length-1][p][0],fObj[fObj.length-1][p][1],fObj[fObj.length-1][m][0],fObj[fObj.length-1][m][1], fObj[6][r][0],fObj[6][r][1],fObj[6][p][0], fObj[6][p][1],4);
    if(dist<res) res = dist;
  }
  return res;   
}

