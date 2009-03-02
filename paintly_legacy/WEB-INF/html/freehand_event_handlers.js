var penSteps = new Array();
var focusedPen = new Array();

function downPen(evt){	
	downPenImp(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop());
}

function downPenImp(t_x,t_y){
	lostFocus();
	x = t_x; y=t_y;
	x1=t_x; y1=t_y;
	dragapproved=true;
	jg.storeHiddenCanvas(0);
	return true;
}

function movePen(evt){

	if(++counter%2 != 0) return true;
	if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){
		var x2=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		var y2=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		jg.setColor("#00FF00");
	        jg.setStroke(1);
		jg.drawLine(x1-canvas_x, y1-canvas_y, x2-canvas_x, y2-canvas_y);
		jg.paint();
		left = x;
		top = y;
		width = x1-x;
		height = y1-y;
		idd = curFigureId;
                x1 = x2;
		y1 = y2;
	        var curStep = penSteps.length;
   	        penSteps[curStep] = new Array();
	        penSteps[curStep][0] = x2;
	        penSteps[curStep][1] = y2;			

	}
	return true;
}

function releasePen(evt){
        if(x==x1 && y==y1) return;
	dragapproved=false;
	if(tool_selected==8){
   	  focusedPen = new Array("pen",0,0,0,0,curFigureId++);
        }
        if(tool_selected==9){
	  focusedPen = new Array("lasso",0,0,0,0,curFigureId++);
	}
	for(var i=0;i<penSteps.length;i++){
	  curStep = focusedPen.length;
	  focusedPen[curStep] = new Array();
	  focusedPen[curStep][0] = penSteps[i][0];
	  focusedPen[curStep][1] = penSteps[i][1];
	}
	penSteps = new Array();
	calculatePenLTWH();focusedPen[1] = left;focusedPen[2] = top; focusedPen[3] = width; focusedPen[4] = height;
	x=0;y=0;x1=0;y1=0;
          convertFreehandToBezier();
	  calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
	  if(focusedBez.length>6){
            saveBezToUndoRedoLog("delete");
            bezierModified=false;
            createFocusedBezDiv(focusedBez);
            sendObject(focusedBez,"insert");
          }
          focusedPen = new Array();
          drawFocusedBez();
	return true;
}

function calculatePenLTWH(){
	 var x_min = 65530;
	 var y_min = 65530;
	 var x_max = 0;
	 var y_max = 0;
	 for(var i=6;i<focusedPen.length;i++){
		   if(focusedPen[i][0]<x_min)x_min = focusedPen[i][0];
   		   if(focusedPen[i][1]<y_min)y_min = focusedPen[i][1];
		   if(focusedPen[i][0]>x_max)x_max = focusedPen[i][0];
   		   if(focusedPen[i][1]>y_max)y_max = focusedPen[i][1];
	 }
	 left = x_min;
	 top = y_min;
	 width = x_max-x_min;
	 height = y_max-y_min;
}

var deriviateX = new Array();
var deriviateY = new Array();

function convertFreehandToBezier(){
  if(focusedPen.length>8){
  focusedBez = new Array();
  deriviateX = new Array();
  deriviateY = new Array();
  for(var i=6;i<focusedPen.length-1;i++){
    var l = deriviateX.length;
    deriviateX[l] = focusedPen[i+1][0]-focusedPen[i][0];
    deriviateY[l] = focusedPen[i+1][1]-focusedPen[i][1];
  }

  var nodePoints = new Array();
  var dx = (focusedPen[7][0]-focusedPen[6][0]);
  var dy = (focusedPen[7][1]-focusedPen[6][1]);
  var dl = Math.sqrt(dx*dx+dy*dy);
  if(dl==0){
    dl=0.01;
  }
  nodePoints[0] = new Array();
  nodePoints[0][0]=focusedPen[6][0];
  nodePoints[0][1]=focusedPen[6][1];
  nodePoints[0][2]=dx/dl;      
  nodePoints[0][3]=dy/dl;
  
  var threshold = Math.max(focusedPen[3],focusedPen[4])/12;
  
  for(var i=1;i<deriviateX.length-1;i++){
    var xx = deriviateX[i]-deriviateX[i-1];
    var yx = deriviateY[i]-deriviateY[i-1];
    if(xx!=0 || yx!=0){
      var l = nodePoints.length-1;
      var distance = Math.sqrt((focusedPen[i+6][0]-nodePoints[l][0])*(focusedPen[i+6][0]-nodePoints[l][0])+(focusedPen[i+6][1]-nodePoints[l][1])*(focusedPen[i+6][1]-nodePoints[l][1]));

      if(distance>threshold){
        jg.drawEllipse(focusedPen[i+6][0]-1-canvas_x,focusedPen[i+6][1]-1-canvas_y,2,2);
        dx = (focusedPen[i+7][0]-focusedPen[i+5][0]);
        dy = (focusedPen[i+7][1]-focusedPen[i+5][1]);
        dl = Math.sqrt(dx*dx+dy*dy);
        if(dl==0){
          dl=0.01;
        } 
        var l = nodePoints.length;
        nodePoints[l] = new Array();
        nodePoints[l][0]=focusedPen[i+6][0];
        nodePoints[l][1]=focusedPen[i+6][1];
        nodePoints[l][2]=dx/dl;      
        nodePoints[l][3]=dy/dl;
      }
    }
  }
  var l = nodePoints.length;
  var l2 = focusedPen.length-1;
  dx = (focusedPen[l2][0]-focusedPen[l2-1][0]);
  dy = (focusedPen[l2][1]-focusedPen[l2-1][1]);
  dl = Math.sqrt(dx*dx+dy*dy);
  if(dl==0){
    dl=0.01;
  }
  nodePoints[l] = new Array();
  nodePoints[l][0]=focusedPen[l2][0];
  nodePoints[l][1]=focusedPen[l2][1];
  nodePoints[l][2]=dx/dl;      
  nodePoints[l][3]=dy/dl;
  if(l>0){//if there is more then one nodepoints
    var distance = Math.sqrt((nodePoints[l][0]-nodePoints[l-1][0])*(nodePoints[l][0]-nodePoints[l-1][0])+(nodePoints[l][1]-nodePoints[l-1][1])*(nodePoints[l][1]-nodePoints[l-1][1]));
    if(distance<threshold){//if last(must) point closer then threshold px to previos then delete previous point
      nodePoints[l-1][0] = nodePoints[l][0];
      nodePoints[l-1][1] = nodePoints[l][1];
      nodePoints[l-1][2] = nodePoints[l][2];
      nodePoints[l-1][3] = nodePoints[l][3];
      nodePoints.length--;
    }
  }


                  var bezInfo = new Array(focusedPen[5],new Array(strokeColor,strokeWidth,strokeOpacity,strokeDasharray,strokeLinecap,strokeLinejoin,strokeMiterlimit),new Array(fillColor,fillOpacity,fillRule));
        	  focusedBez = new Array("bezier",focusedPen[1],focusedPen[2],focusedPen[3],focusedPen[4],bezInfo);
        	  for(var i=0;i<nodePoints.length-1;i++){
        		  curStep = focusedBez.length;
        		  focusedBez[curStep] = new Array();
        		  focusedBez[curStep][p] = new Array();
        		  focusedBez[curStep][m] = new Array();
        		  focusedBez[curStep][r] = new Array();
                          focusedBez[curStep][couple]=true;
                          focusedBez[curStep][termProp]=0;
                          focusedBez[curStep][line]=0;
		          l = Math.sqrt((nodePoints[i+1][0]-nodePoints[i][0])*(nodePoints[i+1][0]-nodePoints[i][0])+(nodePoints[i+1][1]-nodePoints[i][1])*(nodePoints[i+1][1]-nodePoints[i][1]));
        		  focusedBez[curStep][p][0] = nodePoints[i][0];
        		  focusedBez[curStep][p][1] = nodePoints[i][1];
        		  focusedBez[curStep][m][0] = Math.floor(nodePoints[i][0]+(l/3)*nodePoints[i][2]);
        		  focusedBez[curStep][m][1] = Math.floor(nodePoints[i][1]+(l/3)*nodePoints[i][3]);
        		  focusedBez[curStep][r][0] = Math.floor(nodePoints[i][0]-(l/3)*nodePoints[i][2]);
        		  focusedBez[curStep][r][1] = Math.floor(nodePoints[i][1]-(l/3)*nodePoints[i][3]);
                          focusedBez[curStep][couple] = true;
                          focusedBez[curStep][termProp] = 0;
                          focusedBez[curStep][line] = 0;

        	  }
 			  l2 = nodePoints.length-1;
        		  curStep = focusedBez.length;
        		  focusedBez[curStep] = new Array();
        		  focusedBez[curStep][p] = new Array();
        		  focusedBez[curStep][m] = new Array();
        		  focusedBez[curStep][r] = new Array();
                          focusedBez[curStep][couple]=true;
                          focusedBez[curStep][termProp]=0;
                          focusedBez[curStep][line]=0;
        		  focusedBez[curStep][p][0] = nodePoints[l2][0];
        		  focusedBez[curStep][p][1] = nodePoints[l2][1];
        		  focusedBez[curStep][m][0] = Math.floor(nodePoints[l2][0]-(l/3)*nodePoints[l2][2]);
        		  focusedBez[curStep][m][1] = Math.floor(nodePoints[l2][1]-(l/3)*nodePoints[l2][3]);
        		  focusedBez[curStep][r][0] = Math.floor(nodePoints[l2][0]+(l/3)*nodePoints[l2][2]);
        		  focusedBez[curStep][r][1] = Math.floor(nodePoints[l2][1]+(l/3)*nodePoints[l2][3]);                   
                          focusedBez[curStep][couple] = true;
                          focusedBez[curStep][termProp] = 0;
                          focusedBez[curStep][line] = 0;
  if(focusedPen[0]=="lasso"){
    focusedBez[focusedBez.length-1][termProp] = 1;
  }

         }
 focusedPen = new Array();
}


