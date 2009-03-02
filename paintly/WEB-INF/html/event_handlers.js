var dragapproved=false;
var inverted=false;
var z;
var x;
var y;
var x1;
var y1;
var canvas_x = 40;
var canvas_y = 90;
var tool_selected = 0; //0-square 1-ellipse 2-arrow 3-singleline;
var old_tool_selected = 0;
var counter = 0;

var focusedObject;
var mobilePoint = new Array();


var highlightFocusMonitor =false;

var focusedMobilePointNum = -1;

var left;
var top;
var width;
var height;
var idd;

var verScrollbarWidth = 20;
var horScrollbarWidth = 20;
var fitWorkspace = true;


var weights = new Array();
weights[0] = new Array("x1-x","y1-y","x-x1","y-y1");
weights[1] = new Array("0","y1-y","0","y-y1");
weights[2] = new Array("0","y1-y","x1-x","y-y1");
weights[3] = new Array("0","0","x1-x","0");
weights[4] = new Array("0","0","x1-x","y1-y");
weights[5] = new Array("0","0","0","y1-y");
weights[6] = new Array("x1-x","0","x-x1","y1-y");
weights[7] = new Array("x1-x","0","x-x1","0");
weights[8] = new Array("x1-x","y1-y","0","0");

var regionHistory = new Array();

var eventHandler = new Array();

// set of handlers for rect and ellipse tools
eventHandler[0] = new Array(); // handlers for the following state: user selected circle or rect tool and wants to draw it on the canvas
eventHandler[0]["onmousedown"] = "drags";
eventHandler[0]["onmousemove"] = "move";
eventHandler[0]["onmouseup"] = "release";

eventHandler[3] = new Array(); //user has selected arrow and wants to peek up the shape
eventHandler[3]["onmousedown"] = "selectRegion";
eventHandler[3]["onmousemove"] = "dummy";
eventHandler[3]["onmouseup"] = "dummy";



//set of handlers for singleline, polyline and polygon tool (see line_event_handlers.js).
eventHandler[4] = new Array();// user selected line tool and wants to draw line on the canvas
eventHandler[4]["onmousedown"] = "downLine";
eventHandler[4]["onmousemove"] = "moveLine";
eventHandler[4]["onmouseup"] = "releaseLine";

eventHandler[5] = new Array();// user selected poly(line/gon) tool and wants to draw polyline on the canvas
eventHandler[5]["onmousedown"] = "downPolyline";
eventHandler[5]["onmousemove"] = "movePolyline";
eventHandler[5]["onmouseup"] = "dummy";


//set of event handlers for bezier curve (see bezier_event_handler.js).
eventHandler[9] = new Array();// user selected bezier curve tool and wants to draw bezier curve on the canvas
eventHandler[9]["onmousedown"] = "downBez";
eventHandler[9]["onmousemove"] = "moveBez";
eventHandler[9]["onmouseup"] = "releaseBez";
eventHandler[9]["onclick"] = "hitBezFocusDbl";


eventHandler[10] = new Array(); //user has drawn bezier, new shape is in the focus and user wants to highlight the figure when pointing to some mobile point or to some steppoint
eventHandler[10]["onmousemove"] = "highlightBezFocus";
eventHandler[10]["onmousedown"] = "hitBezFocus";
eventHandler[10]["onmouseup"] = "dummy";
eventHandler[10]["onclick"] = "hitBezFocusDbl";

eventHandler[11] = new Array(); //user has drawn bezier, new shape is in the focus and user is pointing to some mobile point and wants to resize or move it around
eventHandler[11]["onmousedown"] = "dummy";
eventHandler[11]["onmousemove"] = "resizeFocusedBez";
eventHandler[11]["onmouseup"] = "finishResizeFocusedBez";

eventHandler[12] = new Array(); //user has drawn bezier, new shape is in the focus and user is pointing to some steppoint and wants to change segment of bezier
eventHandler[12]["onmousedown"] = "dummy";
eventHandler[12]["onmousemove"] = "reallignFocusedBez";
eventHandler[12]["onmouseup"] = "finishReallignFocusedBez";
eventHandler[12]["onclick"] = "hitBezFocusDbl";

eventHandler[13] = new Array(); //user has drawn bezier, new shape is in the focus and user is pointing to some directing and wants to change segment of bezier
eventHandler[13]["onmousedown"] = "dummy";
eventHandler[13]["onmousemove"] = "redirectFocusedBez";
eventHandler[13]["onmouseup"] = "finishReallignFocusedBez";

//set of event handlers for text (see text_event_handlers.js).
eventHandler[14] = new Array();//user has selected text tool and wish to create rectangular multyline text region by draging mouse
eventHandler[14]["onmousedown"] = "downText";
eventHandler[14]["onmousemove"] = "moveText";
eventHandler[14]["onmouseup"] = "releaseText";

eventHandler[15] = new Array();//user has created text region and is going to type text content
eventHandler[15]["onmousedown"] = "freezeText";

eventHandler[16] = new Array();//user has enter text into text region and pressed mouse button to get ability to move area around
eventHandler[16]["onmousemove"] = "highlightTextFocus";
eventHandler[16]["onmousedown"] = "hitTextFocus";
eventHandler[16]["onmouseup"] = "dummy";

eventHandler[17] = new Array(); //user has drawn text, new text area is in the focus and user is pointing to center mobile point and wants to move it around
eventHandler[17]["onmousedown"] = "dummy";
eventHandler[17]["onmousemove"] = "moveFocusedText";
eventHandler[17]["onmouseup"] = "finishMoveFocusedText";
eventHandler[17]["ondblclick"]	= "regenerateText";

//set of event handlers for pen (see freehand_event_handlers.js).
eventHandler[18] = new Array();// user selected pen tool and wants to freehand curve on the canvas
eventHandler[18]["onmousedown"] = "downPen";
eventHandler[18]["onmousemove"] = "movePen";
eventHandler[18]["onmouseup"] = "releasePen";


//set of event handlers for Bezier tool again (see bezier_event_handlers.js)
eventHandler[21] = new Array();// user is in the process of drawing bezier curve tool and wants to move previos control points
eventHandler[21]["onmousedown"] = "dummy";
eventHandler[21]["onmousemove"] = "reallignLastSegmentBez";
eventHandler[21]["onmouseup"] = "finishReallignLastSegmentBez";

//set of event handlers for Context Menu
eventHandler[22] = new Array(); //
eventHandler[22]["onmousedown"] = "closeContextMenu";
eventHandler[22]["onmousemove"] = "dummy";
eventHandler[22]["onmouseup"] = "dummy";

eventHandler[23] = new Array(); //
eventHandler[23]["onmousedown"] = "dummy";
eventHandler[23]["onmousemove"] = "dummy";
eventHandler[23]["onmouseup"] = "dummy";

eventHandler[24] = new Array(); //bezier is in the focus, and user whants to pick rotation center of rotate/skew point
eventHandler[24]["onmousedown"] = "hitFocusedBezRot";
eventHandler[24]["onmousemove"] = "highlightFocusedBezRot";
eventHandler[24]["onmouseup"] = "dummy";

eventHandler[25] = new Array(); //user clicks on the rotation center and whants to drag it around
eventHandler[25]["onmousedown"] = "dummy";
eventHandler[25]["onmousemove"] = "moveFocusedBezCenter";
eventHandler[25]["onmouseup"] = "finishMoveFocusedBezCenter";

eventHandler[26] = new Array(); //user clicks on the rotation point and whants to rotate figure around rotation center
eventHandler[26]["onmousedown"] = "dummy";
eventHandler[26]["onmousemove"] = "rotateFocusedBez";
eventHandler[26]["onmouseup"] = "finishRotateFocusedBez";

eventHandler[27] = new Array(); //user clicks on the upper shift point and whants to shift figure
eventHandler[27]["onmousedown"] = "dummy";
eventHandler[27]["onmousemove"] = "upperShiftFocusedBez";
eventHandler[27]["onmouseup"] = "finishShiftFocusedBez";

eventHandler[28] = new Array(); //user clicks on the right shift point and whants to shift figure
eventHandler[28]["onmousedown"] = "dummy";
eventHandler[28]["onmousemove"] = "rightShiftFocusedBez";
eventHandler[28]["onmouseup"] = "finishShiftFocusedBez";

eventHandler[29] = new Array(); //user clicks on the bottom shift point and whants to shift figure
eventHandler[29]["onmousedown"] = "dummy";
eventHandler[29]["onmousemove"] = "bottomShiftFocusedBez";
eventHandler[29]["onmouseup"] = "finishShiftFocusedBez";

eventHandler[30] = new Array(); //user clicks on the bottom shift point and whants to shift figure
eventHandler[30]["onmousedown"] = "dummy";
eventHandler[30]["onmousemove"] = "leftShiftFocusedBez";
eventHandler[30]["onmouseup"] = "finishShiftFocusedBez";


eventHandler[31] = new Array(); //user picks hand tool and whant to shift workspace
eventHandler[31]["onmousedown"] = "workspaceMouseDown";
eventHandler[31]["onmousemove"] = "workspaceMouseMove";
eventHandler[31]["onmouseup"] = "workspaceMouseUp";


//set of handlers for image

eventHandler[45] = new Array(); //user has drawn circle or rect, new shape is in the focus and user wants to highlight the figure when pointing to some mobile point
eventHandler[45]["onmousemove"] = "highlightImageFocus";
eventHandler[45]["onmousedown"] = "hitImageFocus";
eventHandler[45]["onmouseup"] = "dummy";

eventHandler[46] = new Array(); //user has inserted an image, new image is in the focus and user is pointing to some mobile point and wants to resize or move it around
eventHandler[46]["onmousedown"] = "dummy";
eventHandler[46]["onmousemove"] = "resizeFocusedImage";
eventHandler[46]["onmouseup"] = "finishResizeFocusedImage";



/*hiddenCanvas: 0 - before element, 1 - before element focused, 2 - before element highligted, 3 - before mobile point hits , 4 (special) - previos segment of poly(line/gon) or bezier curve has drawn
5 - div for text has created,but without border,
6 - border for text is created*/


var curEventHandler = 0;
var curFigureId = 0;
var curCommandId = 0;

var contextmenu;



function switchSquare(){
	closeContextMenu();
    toolHoockerBefore();
  	tool_selected = 0;
	toolHooker(tool_selected);
  	dragapproved=false;
  	setHandlersSet(0);
}


function switchEllipse(){
	closeContextMenu();
    toolHoockerBefore();
  	tool_selected = 1;
	toolHooker(tool_selected);

  	dragapproved=false;
  	setHandlersSet(0);
  }

function switchArrow(){
	closeContextMenu();
    toolHoockerBefore();
  	tool_selected = 2;
	toolHooker(tool_selected);

  	dragapproved=false;
	if(focusedBez.length>6){setHandlersSet(10);}
        else if(focusedText.length>6 && focusedText[6] && focusedText[6].length>0){setHandlersSet(16);}
	else {setHandlersSet(3);}
}

function switchLine(){
	closeContextMenu();
    toolHoockerBefore();
	tool_selected = 3;
	toolHooker(tool_selected);
	dragapproved=false;
    setHandlersSet(4);
}

function switchPolyline(){
	closeContextMenu();
    toolHoockerBefore();
	tool_selected = 4;
	toolHooker(tool_selected);

	dragapproved=false;
    setHandlersSet(5);
}

function switchPolygon(){
	closeContextMenu();
    toolHoockerBefore();
	tool_selected = 5;
	toolHooker(tool_selected);
	dragapproved=false;
    setHandlersSet(5);
}

function switchBezier(){
	closeContextMenu();
    toolHoockerBefore();
    tool_selected = 6;
	toolHooker(tool_selected);
    dragapproved=false;
    setHandlersSet(9);   
}

function switchText(){
	closeContextMenu();
    toolHoockerBefore();
    tool_selected = 7;
	toolHooker(tool_selected);
    dragapproved=false;
    setHandlersSet(14);    
}	

function switchPen(){
	closeContextMenu();
    toolHoockerBefore();
    tool_selected = 8;
	toolHooker(tool_selected);
    dragapproved=false;
    setHandlersSet(18);
}	

function switchLasso(){
	closeContextMenu();
    toolHoockerBefore();
    tool_selected = 9;
	toolHooker(tool_selected);
    dragapproved=false;
    setHandlersSet(18);    
}

function switchApplyStrokeColor(){
    closeContextMenu();
	toolHoockerBefore();
	tool_selected = 10;
	toolHooker(tool_selected);
	applycurrentColor('strokeColor');
	dragapproved=false;
	setHandlersSet(37);	
}

function switchApplyFillColor(){
	closeContextMenu();
    toolHoockerBefore();
	tool_selected = 11;
	toolHooker(tool_selected);
	applycurrentColor('fillColor');
	dragapproved=false;
	setHandlersSet(37);
}

function switchEraser(){
	  closeContextMenu();
      toolHoockerBefore();
	  toolHooker(tool_selected);

        if(focusedBez!=null && focusedBez.length>6){
	  deleteFocusedBez();
          return;
          
        }
	if(focusedText!=null && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
	  deleteFocusedText();
          return;
	}
	if(focusedImage!=null && focusedImage.length==6){
	  deleteFocusedImage();
          return;
	}

}

function switchHand(){
	closeContextMenu();
    toolHoockerBefore();
    lostFocus();
	tool_selected = 10;
	toolHooker(tool_selected);
	dragapproved=false;
	setHandlersSet(31);    
}


function lostFocus(){
	if(focusedBez && focusedBez.length>6 && focusedBez[5]){
		jg.restoreHiddenCanvas(1);
		jg.paint();
		regionHistory[focusedBez[5][0]] = new Array(focusedBez[0],focusedBez[1]+scrollVectorX,focusedBez[2]+scrollVectorY,focusedBez[3],focusedBez[4]);
		regionHistory[focusedBez[5][0]][5] = new Array(focusedBez[5][0],new Array(focusedBez[5][1][0],focusedBez[5][1][1],focusedBez[5][1][2],focusedBez[5][1][3],focusedBez[5][1][4],focusedBez[5][1][5],focusedBez[5][1][6]), new Array(focusedBez[5][2][0],focusedBez[5][2][1],focusedBez[5][2][2]));
		for(var i=6;i<focusedBez.length;i++){
			regionHistory[focusedBez[5][0]][i] = new Array();
			regionHistory[focusedBez[5][0]][i][p] = new Array();
			regionHistory[focusedBez[5][0]][i][m] = new Array();
			regionHistory[focusedBez[5][0]][i][r] = new Array();
			regionHistory[focusedBez[5][0]][i][p][0] = focusedBez[i][p][0]+scrollVectorX;
			regionHistory[focusedBez[5][0]][i][p][1] = focusedBez[i][p][1]+scrollVectorY;
			regionHistory[focusedBez[5][0]][i][m][0] = focusedBez[i][m][0]+scrollVectorX;
			regionHistory[focusedBez[5][0]][i][m][1] = focusedBez[i][m][1]+scrollVectorY;
			regionHistory[focusedBez[5][0]][i][r][0] = focusedBez[i][r][0]+scrollVectorX;
			regionHistory[focusedBez[5][0]][i][r][1] = focusedBez[i][r][1]+scrollVectorY;
			regionHistory[focusedBez[5][0]][i][couple] = focusedBez[i][couple];
			regionHistory[focusedBez[5][0]][i][termProp] = focusedBez[i][termProp];
			regionHistory[focusedBez[5][0]][i][line] = focusedBez[i][line];
		}
		focusedBez = new Array();
	}
    if(focusedText && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
		jg.restoreHiddenCanvas(1);
		jg.paint();
		textInfo = new Array(focusedText[5][0], strokeColor, fontSize, fontWeight, fontStyle, textDecoration, fontFamily);
		regionHistory[focusedText[5][0]] = new Array(focusedText[0],focusedText[1]+scrollVectorX,focusedText[2]+scrollVectorY,focusedText[3],focusedText[4],textInfo,focusedText[6]);
		focusedText = new Array();
    }
    if(focusedImage && focusedImage.length>5){
		jg.restoreHiddenCanvas(1);
		jg.paint();
		regionHistory[focusedImage[5]] = new Array(focusedImage[0],focusedImage[1]+scrollVectorX,focusedImage[2]+scrollVectorY,focusedImage[3],focusedImage[4],focusedImage[5]);
		focusedImage = new Array();
    }

}

function move(evt){
	if(++counter%2 == 0) return true;
	if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){	
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		jg.restoreHiddenCanvas(0);
		jg.setColor("#00FF00");
	    jg.setStroke(1);    
	    var w = x1-x;
		var h = y1-y;
		if(tool_selected == 0) jg.drawRect(x-canvas_x, y-canvas_y, w, h);
		if(tool_selected == 1) jg.drawEllipse2(x-canvas_x, y-canvas_y, w, h);
		jg.paint();
		left = x;
		top = y;
		width = w;
		height = h;
		idd = curFigureId;
		return true;
	}
}

function drags(evt){
	t_x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	t_y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
	drags_imp(t_x,t_y);
	return true;
}

function drags_imp(t_x1, t_y1){
	lostFocus();
	x = t_x1;
	y = t_y1;
	x1=x;y1=y;
	dragapproved=true;
	jg.storeHiddenCanvas(0);
}

function release(evt){
	dragapproved=false;
	if(x==x1 || y==y1) return;
    if(tool_selected == 0) focusedObject = new Array("rect",left,top,width,height,curFigureId++);
    if(tool_selected == 1) focusedObject = new Array("ellipse",left,top,width,height,curFigureId++);
        convertObjectToBezier();
        saveBezToUndoRedoLog("delete");
        bezierModified=false;
        createFocusedBezDiv(focusedBez);
        sendObject(focusedBez,"insert");
		x=0;y=0;x1=0;y1=0;        
        focusedObject = new Array();
        drawFocusedBez();
	return true;
}

function selectRegion(evt){
	if (evt?(evt.button==65535 || evt.button == 0):event.button==1){		
		var x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		var y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		selectRegion_imp(x1,y1);
	}
}

function selectRegion_imp(xx1, yy1){
		var shapeArea=2000000000;
                var shapeDist=2000000000;
		var selectedShape=-1;
                var selectedShapeByOutline = -1;
		for(var i=0;i<regionHistory.length;i++){
		  if(regionHistory[i] && (xx1+scrollVectorX-regionHistory[i][1])*(regionHistory[i][1]+regionHistory[i][3]-(xx1+scrollVectorX))>=0 && (yy1+scrollVectorY-regionHistory[i][2])*(regionHistory[i][2]+regionHistory[i][4]-(yy1+scrollVectorY))>=0){
		    var tempArea = Math.abs(regionHistory[i][3])*Math.abs(regionHistory[i][4]);

                    if(regionHistory[i][0]=='bezier'){//selection by line
                        var bezInfo = new Array(regionHistory[i][5][0],new Array(regionHistory[i][5][1][0],regionHistory[i][5][1][1],regionHistory[i][5][1][2],regionHistory[i][5][1][3],regionHistory[i][5][1][4],regionHistory[i][5][1][5],regionHistory[i][5][1][6]), new Array(regionHistory[i][5][2][0],regionHistory[i][5][2][1],regionHistory[i][5][2][2]));
						var fObj = new Array(regionHistory[i][0],regionHistory[i][1]-scrollVectorX,regionHistory[i][2]-scrollVectorY,regionHistory[i][3],regionHistory[i][4],bezInfo);
						for(var ii=6;ii<regionHistory[i].length;ii++){
						  fObj[ii] = new Array();
						  fObj[ii][p] = new Array();
						  fObj[ii][m] = new Array();
						  fObj[ii][r] = new Array();
						  fObj[ii][p][0] = regionHistory[i][ii][p][0]-scrollVectorX;
						  fObj[ii][p][1] = regionHistory[i][ii][p][1]-scrollVectorY;
						  fObj[ii][m][0] = regionHistory[i][ii][m][0]-scrollVectorX;
						  fObj[ii][m][1] = regionHistory[i][ii][m][1]-scrollVectorY;
						  fObj[ii][r][0] = regionHistory[i][ii][r][0]-scrollVectorX;
						  fObj[ii][r][1] = regionHistory[i][ii][r][1]-scrollVectorY;
						  fObj[ii][couple] = regionHistory[i][ii][couple];
						  fObj[ii][termProp] = regionHistory[i][ii][termProp];
						  fObj[ii][line] = regionHistory[i][ii][line];
					    }	

                                var tempDist = pointToObjDist(xx1,yy1,fObj);
				if(tempDist<shapeDist){
				  shapeDist = tempDist;
                                  selectedShapeByOutline = i;
                                }
                                
                    }
		    if(tempArea<shapeArea){
				shapeArea=tempArea;
				selectedShape = i;
		    }                    
		  }
		}		
                if(shapeDist<=5){
                  selectedShape = selectedShapeByOutline;
                }

		if(selectedShape!=-1){
			idd = selectedShape;
			jg.restoreHiddenCanvas(1);
			jg.storeHiddenCanvas(0);
			lostFocus();
			if(regionHistory[selectedShape][0]=='bezier'){
                                var bezInfo = new Array(regionHistory[selectedShape][5][0],new Array(regionHistory[selectedShape][5][1][0],regionHistory[selectedShape][5][1][1],regionHistory[selectedShape][5][1][2],regionHistory[selectedShape][5][1][3],regionHistory[selectedShape][5][1][4],regionHistory[selectedShape][5][1][5],regionHistory[selectedShape][5][1][6]), new Array(regionHistory[selectedShape][5][2][0],regionHistory[selectedShape][5][2][1],regionHistory[selectedShape][5][2][2]));
				focusedBez = new Array(regionHistory[selectedShape][0],regionHistory[selectedShape][1]-scrollVectorX,regionHistory[selectedShape][2]-scrollVectorY,regionHistory[selectedShape][3],regionHistory[selectedShape][4],bezInfo);
				for(var i=6;i<regionHistory[selectedShape].length;i++){
				  focusedBez[i] = new Array();
				  focusedBez[i][p] = new Array();
				  focusedBez[i][m] = new Array();
				  focusedBez[i][r] = new Array();
				  focusedBez[i][p][0] = regionHistory[selectedShape][i][p][0]-scrollVectorX;
				  focusedBez[i][p][1] = regionHistory[selectedShape][i][p][1]-scrollVectorY;
				  focusedBez[i][m][0] = regionHistory[selectedShape][i][m][0]-scrollVectorX;
				  focusedBez[i][m][1] = regionHistory[selectedShape][i][m][1]-scrollVectorY;
				  focusedBez[i][r][0] = regionHistory[selectedShape][i][r][0]-scrollVectorX;
				  focusedBez[i][r][1] = regionHistory[selectedShape][i][r][1]-scrollVectorY;
				  focusedBez[i][couple] = regionHistory[selectedShape][i][couple];
				  focusedBez[i][termProp] = regionHistory[selectedShape][i][termProp];
				  focusedBez[i][line] = regionHistory[selectedShape][i][line];
			        }	
				mousee = new Array(); reflected = new Array(); node = new Array();
				createFocusedBezDiv(focusedBez);

				  //This section needs for user is able to move bezier object after picking it without targeting to central cross                                
				left = focusedBez[1];
				top = focusedBez[2];		
				width = focusedBez[3];
				height = focusedBez[4];
				idd = focusedBez[5][0];
   		                y=yy1;
                		x=xx1;
				saveBezToUndoRedoLog('selection');
                                if(pointingToBez==focusedBez[5][0]){
                                  drawFocusedBezRot();
                                }
				else{
                                  focusedMobilePointNum=8;					
				  drawFocusedBez();
				  hitBezFocusImp(0,0);
				}
				  //End of the section
			}
			else if(regionHistory[selectedShape][0]=='text'){

                                var textInfo = new Array(regionHistory[selectedShape][5][0], regionHistory[selectedShape][5][1], regionHistory[selectedShape][5][2], regionHistory[selectedShape][5][3], regionHistory[selectedShape][5][4], regionHistory[selectedShape][5][5], regionHistory[selectedShape][5][6]);
				focusedText = new Array(regionHistory[selectedShape][0],regionHistory[selectedShape][1]-scrollVectorX,regionHistory[selectedShape][2]-scrollVectorY,regionHistory[selectedShape][3],regionHistory[selectedShape][4],textInfo,regionHistory[selectedShape][6]);


				strokeColor	= focusedText[5][text_color];
				fontSize	= focusedText[5][text_size];
				fontWeight	= focusedText[5][text_weight];
				fontStyle	= focusedText[5][text_style];
				textDecoration = focusedText[5][text_decoration];
				fontFamily	= focusedText[5][text_family];                        


				left = focusedText[1];
				top = focusedText[2];				
				width = focusedText[3];                      
				height = focusedText[4];
			
				setTextState();
				saveTextToUndoRedoLog('selection');
				drawFocusedText();
			}
			else if(regionHistory[selectedShape][0]=='image'){
				focusedImage = new Array(regionHistory[selectedShape][0],regionHistory[selectedShape][1]-scrollVectorX,regionHistory[selectedShape][2]-scrollVectorY,regionHistory[selectedShape][3],regionHistory[selectedShape][4],selectedShape);
				left = focusedImage[1];
				top = focusedImage[2];		
				width = focusedImage[3];
				height = focusedImage[4];
				idd = focusedImage[5];
   		                y=yy1;
                		x=xx1;
                                focusedMobilePointNum=8;					
				saveImageToUndoRedoLog('selection');
				drawFocusedImage();
				hitImageFocusImp(0,0);
			}			
		}
		else{
			lostFocus();
			jg.paint();
		}

}

function clearr(){
  	jg.clear();
	jg.storeHiddenCanvas(0);
	jg.storeHiddenCanvas(1);
    jg.storeHiddenCanvas(2);
	jg.storeHiddenCanvas(3);
	jg.storeHiddenCanvas(4);
	//regionHistory = new Array();
}



function dummy(){}



function drawMobilePoints(num,x,y,w,h){
  mobilePoint[num]=new Array(x,y,w,h);
  jg.fillRect(x,y,w,h);
}

function drawMobileCenter(x,y,width,height){
  jg.setStroke(3);
  mobilePoint[8] = new Array((2*x+width-2*canvas_x)/2-6,(2*y+height-2*canvas_y)/2-6,10,10);
  jg.drawLine(mobilePoint[8][0],mobilePoint[8][1],mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1]+mobilePoint[8][3]);
  jg.drawLine(mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1],mobilePoint[8][0],mobilePoint[8][1]+mobilePoint[8][3]);
}


function setHandlersSet(i){

  if (eventHandler[i]) {

	if(eventHandler[curEventHandler]["onmousedown"]) removeEvent("onmousedown",eventHandler[curEventHandler]["onmousedown"]);
	if(eventHandler[curEventHandler]["onmouseup"]) removeEvent("onmouseup",eventHandler[curEventHandler]["onmouseup"]);
	if(eventHandler[curEventHandler]["onmousemove"]) removeEvent("onmousemove",eventHandler[curEventHandler]["onmousemove"]);
        if(eventHandler[curEventHandler]["onkeypress"]) removeEventDocument("onkeypress",eventHandler[curEventHandler]["onkeypress"]);
        if(eventHandler[curEventHandler]["onkeydown"]) removeEventDocument("onkeydown",eventHandler[curEventHandler]["onkeydown"]);
        if(eventHandler[curEventHandler]["onkeyup"]) removeEventDocument("onkeyup",eventHandler[curEventHandler]["onkeyup"]);
        if(eventHandler[curEventHandler]["ondblclick"]) removeEvent("ondblclick",eventHandler[curEventHandler]["ondblclick"]);
        if(eventHandler[curEventHandler]["onclick"]) removeEvent("onclick",eventHandler[curEventHandler]["onclick"]);



	if(eventHandler[i]["onmousedown"]) setEvent("onmousedown",eventHandler[i]["onmousedown"]);
	if(eventHandler[i]["onmouseup"]) setEvent("onmouseup",eventHandler[i]["onmouseup"]);
	if(eventHandler[i]["onmousemove"]) setEvent("onmousemove",eventHandler[i]["onmousemove"]);
	if(eventHandler[i]["onkeypress"]) setEventDocument("onkeypress",eventHandler[i]["onkeypress"]);
        if(eventHandler[i]["onkeydown"]) setEventDocument("onkeydown",eventHandler[i]["onkeydown"]);
        if(eventHandler[i]["onkeyup"]) setEventDocument("onkeyup",eventHandler[i]["onkeyup"]);
        if(eventHandler[i]["ondblclick"]) setEvent("ondblclick",eventHandler[i]["ondblclick"]);
        if(eventHandler[i]["onclick"]) setEvent("onclick",eventHandler[i]["onclick"]);

	curEventHandler=i;
  }
}




function setEvent(evt,funcStr){
	if(document.all){	
	    eval(canvasId+"."+evt+"="+funcStr);
	}else if(window.opera){
	    canvas.attachEvent(evt,eval(funcStr));
	    eval(canvasId+"."+evt+"="+funcStr);
        }
	else{
		canvas.addEventListener(evt.substring(2),eval(funcStr),false);
	}
}

function removeEvent(evt, funcStr){
	if(document.all){
		eval(canvasId+"."+evt+"="+"''");
	}
        else if(window.opera){
           canvas.detachEvent(evt,eval(funcStr));
        }
	else{
		canvas.removeEventListener(evt.substring(2),eval(funcStr),false);
	}
}

function setEventDocument(evt,funcStr){
	if(document.all){	
	    eval("document.body."+evt+"="+funcStr);

	}
	else if (window.opera){
	    eval("document.body."+evt+"="+funcStr);
	}
	else{
		document.addEventListener(evt.substring(2),eval(funcStr),false);
	}
}

function removeEventDocument(evt, funcStr){
	if(document.all || window.opera){
		eval("document.body."+evt+"="+"''");
	}
	else if(window.opera){
	    eval("document.body."+evt+"="+"''");
	}
	else{
		document.removeEventListener(evt.substring(2),eval(funcStr),false);
	}
}



function convertObjectToBezier(){
  var bezInfo = new Array(curFigureId++,new Array(strokeColor,strokeWidth,strokeOpacity,strokeDasharray,strokeLinecap,strokeLinejoin,strokeMiterlimit),new Array(fillColor,fillOpacity,fillRule));
  focusedBez = new Array("bezier",focusedObject[1],focusedObject[2],focusedObject[3],focusedObject[4],bezInfo);
  mousee = new Array();
  reflected = new Array();
  node = new Array();
  if(focusedObject[0]=="rect"){
      focusedBez[6] = new Array();focusedBez[7] = new Array();focusedBez[8] = new Array();focusedBez[9] = new Array();
      focusedBez[6] = new Array();
      focusedBez[6][p] = new Array(focusedObject[1],focusedObject[2]);
      focusedBez[6][m] = new Array(focusedObject[1],focusedObject[2]);
      focusedBez[6][r] = new Array(focusedObject[1],focusedObject[2]);
      focusedBez[6][couple] = true;
      focusedBez[6][termProp] = 0;
      focusedBez[6][line] = 1;

      focusedBez[7] = new Array();
      focusedBez[7][p] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]);
      focusedBez[7][m] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]);
      focusedBez[7][r] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]);
      focusedBez[7][couple] = true;
      focusedBez[7][termProp] = 0;
      focusedBez[7][line] = 1;

      focusedBez[8] = new Array();
      focusedBez[8][p] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
      focusedBez[8][m] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
      focusedBez[8][r] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
      focusedBez[8][couple] = true;
      focusedBez[8][termProp] = 0;
      focusedBez[8][line] = 1;

      focusedBez[9] = new Array();
      focusedBez[9][p] = new Array(focusedObject[1],focusedObject[2]+focusedObject[4]);
      focusedBez[9][m] = new Array(focusedObject[1],focusedObject[2]+focusedObject[4]);
      focusedBez[9][r] = new Array(focusedObject[1],focusedObject[2]+focusedObject[4]);
      focusedBez[9][couple] = true;
      focusedBez[9][termProp] = 1;
      focusedBez[9][line] = 1;

  }
  else if(focusedObject[0]=="ellipse"){
    var magicConst = 0.2761423749154;
      focusedBez[6] = new Array();focusedBez[7] = new Array();focusedBez[8] = new Array();focusedBez[9] = new Array();
      focusedBez[6][p] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2),focusedObject[2]);
      focusedBez[6][m] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2+focusedObject[3]*magicConst),focusedObject[2]);
      focusedBez[6][r] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2-focusedObject[3]*magicConst),focusedObject[2]);
      focusedBez[6][couple] = true;
      focusedBez[6][termProp] = 0;
      focusedBez[6][line] = 0;


      focusedBez[7][p] = new Array(focusedObject[1]+focusedObject[3],Math.floor((2*focusedObject[2]+focusedObject[4])/2));
      focusedBez[7][m] = new Array(focusedObject[1]+focusedObject[3],Math.floor((2*focusedObject[2]+focusedObject[4])/2+focusedObject[4]*magicConst));
      focusedBez[7][r] = new Array(focusedObject[1]+focusedObject[3],Math.floor((2*focusedObject[2]+focusedObject[4])/2-focusedObject[4]*magicConst));
      focusedBez[7][couple] = true;
      focusedBez[7][termProp] = 0;
      focusedBez[7][line] = 0;

      focusedBez[8][p] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2),focusedObject[2]+focusedObject[4]);
      focusedBez[8][m] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2-focusedObject[3]*magicConst),focusedObject[2]+focusedObject[4]);
      focusedBez[8][r] = new Array(Math.floor((2*focusedObject[1]+focusedObject[3])/2+focusedObject[3]*magicConst),focusedObject[2]+focusedObject[4]);
      focusedBez[8][couple] = true;
      focusedBez[8][termProp] = 0;
      focusedBez[8][line] = 0;

      focusedBez[9][p] = new Array(focusedObject[1],Math.floor((2*focusedObject[2]+focusedObject[4])/2));
      focusedBez[9][m] = new Array(focusedObject[1],Math.floor((2*focusedObject[2]+focusedObject[4])/2-focusedObject[4]*magicConst));
      focusedBez[9][r] = new Array(focusedObject[1],Math.floor((2*focusedObject[2]+focusedObject[4])/2+focusedObject[4]*magicConst));
      focusedBez[9][couple] = true;
      focusedBez[9][termProp] = 1;
      focusedBez[9][line] = 0;
    
  }
}

function toolHooker(current_tool){

	if(focusedText && focusedText.length > 6){
		textarea = document.getElementById('textarea_'+focusedText[5][0]);	
		if(textarea != null){
		if(textCommandType == 'insert'){	
			  regionHistory[focusedText[5][0]] = new Array();
			  focusedText = new Array();
			  mobilePoint = new Array();
			  focusedmobilePointNum = -1;
			}
			  clearr();
			  x=0;y=0;x1=0;y1=0;
		}
	}
	
	if(current_tool != 6 && focusedBez && focusedBez.length > 6) {
	  finishBezier();
	}
	
	
}

function toolHoockerBefore(){
    if (polylineSteps && polylineSteps.length > 0) {
       finishPoly();
    }
}

function f_clientWidth() {
	return f_filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function applycurrentColor(itemColor){
	// update focusedBez array
	var chFlag = 0;

	if(focusedBez && focusedBez.length >=5){

		if(itemColor == 'strokeColor' && (focusedBez[5][stroke][stroke_color] != eval(itemColor)
		|| focusedBez[5][stroke][stroke_opacity] != strokeOpacity
		|| focusedBez[5][stroke][stroke_width] != strokeWidth
		|| focusedBez[5][stroke][stroke_dasharray] != strokeDasharray
		|| focusedBez[5][stroke][stroke_linecap] != strokeLinecap
		|| focusedBez[5][stroke][stroke_linejoin] != strokeLinejoin
		|| focusedBez[5][stroke][stroke_miterlimit] != strokeMiterlimit)){
			focusedBez[5][stroke][stroke_color] = strokeColor;
			focusedBez[5][stroke][stroke_opacity] = strokeOpacity;			
			focusedBez[5][stroke][stroke_width] = strokeWidth;
			focusedBez[5][stroke][stroke_dasharray] = strokeDasharray;
			focusedBez[5][stroke][stroke_linecap] = strokeLinecap;
			focusedBez[5][stroke][stroke_linejoin] = strokeLinejoin;
			focusedBez[5][stroke][stroke_miterlimit] = strokeMiterlimit;
			chFlag = 1;
		}else if (itemColor == 'fillColor' && (focusedBez[5][fill][fill_color] != eval(itemColor)
		|| focusedBez[5][fill][fill_opacity] != fillOpacity
		|| focusedBez[5][fill][fill_rule] != fillRule)){
			focusedBez[5][fill][fill_color] = fillColor;
			focusedBez[5][fill][fill_opacity] = fillOpacity;
			focusedBez[5][fill][fill_rule] = fillRule;
			chFlag = 1;
		}
		if(chFlag){
			saveBezToUndoRedoLog("update");
			sendObject(focusedBez,"update");
		}
	}
	
	if(focusedText && focusedText.length >= 5 && (itemColor == 'strokeColor' && focusedText[5][text_color] != eval(itemColor))){
		focusedText[5][text_color] = strokeColor;
		sendObject(focusedText,"update");
		saveTextToUndoRedoLog("update");
	}		
	// end update
}