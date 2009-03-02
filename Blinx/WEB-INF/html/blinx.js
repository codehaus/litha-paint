function Paint (canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex) {

m4_include(c:\work\soflow\Blinx\tmp\homeUrl.js)

	function canvasCreator(left,top,canvas_width, canvas_height, zIndex) {

	  var alreadyCreated = document.getElementById(canvas_id+"_BlinxCanvElId");
	  if (alreadyCreated && alreadyCreated.parentNode) {
	  	alreadyCreated.parentNode.removeChild(alreadyCreated);
	  }
		
	  var canvasElement = document.createElement("div");
	  var canvasElementId = document.createAttribute("id");
	  canvasElementId.value=canvas_id+"_BlinxCanvElId";
	  
	  canvasElement.setAttributeNode(canvasElementId);
	
	  canvasElement.oncontextmenu = nop;
	  
	  canvasElement.style.display = "none";
	  
	  canvasElement.style.overflow = "hidden";
	  
	  canvasElement.style.position = "relative";
	  
	  canvasElement.style.left = "0px";
	  
	  canvasElement.style.top = top+"px";
	  
	  canvasElement.style.height = canvas_height+"px";
	  
	  canvasElement.style.width = canvas_width+"px";
	  
	  canvasElement.style.zIndex = (zIndex+1);

	  canvasElement.style.backgroundImage = 'url('+baseURL+"/"+"img/logo.gif"+')';
	  canvasElement.style.backgroundRepeat = "no-repeat";
	  canvasElement.style.backgroundPosition = "bottom right";
	  	  
	  return canvasElement;
	}
	
	function workspaceCreator(canvas_width, canvas_height, zIndex) {
	  var alreadyCreated = document.getElementById(canvas_id+"_BlinxWkspcElId");
	  if (alreadyCreated && alreadyCreated.parentNode) {
	  	alreadyCreated.parentNode.removeChild(alreadyCreated);
	  }
	  var canvasElement = document.createElement("div");
	  
	  var canvasElementId = document.createAttribute("id");
	  canvasElementId.value=canvas_id+"_BlinxWkspcElId";
	  
	  canvasElement.setAttributeNode(canvasElementId);
	
	  canvasElement.oncontextmenu = nop;
	    
	  canvasElement.style.overflow = "hidden";
	  
	  canvasElement.style.position = "relative";
	  
	  canvasElement.style.left = "0px";
	  
	  canvasElement.style.top = "0px";
	  
	  canvasElement.style.height = canvas_height+"px";
	  
	  canvasElement.style.width = canvas_width+"px";
	  
	  canvasElement.style.zIndex = zIndex;
	  	  	  
      canvasElement.style.backgroundColor=backgroundColor;
	  	   	  	      
	  return canvasElement;
	}
		
	function nop() {
	  return false;
	}
	
	this.setCssPrefix = function(cssPref) {
	  cssPrefix = cssPref;
	}
		
	this.recalcPosition = function() {
      var delta = Array();
      delta[0] = findPos(userCanvasPlaceholder)[0] - canvas_x;
      delta[1] = findPos(userCanvasPlaceholder)[1] - canvas_y;
      
      focusedBez[1]+=delta[0];
      focusedBez[2]+=delta[1];
      if (focusedBez && focusedBez.length > 0) {
	      for (var j=6; j<focusedBez.length; j++) {
	        for (var k=0; k<6; k++) {
	          focusedBez[j][parseInt(k / 2)][k % 2] += delta[k % 2];
	        }
	      }  
      }
      if (focusedImage && focusedImage.length > 0) {
      	focusedImage[1] +=delta[0];
      	focusedImage[2] +=delta[1];
      }
      if (focusedText && focusedText.length > 0) {
      	focusedText[1] +=delta[0];
      	focusedText[2] +=delta[1];
      }
      
      
      for (var i=0; i<regionHistory.length; i++) {
        if (regionHistory[i]) {
          if (regionHistory[i][0] == 'bezier') {
            regionHistory[i][1]+=delta[0];
            regionHistory[i][2]+=delta[1];
            for (var j=6; j<regionHistory[i].length; j++) {
              for (var k=0; k<6; k++) {
                   regionHistory[i][j][parseInt(k / 2)][k % 2] += delta[k % 2];
              }
            }            
          }
          if (regionHistory[i][0] == 'text' || regionHistory[i][0] == 'image') {
            regionHistory[i][1] +=delta[0];
            regionHistory[i][2] +=delta[1];
          }          
        }
      }
      
      for (var i=0;i<undoRedoLog.length; i++) {
      	if (undoRedoLog[i]) {
      		if (undoRedoLog[i][0] == 'bezier') {
      			undoRedoLog[i][1]+=delta[0];
      			undoRedoLog[i][2]+=delta[1];
      			for (var j = 6; j < undoRedoLog[i].length; j++) {
      				for (var k = 0; k < 6; k++) {
      				  undoRedoLog[i][j][parseInt(k / 2)][k % 2] += delta[k % 2];
      				}
      			}
      		}
      		if (undoRedoLog[i][0] == 'text' || undoRedoLog[i][0] == 'image') {
      			undoRedoLog[i][1] += delta[0];
      			undoRedoLog[i][2] += delta[1];
      		}
      		
      	}
        
      }
	  canvas_x = findPos(userCanvasPlaceholder)[0];
      canvas_y = findPos(userCanvasPlaceholder)[1];
	}
	
  this.changeBackgroundColor = function(bcolor) {
      sendObject(new Array(bcolor),"change_background");
      backgroundColor = bcolor;
      bgcolor = bcolor;
  }
  
  function openDocumentWithImageAsBackgroundStart (realWidth, realHeight, scrapsX, scrapsY) {   			
			clearWorkSpace();
			curFigureId = 1;
			undoRedoLog = new Array();
			undoRedoPtr = -1;
			focusedBez = new Array();
			focusedText = new Array();
			focusedImage = new Array();
			regionHistory = new Array();
			projectWidth = realWidth;

			projectHeight = realHeight;

			scrapCountX = scrapsX;
			scrapCountY = scrapsY;
			scrapCount = scrapCountX*scrapCountY;
			var workspace = document.getElementById(workspaceId);
			var newWidth = Math.min(canvasWidth, projectWidth);
			var newHeight = Math.min(canvasHeight,projectHeight);
			workspace.style.width = newWidth+"px";

	        workspace.style.height = newHeight+"px";
	        
	        wsx1 = newWidth;
    		wsy1 = newHeight;  
	        
	        canvas.style.top = -Math.min(canvasHeight, projectHeight);
			
			clearr();
			initWorkSpace();

		    jg = new jsGraphics(canvasId,Math.min(canvasWidth,projectWidth),Math.min(canvasHeight,projectHeight));

  }
  
  function openDocumentWithImageAsBackgroundEnd() {
  			canvas.style.display='block';
			switchArrow();  
  }
  
  function setFocusedImage(fImg) {
      focusedImage = new Array(fImg[0], canvas_x + fImg[1] - scrollVectorX, canvas_y + fImg[2] - scrollVectorY, fImg[3], fImg[4], fImg[5]);
      idd = fImg[5];
  }
  
  this.insertImage = function(url, fcallback) {    
  	lostFocus();
  	performRequestScript([url, fcallback],"insert_image");  	
  }

  var userCanvasPlaceholder;
  var canvasElement;
  var workspaceElement;
  
  this.canvas_id = canvas_id;

function cconstructor(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex) {
  if (typeof(zIndex)=='undefined' || !zIndex) {
  	zIdx = 2000;
  }
  userCanvasPlaceholder = document.getElementById(canvas_id);     
  workspaceElement = workspaceCreator(Math.min(canvas_width,doc_width), Math.min(canvas_height,doc_height), zIndex);        
  userCanvasPlaceholder.appendChild(workspaceElement);
  canvasElement = canvasCreator(0, -Math.min(canvas_height,doc_height), canvas_width, canvas_height, zIndex);
  userCanvasPlaceholder.appendChild(canvasElement);
  userCanvasPlaceholder.style.width = canvas_width+"px";
  userCanvasPlaceholder.style.height = canvas_height+"px";
  userCanvasPlaceholder.style.overflow = "hidden";
}

function iniServicetStatistic() {
   var trackingFrame = document.createElement('iframe');
   var trackingFrameSrc = document.createAttribute('src');
   trackingFrameSrc.value = baseURL+'/tracker.html';
   trackingFrame.setAttributeNode(trackingFrameSrc);
   trackingFrame.style.width = '0px';
   trackingFrame.style.height = '0px';
   trackingFrame.style.border = '0px';
   document.body.appendChild(trackingFrame);
}
  
//----Litha's Code-----//
m4_include(c:\work\soflow\paintly\tmp\index.js)
//----End of Litha's Code----//

function findPos(obj) {
	var curleft = 0;
	var curtop = 0;
	var tmpObj = obj;
	if (tmpObj.offsetParent) {
		if (typeof(tmpObj.offsetLeft)!='undefined') {
			curleft = tmpObj.offsetLeft;
		}
		if (typeof(tmpObj.offsetTop)!='undefined') {
			curtop = tmpObj.offsetTop;
		}
		tmpObj = tmpObj.offsetParent;
		while (tmpObj) {
			if (typeof(tmpObj.offsetLeft)!='undefined') {
 			  curleft += tmpObj.offsetLeft;
			}
			
			if (typeof(tmpObj.offsetTop)!='undefined') {
			  curtop += tmpObj.offsetTop;
			}
			
  		    tmpObj = tmpObj.offsetParent;
		}
	}
	tmpObj = obj;
	if (tmpObj) {
		if (typeof(tmpObj.scrollLeft)!='undefined') {
			curleft -= tmpObj.scrollLeft;
		}
		if (typeof(tmpObj.scrollTop)!='undefined') {
			curtop -= tmpObj.scrollTop;
		}
		tmpObj = tmpObj.parentNode;
		while(tmpObj && tmpObj != window && tmpObj!=document && tmpObj != document.documentElement && tmpObj != document.body) {
			if (typeof(tmpObj.scrollLeft)!='undefined' && tmpObj.scrollLeft >= 1) {
		      curleft -= tmpObj.scrollLeft;
			}
			if (typeof(tmpObj.scrollTop)!='undefined' && tmpObj.scrollTop >= 1) {
			  curtop -= tmpObj.scrollTop;
  		    }
			tmpObj = tmpObj.parentNode;
		}
	}
	return [curleft,curtop];
}

function rewriteGlobalVariables(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex) {
	canvasId = canvas_id+"_BlinxCanvElId";
	workspaceId = canvas_id+"_BlinxWkspcElId";
	canvas_x = findPos(userCanvasPlaceholder)[0];
	canvas_y = findPos(userCanvasPlaceholder)[1];
	projectWidth = doc_width;
	projectHeight = doc_height;
	canvasWidth = canvas_width;
	canvasHeight = canvas_height;
	bgcolor = backgroundColor;
	fitWorkspace = false;
	if (typeof(zIndex)!='undefined' && zIndex) {
		zIdx = zIndex;
	}
}

function newDocument(canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex) {
	  cconstructor(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor,zIndex);
      rewriteGlobalVariables(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex);
	  canvas = document.getElementById(canvasId);
      workspace = document.getElementById(workspaceId);
      canvas.style.display = "block";
      initial_document();
      canvas.onmouseenter=enter;
      canvas.onmouseleave=leave;      
}

/*----Declaring of public API-----*/
Paint.prototype.init = initCanvas;
//Paint.prototype.destroy = 
Paint.prototype.performOpen = performOpen;
Paint.prototype.performSave = performSave;
Paint.prototype.newDocument = newDocument;

Paint.prototype.toggleRectMode = switchSquare;
Paint.prototype.toggleEllipseMode = switchEllipse;
Paint.prototype.toggleSelectionMode = switchArrow;
Paint.prototype.toggleShiftMode = switchHand;
Paint.prototype.toggleLineMode = switchLine;
Paint.prototype.togglePolylineMode = switchPolyline;
Paint.prototype.togglePolygonMode = switchPolygon;
Paint.prototype.toggleTextMode = switchText;
Paint.prototype.toggleBezierMode = switchBezier;
Paint.prototype.togglePenMode = switchPen;
Paint.prototype.toggleClosedPenMode = switchLasso;

Paint.prototype.performUndo = performUndo;
Paint.prototype.performRedo = performRedo;
Paint.prototype.deleteFocusedObject = switchEraser;
Paint.prototype.performCopy = performCopy;
Paint.prototype.performPaste = performPaste;
Paint.prototype.sendToBack = bringFocusedBottom;
Paint.prototype.sendBackward = bringFocusedBack;
Paint.prototype.bringForward = bringFocusedFront;
Paint.prototype.bringToFront = bringFocusedTop;

Paint.prototype.setStrokeWidth = function (sw) {strokeWidth=sw;}
Paint.prototype.setStrokeDasharray = function (sd) {strokeDasharray = sd;}
Paint.prototype.setStrokeLinecap = function (sl) {strokeLinecap = sl;}
Paint.prototype.setStrokeLinejoin = function (sl) {strokeLinejoin = sl;}
Paint.prototype.setStrokeMiterlimit = function (sm) {strokeMiterlimit = sm;}

Paint.prototype.applyStroke = switchApplyStrokeColor;
Paint.prototype.applyFill = switchApplyFillColor;

Paint.prototype.setFontFamily = function(ff){fontFamily = ff; setTextState();}
Paint.prototype.setFontSize = function(fs){fontSize = fs; prosessLines(); setTextState();}
Paint.prototype.setFontWeight = function(fw){fontWeight = fw; setTextState(); }
Paint.prototype.setFontStyle = function (fs){fontStyle = fs; setTextState(); }
Paint.prototype.setTextDecoration = function (td) {textDecoration = td; setTextState();}

Paint.prototype.setStrokeColor = function (sc) {strokeColor = sc;}
Paint.prototype.setStrokeOpacity = function (so) {strokeOpacity = so;}
Paint.prototype.setFillColor = function (fc) {fillColor = fc;}
Paint.prototype.setFillOpacity = function (fo) {fillOpacity = fo;}
Paint.prototype.setFillRule = function (fr) {fillRule = fr;}

Paint.prototype.finishPolyline = function () {if (polylineSteps.length > 0) { finishPoly();}}
Paint.prototype.finishBezier = function () {if (bezSteps.length > 0) {finishBezier();}}
/*also: 
insertImage
setCssPrefix
recalcPosition
*/
/*----End of Declaring of public API------*/

/*----Declaring of content menu functions -----*/
_highlightMenuItem = highlightMenuItem;
_deleteStepPointBez = deleteStepPointBez;
_addStepPointBez = addStepPointBez;
_toCurveBez = toCurveBez;
_toLineBez = toLineBez;
_splitBez = splitBez;
_smoothBez = smoothBez;
_continueBez = continueBez;
_cuspBez = cuspBez;
_joinBez = joinBez;
_setJoinStartPoint = setJoinStartPoint;
_resetJoinStartPoint = resetJoinStartPoint;
_closeBezMenuCallBack = closeBezMenuCallBack;
/*----End of Declaring of content menu functions -----*/

/*----Declaring reserved functions -------*/

_updateScrap = updateScrap;
_setFocusedImage = setFocusedImage;
_saveImageToUndoRedoLog = saveImageToUndoRedoLog;
_drawFocusedImage = drawFocusedImage;
_sendPacket = sendPacket;
_callbackHandler = callbackHandler;
_processOpen = processOpen;
_openDocumentWithImageAsBackgroundStart = openDocumentWithImageAsBackgroundStart;
_openDocumentWithImageAsBackgroundEnd = openDocumentWithImageAsBackgroundEnd;
_iniServicetStatistic = iniServicetStatistic;

/*----End of Declaring reserved functions -------*/

  cconstructor(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex);
  rewriteGlobalVariables(canvas_id, canvas_width, canvas_height, doc_width, doc_height, backgroundColor, zIndex);
  
  
  return this;
}

var _updateScrap;
var _setFocusedImage;
var _saveImageToUndoRedoLog;
var _drawFocusedImage;
var _closeBezMenuCallBack;
var _resetJoinStartPoint;
var _sendPacket;
var _callbackHandler;
var _processOpen;
var _openDocumentWithImageAsBackgroundStart;
var _openDocumentWithImageAsBackgroundEnd;
var _iniServicetStatistic;

var _highlightMenuItem;
var _deleteStepPointBez;
var _addStepPointBez;
var _toCurveBez;
var _toLineBez;
var _splitBez;
var _smoothBez;
var _continueBez;
var _cuspBez;
var _joinBez;
var _setJoinStartPoint;
var _resetJoinStartPoint;