var polylineSteps = new Array();
var focusedPoly = new Array();

function downLine(evt){	
	downLineImp(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop());
}

function downLineImp(t_x,t_y){
	lostFocus();
	x = t_x; y=t_y;
	x1=t_x; y1=t_y;
	dragapproved=true;
	jg.storeHiddenCanvas(0);
	return true;
}

function moveLine(evt){
	if(++counter%2 == 0) return true;
	if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){	
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		jg.restoreHiddenCanvas(0);
		jg.setColor("#00FF00");
	    jg.setStroke(1);    
		jg.drawLine2(x-canvas_x, y-canvas_y, x1-canvas_x, y1-canvas_y);
		jg.paint();
		left = x;
		top = y;
		width = x1-x;
		height = y1-y;
		idd = curFigureId;
		return true;
	}
}

function releaseLine(evt){
	dragapproved=false;
	if(x!=x1 || y!=y1){
	    focusedObject = new Array("line",left,top,width,height,curFigureId++);
	    convertLineToBezier();
            saveBezToUndoRedoLog("delete");
            bezierModified=false;
            createFocusedBezDiv(focusedBez);
            sendObject(focusedBez,"insert");
	    x=0;y=0;x1=0;y1=0;        
            focusedObject = new Array();
	    x=0;y=0;x1=0;y1=0;
            drawFocusedBez();
	}
	return true;
}

function downPolyline(evt){
  downPolylineImp(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop(),(evt?(evt.button):event.button));
}

function downPolylineImp(tx,ty,button){
	var curStep = polylineSteps.length;
	if(curStep == 0){lostFocus(); left = 65530; top = 65530; width = 0; height = 0;jg.storeHiddenCanvas(0);curFigureId;}
        jg.clear();
	jg.storeHiddenCanvas(4);
	polylineSteps[curStep] = new Array();
	polylineSteps[curStep][0] = tx;
	polylineSteps[curStep][1] = ty;			
	if(button==2){//right button pressed
	  finishPoly();
	}
	else{
	  if(tool_selected==4){focusedPoly = new Array("polyline",0,0,0,0,curFigureId);}
	  if(tool_selected==5){
		  focusedPoly = new Array("polygon",0,0,0,0,curFigureId);
		  jg.drawLine2(polylineSteps[polylineSteps.length-1][0]-canvas_x, polylineSteps[polylineSteps.length-1][1]-canvas_y, polylineSteps[0][0]-canvas_x, polylineSteps[0][1]-canvas_y);
	  }
	  for(var i=0;i<polylineSteps.length;i++){
		  curStep = focusedPoly.length;
		  focusedPoly[curStep] = new Array();
		  focusedPoly[curStep][0] = polylineSteps[i][0];
		  focusedPoly[curStep][1] = polylineSteps[i][1];
	  }
	  calculateLTWH();focusedPoly[1] = left;focusedPoly[2] = top; focusedPoly[3] = width; focusedPoly[4] = height;
	  convertPolyToBezier();
          calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
          if(polylineSteps.length>2){
            saveBezToUndoRedoLog("update");
            sendObject(focusedBez,"update");                    
	  }
	  else if(polylineSteps.length==2){
            saveBezToUndoRedoLog("delete");
            sendObject(focusedBez,"insert");          
          }
        }
	return true;
}


function calculateLTWH(){
	 var x_min = 65530;
	 var y_min = 65530;
	 var x_max = 0;
	 var y_max = 0;
	 for(var i=6;i<focusedPoly.length;i++){
		   if(focusedPoly[i][0]<x_min)x_min = focusedPoly[i][0];
   		   if(focusedPoly[i][1]<y_min)y_min = focusedPoly[i][1];
		   if(focusedPoly[i][0]>x_max)x_max = focusedPoly[i][0];
   		   if(focusedPoly[i][1]>y_max)y_max = focusedPoly[i][1];
	 }
	 left = x_min;
	 top = y_min;
	 width = x_max-x_min;
	 height = y_max-y_min;
}

function movePolyline(evt){
	if(++counter%2 != 0 && polylineSteps.length>0){
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		jg.restoreHiddenCanvas(4);
		jg.setColor("#00FF00");
	    jg.setStroke(1);  
		var curStep = polylineSteps.length-1;				
		jg.drawLine2(polylineSteps[curStep][0]-canvas_x, polylineSteps[curStep][1]-canvas_y, x1-canvas_x, y1-canvas_y);
		if(tool_selected==5){jg.drawLine2(polylineSteps[0][0]-canvas_x, polylineSteps[0][1]-canvas_y, x1-canvas_x, y1-canvas_y);}
		jg.paint();
		left = x;
		top = y;
		width = x1-x;
		height = y1-y;
		idd = curFigureId;		
	}
	return true;
}


function finishPoly(){
	  if(tool_selected==4){focusedPoly = new Array("polyline",0,0,0,0,curFigureId++);}
	  if(tool_selected==5){
		  focusedPoly = new Array("polygon",0,0,0,0,curFigureId++);
		  jg.drawLine2(polylineSteps[polylineSteps.length-1][0]-canvas_x, polylineSteps[polylineSteps.length-1][1]-canvas_y, polylineSteps[0][0]-canvas_x, polylineSteps[0][1]-canvas_y);
	  }
	  for(var i=0;i<polylineSteps.length;i++){
		  curStep = focusedPoly.length;
		  focusedPoly[curStep] = new Array();
		  focusedPoly[curStep][0] = polylineSteps[i][0];
		  focusedPoly[curStep][1] = polylineSteps[i][1];
	  }
	  polylineSteps = new Array();
	  calculateLTWH();focusedPoly[1] = left;focusedPoly[2] = top; focusedPoly[3] = width; focusedPoly[4] = height;
	  convertPolyToBezier();
          calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
          saveBezToUndoRedoLog("update");
          sendObject(focusedBez,"update");          
          createFocusedBezDiv(focusedBez);
          x=0;y=0;x1=0;y1=0;        
          focusedPoly = new Array();
	  drawFocusedBez();
}

function convertLineToBezier(){
  var objInfo = new Array(focusedObject[5],new Array(strokeColor,strokeWidth,strokeOpacity,strokeDasharray,strokeLinecap,strokeLinejoin,strokeMiterlimit),new Array(fillColor,fillOpacity,fillRule));
  focusedBez = new Array("bezier",focusedObject[1],focusedObject[2],focusedObject[3],focusedObject[4],objInfo);
  focusedBez[6] = new Array();
  focusedBez[6][p] = new Array(focusedObject[1],focusedObject[2]);
  focusedBez[6][m] = new Array(focusedObject[1],focusedObject[2]);
  focusedBez[6][r] = new Array(focusedObject[1],focusedObject[2]);
  focusedBez[6][couple] = true;
  focusedBez[6][termProp] = 0;
  focusedBez[6][line] = 1;

  focusedBez[7] = new Array();
  focusedBez[7][p] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
  focusedBez[7][m] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
  focusedBez[7][r] = new Array(focusedObject[1]+focusedObject[3],focusedObject[2]+focusedObject[4]);
  focusedBez[7][couple] = true;
  focusedBez[7][termProp] = 0;
  focusedBez[7][line] = 1;
}

function processKeyDownPoly(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  //alert(keyCode);
  if(keyCode==27){
    finishPoly();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
}

function convertPolyToBezier(){
  var bezInfo = new Array(focusedPoly[5],new Array(strokeColor,strokeWidth,strokeOpacity,strokeDasharray,strokeLinecap,strokeLinejoin,strokeMiterlimit),new Array(fillColor,fillOpacity,fillRule));
  focusedBez = new Array("bezier",focusedPoly[1],focusedPoly[2],focusedPoly[3],focusedPoly[4],bezInfo);
  for(var i=6;i<focusedPoly.length;i++){
   focusedBez[i] = new Array();
   focusedBez[i][p] = new Array(focusedPoly[i][0], focusedPoly[i][1]);
   focusedBez[i][m] = new Array(focusedPoly[i][0], focusedPoly[i][1]);
   focusedBez[i][r] = new Array(focusedPoly[i][0], focusedPoly[i][1]);
   focusedBez[i][couple] = true;
   focusedBez[i][termProp] = 0;
   focusedBez[i][line] = 1;
  }
  if(focusedPoly[0]=="polygon"){
   focusedBez[focusedPoly.length-1][termProp] = 1;
  }
}