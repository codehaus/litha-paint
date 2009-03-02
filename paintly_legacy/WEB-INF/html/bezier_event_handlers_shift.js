function upperShiftFocusedBez(evt){
     if(++counter%2 == 0) return true;
     if(dragapproved){
     bezierModified = true;
     var x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
     var dx = x1-x;
     bezSteps = new Array();
     var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
     jg.restoreHiddenCanvas(3);
     for(var i=6;i<focusedBez.length;i++){
       bezSteps[i] = new Array();
       bezSteps[i][p] = new Array();
       bezSteps[i][m] = new Array();
       bezSteps[i][r] = new Array();

       var wy = (focusedBez[4]+focusedBez[2]-focusedBez[i][p][1])/focusedBez[4];
       bezSteps[i][p][0] = Math.floor(dx*wy+focusedBez[i][p][0]);
       bezSteps[i][p][1] = focusedBez[i][p][1];

       wy = (focusedBez[4]+focusedBez[2]-focusedBez[i][m][1])/focusedBez[4];
       bezSteps[i][m][0] = Math.floor(dx*wy+focusedBez[i][m][0]);
       bezSteps[i][m][1] = focusedBez[i][m][1];

       wy = (focusedBez[4]+focusedBez[2]-focusedBez[i][r][1])/focusedBez[4];
       bezSteps[i][r][0] = Math.floor(dx*wy+focusedBez[i][r][0]);
       bezSteps[i][r][1] = focusedBez[i][r][1];
     }

     for(var j=7;j<focusedBez.length;j++){
       jg.sketchBezier((bezSteps[j-1][p][0]-canvas_x),(bezSteps[j-1][p][1]-canvas_y),(bezSteps[j-1][m][0]-canvas_x),(bezSteps[j-1][m][1]-canvas_y), (bezSteps[j][r][0]-canvas_x), (bezSteps[j][r][1]-canvas_y),(bezSteps[j][p][0]-canvas_x), (bezSteps[j][p][1]-canvas_y), poppyseed);
     }
     if(focusedBez[focusedBez.length-1][termProp]==1){
       jg.sketchBezier(bezSteps[focusedBez.length-1][p][0]-canvas_x,bezSteps[focusedBez.length-1][p][1]-canvas_y,bezSteps[focusedBez.length-1][m][0]-canvas_x,bezSteps[focusedBez.length-1][m][1]-canvas_y, bezSteps[6][r][0]-canvas_x,bezSteps[6][r][1]-canvas_y,bezSteps[6][p][0]-canvas_x, bezSteps[6][p][1]-canvas_y,poppyseed);
     }
     jg.fillRect(bezSteps[focusedBez.length-1][0]-1-canvas_x,bezSteps[focusedBez.length-1][1]-1-canvas_y,2,2);

     jg.paint();
     }
  
}

function finishShiftFocusedBez(evt){
  if(bezierModified){
        dragapproved=false;
	bezierModified=false;	
	var stepsCount = bezSteps.length;
	for(var i=6;i<stepsCount;i++){
		focusedBez[i][p][0] = bezSteps[i][p][0];
		focusedBez[i][p][1] = bezSteps[i][p][1];
		focusedBez[i][m][0] = bezSteps[i][m][0];
		focusedBez[i][m][1] = bezSteps[i][m][1];
		focusedBez[i][r][0] = bezSteps[i][r][0];
		focusedBez[i][r][1] = bezSteps[i][r][1];
	}
        calculateBezLTWH();
        focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
	bezSteps = new Array();
	sendObject(focusedBez,"update");
	saveBezToUndoRedoLog("update");
        createFocusedBezDiv(focusedBez);
	x=0;y=0;x1=0;y1=0;
	mousee = new Array();
	reflected = new Array();	
	jg.restoreHiddenCanvas(0);
	jg.paint();
  }
  drawFocusedBezRot();
  return false;  
}

function rightShiftFocusedBez(evt){
     if(++counter%2 == 0) return true;
     if(dragapproved){
     bezierModified = true;
     var y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
     var dy = y1-y;
     bezSteps = new Array();
     var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
     jg.restoreHiddenCanvas(3);
     for(var i=6;i<focusedBez.length;i++){
       bezSteps[i] = new Array();
       bezSteps[i][p] = new Array();
       bezSteps[i][m] = new Array();
       bezSteps[i][r] = new Array();

       var wx = (focusedBez[i][p][0]-focusedBez[1])/focusedBez[3];
       bezSteps[i][p][1] = Math.floor(dy*wx+focusedBez[i][p][1]);
       bezSteps[i][p][0] = focusedBez[i][p][0];

       wx = (focusedBez[i][m][0]-focusedBez[1])/focusedBez[3];
       bezSteps[i][m][1] = Math.floor(dy*wx+focusedBez[i][m][1]);
       bezSteps[i][m][0] = focusedBez[i][m][0];

       wx = (focusedBez[i][r][0]-focusedBez[1])/focusedBez[3];
       bezSteps[i][r][1] = Math.floor(dy*wx+focusedBez[i][r][1]);
       bezSteps[i][r][0] = focusedBez[i][r][0];
     }

     for(var j=7;j<focusedBez.length;j++){
       jg.sketchBezier((bezSteps[j-1][p][0]-canvas_x),(bezSteps[j-1][p][1]-canvas_y),(bezSteps[j-1][m][0]-canvas_x),(bezSteps[j-1][m][1]-canvas_y), (bezSteps[j][r][0]-canvas_x), (bezSteps[j][r][1]-canvas_y),(bezSteps[j][p][0]-canvas_x), (bezSteps[j][p][1]-canvas_y), poppyseed);
     }
     if(focusedBez[focusedBez.length-1][termProp]==1){
       jg.sketchBezier(bezSteps[focusedBez.length-1][p][0]-canvas_x,bezSteps[focusedBez.length-1][p][1]-canvas_y,bezSteps[focusedBez.length-1][m][0]-canvas_x,bezSteps[focusedBez.length-1][m][1]-canvas_y, bezSteps[6][r][0]-canvas_x,bezSteps[6][r][1]-canvas_y,bezSteps[6][p][0]-canvas_x, bezSteps[6][p][1]-canvas_y,poppyseed);
     }
     jg.fillRect(bezSteps[focusedBez.length-1][0]-1-canvas_x,bezSteps[focusedBez.length-1][1]-1-canvas_y,2,2);
     jg.paint();
     }
  
}

function bottomShiftFocusedBez(evt){
     if(++counter%2 == 0) return true;
     if(dragapproved){
     bezierModified = true;
     var x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
     var dx = x1-x;
     bezSteps = new Array();
     var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
     jg.restoreHiddenCanvas(3);
     for(var i=6;i<focusedBez.length;i++){
       bezSteps[i] = new Array();
       bezSteps[i][p] = new Array();
       bezSteps[i][m] = new Array();
       bezSteps[i][r] = new Array();

       var wy = (focusedBez[i][p][1]-focusedBez[2])/focusedBez[4];
       bezSteps[i][p][0] = Math.floor(dx*wy+focusedBez[i][p][0]);
       bezSteps[i][p][1] = focusedBez[i][p][1];

       wy = (focusedBez[i][m][1]-focusedBez[2])/focusedBez[4];
       bezSteps[i][m][0] = Math.floor(dx*wy+focusedBez[i][m][0]);
       bezSteps[i][m][1] = focusedBez[i][m][1];

       wy = (focusedBez[i][r][1]-focusedBez[2])/focusedBez[4];
       bezSteps[i][r][0] = Math.floor(dx*wy+focusedBez[i][r][0]);
       bezSteps[i][r][1] = focusedBez[i][r][1];
     }

     for(var j=7;j<focusedBez.length;j++){
       jg.sketchBezier((bezSteps[j-1][p][0]-canvas_x),(bezSteps[j-1][p][1]-canvas_y),(bezSteps[j-1][m][0]-canvas_x),(bezSteps[j-1][m][1]-canvas_y), (bezSteps[j][r][0]-canvas_x), (bezSteps[j][r][1]-canvas_y),(bezSteps[j][p][0]-canvas_x), (bezSteps[j][p][1]-canvas_y), poppyseed);
     }
     if(focusedBez[focusedBez.length-1][termProp]==1){
       jg.sketchBezier(bezSteps[focusedBez.length-1][p][0]-canvas_x,bezSteps[focusedBez.length-1][p][1]-canvas_y,bezSteps[focusedBez.length-1][m][0]-canvas_x,bezSteps[focusedBez.length-1][m][1]-canvas_y, bezSteps[6][r][0]-canvas_x,bezSteps[6][r][1]-canvas_y,bezSteps[6][p][0]-canvas_x, bezSteps[6][p][1]-canvas_y,poppyseed);
     }
     jg.fillRect(bezSteps[focusedBez.length-1][0]-1-canvas_x,bezSteps[focusedBez.length-1][1]-1-canvas_y,2,2);

     jg.paint();
     }
  
}


function leftShiftFocusedBez(evt){
     if(++counter%2 == 0) return true;
     if(dragapproved){
     bezierModified = true;
     var y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
     var dy = y1-y;
     bezSteps = new Array();
     var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
     jg.restoreHiddenCanvas(3);
     for(var i=6;i<focusedBez.length;i++){
       bezSteps[i] = new Array();
       bezSteps[i][p] = new Array();
       bezSteps[i][m] = new Array();
       bezSteps[i][r] = new Array();

       var wx = (focusedBez[3]+focusedBez[1]-focusedBez[i][p][0])/focusedBez[3];
       bezSteps[i][p][1] = Math.floor(dy*wx+focusedBez[i][p][1]);
       bezSteps[i][p][0] = focusedBez[i][p][0];

       wx = (focusedBez[3]+focusedBez[1]-focusedBez[i][m][0])/focusedBez[3];
       bezSteps[i][m][1] = Math.floor(dy*wx+focusedBez[i][m][1]);
       bezSteps[i][m][0] = focusedBez[i][m][0];

       wx = (focusedBez[3]+focusedBez[1]-focusedBez[i][r][0])/focusedBez[3];
       bezSteps[i][r][1] = Math.floor(dy*wx+focusedBez[i][r][1]);
       bezSteps[i][r][0] = focusedBez[i][r][0];
     }

     for(var j=7;j<focusedBez.length;j++){
       jg.sketchBezier((bezSteps[j-1][p][0]-canvas_x),(bezSteps[j-1][p][1]-canvas_y),(bezSteps[j-1][m][0]-canvas_x),(bezSteps[j-1][m][1]-canvas_y), (bezSteps[j][r][0]-canvas_x), (bezSteps[j][r][1]-canvas_y),(bezSteps[j][p][0]-canvas_x), (bezSteps[j][p][1]-canvas_y), poppyseed);
     }
     if(focusedBez[focusedBez.length-1][termProp]==1){
       jg.sketchBezier(bezSteps[focusedBez.length-1][p][0]-canvas_x,bezSteps[focusedBez.length-1][p][1]-canvas_y,bezSteps[focusedBez.length-1][m][0]-canvas_x,bezSteps[focusedBez.length-1][m][1]-canvas_y, bezSteps[6][r][0]-canvas_x,bezSteps[6][r][1]-canvas_y,bezSteps[6][p][0]-canvas_x, bezSteps[6][p][1]-canvas_y,poppyseed);
     }
     jg.fillRect(bezSteps[focusedBez.length-1][0]-1-canvas_x,bezSteps[focusedBez.length-1][1]-1-canvas_y,2,2);

     jg.paint();
     }
  
}
