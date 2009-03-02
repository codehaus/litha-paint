/*
bezInfo[0] = id

bezInfo[1][0] = strokeColor
bezInfo[1][1] = strokeWidth
bezInfo[1][2] = strokeOpacity
bezInfo[1][3] = strokeDasharray
bezInfo[1][4] = strokeLineCap
bezinfo[1][5] = strokeLineJoin
bezInfo[1][6] = strokeMiterlimit

bezInfo[2][0] = fillCollor
bezInfo[2][1] = fillOpacity
bezInfo[2][2] = fillRule

-------------------------------------------
focusedBez[0] = "bezier"
focusedBez[1] = left
focusedBez[2] = top
focusedbez[3] = width
focusedBez[4] = height
focusedBez[5] = bezInfo

focusedBez[6][0][0] = x coord of 1-st control point
focusedBez[6][0][1] = y coord of 1-st control point
focusedBez[6][1][0] = x coord of a 1-st companion fo 1-st control point
focusedBez[6][1][1] = y coord of a 1-st companion fo 1-st control point
focusedBez[6][2][0] = x coord of a 2-st companion fo 1-st control point
focusedBez[6][2][1] = y coord of a 2-st companion fo 1-st control point
focusedBez[6][3] = are 1-st and second companions bounded toogether? 1 - if so
focusedBez[6][4] = terminal property: 0-no property, 1-merged with another terminal point, 2-closed with another terminal point
focusedBez[6][5] = are step point is a line or curve? 0 - curve, 1 - line
...........
*/

var bezSteps = new Array();
var focusedBez = new Array();//bezier,left,top,width,height,info

var identifier=0;

var stroke = 1;
var stroke_color = 0;
var stroke_width = 1;
var stroke_opacity = 2;
var stroke_dasharray = 3;
var stroke_linecap = 4;
var stroke_linejoin = 5;
var stroke_miterlimit = 6; //default value = 4

var fill = 2;
var fill_color = 0;
var fill_opacity = 1;
var fill_rule = 2;

var p=0;//precise control point
var m=1;//mouse control point
var r=2;//reflected control point
var couple=3;//are mouse and reflected control points are bounded together
var termProp=4;//property of terminal point: 0-no property, 1-merged with another terminal point, 2-closed with another terminal point
var line = 5;//are step point is a line or curve: 0-curve, 1-line;

//----------------------------------------------------------------------------------------
var mousee = new Array();
var node = new Array();
var reflected = new Array();

var highlightMousee = false;
var highlightReflected = false;
var stepNum = -1;

var editablePointNum = 0;
var fourEditableLastPoints = new Array();

var focusedBezDiv;

var bezierModified = false;


var pointingToBez = -1;

var focusedPointGap = 10;


function downBez(evt){
  downBezImp(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop(),(evt?(evt.button):event.button));
  return true;
}

function downBezImp(tx,ty,button){
	var curStep = bezSteps.length;
	if(curStep == 0){lostFocus(); left = 65530; top = 65530; width = 0; height = 0; jg.storeHiddenCanvas(0); stepNum=-1; mousee = new Array(); node = new Array(); reflected = new Array();idd=curFigureId;}
	//if(button==2){//end of the bezier curve (use ESC instead)
	  //finishBezier();
	  //return true;
	//}

        for(var i=0;i<fourEditableLastPoints.length;i++){//reallign last segment of bezier curve
          if(tx>=(fourEditableLastPoints[i][0]-5) && tx<=(fourEditableLastPoints[i][0]+5) && ty>=(fourEditableLastPoints[i][1]-5) && ty<=(fourEditableLastPoints[i][1]+5)){      
            editablePointNum=i;
            setHandlersSet(21);
            return true;
    	  }
        }


	bezSteps[curStep] = new Array();

        bezSteps[curStep][p] = new Array();//1-st or 4-th control point
	bezSteps[curStep][p][0] = tx;
	bezSteps[curStep][p][1] = ty;

	bezSteps[curStep][m] = new Array();// point which mouse pointing to
        bezSteps[curStep][m][0] = tx;
	bezSteps[curStep][m][1] = ty;

	bezSteps[curStep][r] = new Array();// point which mouse point reflecting to
        bezSteps[curStep][r][0] = tx;
	bezSteps[curStep][r][1] = ty;
        
        bezSteps[curStep][couple] = true;
        bezSteps[curStep][termProp] = 0;
        bezSteps[curStep][line] = 1;

	dragapproved=true;

        return true;
}

function calculateBezLTWH(){
	 var x_min = 65530;
	 var y_min = 65530;
	 var x_max = 0;
	 var y_max = 0;
	 for(var i=6;i<focusedBez.length;i++){
		   if(focusedBez[i][p][0]<x_min)x_min = focusedBez[i][p][0];
		   if(focusedBez[i][m][0]<x_min)x_min = focusedBez[i][m][0];
		   if(focusedBez[i][r][0]<x_min)x_min = focusedBez[i][r][0];
   		   if(focusedBez[i][p][1]<y_min)y_min = focusedBez[i][p][1];
   		   if(focusedBez[i][m][1]<y_min)y_min = focusedBez[i][m][1];
   		   if(focusedBez[i][r][1]<y_min)y_min = focusedBez[i][r][1];
		   if(focusedBez[i][p][0]>x_max)x_max = focusedBez[i][p][0];
		   if(focusedBez[i][m][0]>x_max)x_max = focusedBez[i][m][0];
		   if(focusedBez[i][r][0]>x_max)x_max = focusedBez[i][r][0];
   		   if(focusedBez[i][p][1]>y_max)y_max = focusedBez[i][p][1];
   		   if(focusedBez[i][m][1]>y_max)y_max = focusedBez[i][m][1];
   		   if(focusedBez[i][r][1]>y_max)y_max = focusedBez[i][r][1];
	 }
	 left = x_min;
	 top = y_min;
	 width = x_max-x_min;
	 height = y_max-y_min;
}


function moveBez(evt){
        if(++counter%2 == 0) return true;
	  if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){
	  x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	  y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		var curStep = bezSteps.length-1;
                bezSteps[curStep][m][0] = x1;
                bezSteps[curStep][m][1] = y1;
                bezSteps[curStep][r][0] = bezSteps[curStep][p][0]+(bezSteps[curStep][p][0]-bezSteps[curStep][m][0]);
                bezSteps[curStep][r][1] = bezSteps[curStep][p][1]+(bezSteps[curStep][p][1]-bezSteps[curStep][m][1]);
		bezSteps[curStep][line] = 0;
		jg.restoreHiddenCanvas(0);
		jg.setColor("#000000");
	        jg.setStroke(1);    
                if(curStep>=1){
		  jg.setColor("#00FF00");
		  jg.drawBezier(bezSteps[curStep-1][p][0]-canvas_x,bezSteps[curStep-1][p][1]-canvas_y,bezSteps[curStep-1][m][0]-canvas_x,bezSteps[curStep-1][m][1]-canvas_y,bezSteps[curStep][r][0]-canvas_x,bezSteps[curStep][r][1]-canvas_y,bezSteps[curStep][p][0]-canvas_x,bezSteps[curStep][p][1]-canvas_y);
		  jg.setColor("#000000");
		  jg.fillRect(bezSteps[curStep-1][p][0]-3-canvas_x,bezSteps[curStep-1][p][1]-3-canvas_y,6,6);
		  jg.fillRect(bezSteps[curStep][p][0]-3-canvas_x,bezSteps[curStep][p][1]-3-canvas_y,6,6);		  		  
  		  saveFourEditableLastPoints();
		}		

		jg.drawLine(bezSteps[curStep][r][0]-canvas_x, bezSteps[curStep][r][1]-canvas_y, bezSteps[curStep][p][0]-canvas_x, bezSteps[curStep][p][1]-canvas_y);
		jg.drawLine(bezSteps[curStep][p][0]-canvas_x, bezSteps[curStep][p][1]-canvas_y,bezSteps[curStep][m][0]-canvas_x, bezSteps[curStep][m][1]-canvas_y);
		jg.fillEllipse(bezSteps[curStep][r][0]-canvas_x-3, bezSteps[curStep][r][1]-canvas_y-3,6,6);
		jg.fillEllipse(x1-canvas_x-3, y1-canvas_y-3,6,6);		
		jg.paint();		
		return true;
	  }
	  else{//highlight the one of the last four point
	   var curStep = bezSteps.length-1;
	   for(var i=0;i<fourEditableLastPoints.length;i++){//reallign last segment of bezier curve
             if(x1>=(fourEditableLastPoints[i][0]-5) && x1<=(fourEditableLastPoints[i][0]+5) && y1>=(fourEditableLastPoints[i][1]-5) && y1<=(fourEditableLastPoints[i][1]+5)){
               editablePointNum=i;
               switch(editablePointNum){
 	         case 0:
                  jg.setColor('#FF0000');
		  jg.fillRect(bezSteps[curStep-1][p][0]-3-canvas_x,bezSteps[curStep-1][p][1]-3-canvas_y,6,6);
		  jg.paint();
		  return true;
 	         case 1:
                  jg.setColor('#FF0000');
		  jg.fillRect(bezSteps[curStep][p][0]-3-canvas_x,bezSteps[curStep][p][1]-3-canvas_y,6,6);
		  jg.paint();
		  return true;
 	         case 2:
                  jg.setColor('#FF0000');
                  jg.fillEllipse(bezSteps[curStep][m][0]-canvas_x-3, bezSteps[curStep][m][1]-canvas_y-3,6,6);
		  jg.paint();
		  return true;
 	         case 3:
                  jg.setColor('#FF0000');
                  jg.fillEllipse(bezSteps[curStep][r][0]-canvas_x-3, bezSteps[curStep][r][1]-canvas_y-3,6,6);
		  jg.paint();
		  return true;
	       }
    	     }
           }
	   if(fourEditableLastPoints.length>0){//turn off all turned on highlights
             jg.setColor('#000000');
             if(curStep-1>=0){
	       jg.fillRect(bezSteps[curStep-1][p][0]-3-canvas_x,bezSteps[curStep-1][p][1]-3-canvas_y,6,6);
	       jg.fillRect(bezSteps[curStep][p][0]-3-canvas_x,bezSteps[curStep][p][1]-3-canvas_y,6,6);
               jg.fillEllipse(bezSteps[curStep][m][0]-canvas_x-3, bezSteps[curStep][m][1]-canvas_y-3,6,6);
               jg.fillEllipse(bezSteps[curStep][r][0]-canvas_x-3, bezSteps[curStep][r][1]-canvas_y-3,6,6);
	       jg.paint();		            
	     }
	   }
           return true;
	  } 

}


function releaseBez(evt){
  	  dragapproved=false;
	  if(bezSteps.length>=2 && (evt?(evt.button):event.button)!=2){
                  var bezInfo = new Array(idd,new Array(strokeColor,strokeWidth,strokeOpacity,strokeDasharray,strokeLinecap,strokeLinejoin,strokeMiterlimit),new Array(fillColor,fillOpacity,fillRule));
        	  focusedBez = new Array("bezier",0,0,0,0,bezInfo);
        	  for(var i=0;i<bezSteps.length;i++){
        		  curStep = focusedBez.length;
        		  focusedBez[curStep] = new Array();
        		  focusedBez[curStep][p] = new Array();
        		  focusedBez[curStep][m] = new Array();
        		  focusedBez[curStep][r] = new Array();
                          focusedBez[curStep][couple]=bezSteps[i][couple];
                          focusedBez[curStep][termProp]=bezSteps[i][termProp];
                          focusedBez[curStep][line]=bezSteps[i][line];
        		  focusedBez[curStep][p][0] = bezSteps[i][p][0];
        		  focusedBez[curStep][p][1] = bezSteps[i][p][1];
        		  focusedBez[curStep][m][0] = bezSteps[i][m][0];
        		  focusedBez[curStep][m][1] = bezSteps[i][m][1];
        		  focusedBez[curStep][r][0] = bezSteps[i][r][0];
        		  focusedBez[curStep][r][1] = bezSteps[i][r][1];

        	  }
        	  //bezSteps = new Array();
        	  calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
//   		  idd = curFigureId;
        	  if(bezSteps.length==2){
                    saveBezToUndoRedoLog("delete");
                    sendObject(focusedBez,"insert");
                  }
		  else if(bezSteps.length>2){saveBezToUndoRedoLog("update"); sendObject(focusedBez,"update");}
                  createFocusedBezDiv(focusedBez);
        	  x=0;y=0;x1=0;y1=0;        
          }
      return true;

}

function drawFocusedBez(){
  if(focusedBez.length>6){
  clearr();
  jg.storeHiddenCanvas(1);
  var x = focusedBez[1];
  var y = focusedBez[2];
  var width = focusedBez[3];
  var height = focusedBez[4];

  jg.setColor('#000000');  
   //jg.drawRect(x-canvas_x,y-canvas_y,width,height);
	
  mobilePoint = new Array();

  drawMobilePoints(0,x-3-canvas_x-focusedPointGap,y-3-canvas_y-focusedPointGap,6,6);
  	drawMobilePoints(1,(2*x+width-6-2*canvas_x)/2,y-3-canvas_y-focusedPointGap,6,6);
  drawMobilePoints(2,x+width-3-canvas_x+focusedPointGap,y-3-canvas_y-focusedPointGap,6,6);
    drawMobilePoints(3,x+width-3-canvas_x+focusedPointGap,(2*y+height-6-2*canvas_y)/2,6,6);
  drawMobilePoints(4,x+width-3-canvas_x+focusedPointGap,y+height-3-canvas_y+focusedPointGap,6,6);
  	drawMobilePoints(5,(2*x-6+width-2*canvas_x)/2,y+height-3-canvas_y+focusedPointGap,6,6);
  drawMobilePoints(6,x-3-canvas_x-focusedPointGap,y+height-3-canvas_y+focusedPointGap,6,6);
    drawMobilePoints(7,x-3-canvas_x-focusedPointGap,(2*y-6+height-2*canvas_y)/2,6,6);
	
  drawMobileCenter(x,y,width,height);
  jg.setStroke(1);
  drawBezStepPoints();
  jg.paint();
  jg.storeHiddenCanvas(2);

       if(mousee.length==2 && reflected.length==2){
 	 jg.fillEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
         jg.fillEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
         jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,node[0]-canvas_x,node[1]-canvas_y);
         jg.drawLine(node[0]-canvas_x,node[1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);
       }
  jg.paint();
  jg.setColor('#00FF00');
  pointingToBez = (x>=focusedBez[1] && x<=(focusedBez[1]+focusedBez[3]) && y>=focusedBez[2] && y<=(focusedBez[2]+focusedBez[4]))?focusedBez[5][0]:-1;
  setHandlersSet(10);
  }

}


function drawBezStepPoints(){
	var j=9;
	for(var i=6;i<focusedBez.length;i++){
		drawBezStepPoint(j,focusedBez[i][p][0]-3-canvas_x,focusedBez[i][p][1]-3-canvas_y,6,6);
		j++;
	}
}

function drawBezStepPoint(num,x,y,w,h){
  mobilePoint[num]=new Array(x,y,w,h);
  jg.drawRect(x,y,w,h);
}

function hitBezFocus(evt){
        //document.getElementById("debug").innerText+=" hitBezFocus ";        
	x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
        hitBezFocusImp(x,y);
        return true; 
}

function hitBezFocusImp(x,y){
  if(focusedBez.length>6){
	if(focusedMobilePointNum >=0 && focusedMobilePointNum <=8){ //mobilePoint hit
		dragapproved=true;
		jg.storeHiddenCanvas(3);
		jg.setColor("#000000");
		jg.setStroke(1);
		setHandlersSet(11);
	}
        else if(highlightMousee || highlightReflected){
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(13);		
	}
	else if(focusedMobilePointNum > 8){

  		  dragapproved = true;
		  jg.storeHiddenCanvas(3);
		  setHandlersSet(12);
	}
	else{//start draw another bezier or select another region
		if(tool_selected == 6){
			setHandlersSet(9);downBezImp(x,y,0);
		}
		else if(tool_selected == 2){
			//if(pointingToBez==-1){
			  setHandlersSet(3);selectRegion_imp(x,y);
			//}
			//else{
			  //drawFocusedBezRot();
			//}
		}
		else if(tool_selected == 8 || tool_selected == 9){
			setHandlersSet(18);downPenImp(x,y);
		}
		else if(tool_selected == 0 || tool_selected== 1){
			setHandlersSet(0);drags_imp(x,y);
		}
                else if(tool_selected == 3){
			setHandlersSet(4);downLineImp(x,y);
		}
                else if(tool_selected == 10){
			setHandlersSet(31);workspaceMouseDownImp(x,y);
		}
		else if(tool_selected == 4 || tool_selected== 5){
			setHandlersSet(5);downPolylineImp(x,y);
		}

      
	}
    }  
}


function hitBezFocusDbl(evt){
 if(focusedBez.length>6){
  if(focusedMobilePointNum > 8){
    //alert("showContextMenuBez "+(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft())+' '+(evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop())+")");
    showContextMenuBez(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop());
  }
  return true;
 }
}


function highlightBezFocus(evt){
  if(focusedBez && focusedBez.length>6){
   if(highlightFocusMonitor ) return false;
   highlightFocusMonitor = true;
   var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
   var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
   var highlightMobile = false;
   var highlightStep = false;
   highlightMousee = false;
   highlightReflected = false;
   focusedMobilePointNum = -1;
   pointingToBez = (x>=focusedBez[1] && x<=(focusedBez[1]+focusedBez[3]) && y>=focusedBez[2] && y<=(focusedBez[2]+focusedBez[4]))?focusedBez[5][0]:-1;
   var mobilePointsThatFit = new Array();
   for(var i=0;i<mobilePoint.length;i++){
     if(x-canvas_x>=mobilePoint[i][0]-2 && x-canvas_x<=mobilePoint[i][0]+mobilePoint[i][2]+6 && y-canvas_y>=mobilePoint[i][1]-2 && y-canvas_y<=mobilePoint[i][1]+mobilePoint[i][3]+6){          
	   mobilePointsThatFit[mobilePointsThatFit.length] = new Array(i,Math.sqrt((x-canvas_x-mobilePoint[i][0])*(x-canvas_x-mobilePoint[i][0])+(y-canvas_y-mobilePoint[i][1])*(y-canvas_y-mobilePoint[i][1])));
     }
   }
   var minDist = 1000000;
   var minNum = -1;
   for(var i=0;i<mobilePointsThatFit.length;i++){
           if(mobilePointsThatFit[i][1]<minDist){
             minDist = mobilePointsThatFit[i][1];
             minNum = mobilePointsThatFit[i][0];
           }
   }

   if(minNum!=-1){
 	   if(minNum<=8)highlightMobile = true; else highlightStep = true;
     	   focusedMobilePointNum = minNum;
   }
    
   if(mousee.length==2 && Math.abs(x-mousee[0])<=3 && Math.abs(y-mousee[1])<=3 && stepNum!=-1 && focusedBez[stepNum-3] && focusedBez[stepNum-3].length>0 && focusedBez[stepNum-3][line]!=1){
     highlightMousee = true;
     highlightMobile = false;
     highlightStep = false;
   }
   
   if(reflected.length==2 && Math.abs(x-reflected[0])<=3 && Math.abs(y-reflected[1])<=3 && stepNum!=-1 && focusedBez[stepNum-3] && focusedBez[stepNum-3].length>0 && focusedBez[stepNum-3][line]!=1){
     highlightReflected = true;
     highlightMobile = false;
     highlightStep = false;
   }

   
   if(highlightMobile){
         if(window.opera!=null){
   	   jg.setColor('#FF0000');	
	   jg.setStroke(1);   
	   for(var j=0;j<8;j++){
	     jg.fillRect(mobilePoint[j][0],mobilePoint[j][1],mobilePoint[j][2],mobilePoint[j][3]);
	   }
	   jg.setStroke(3);
	   jg.drawLine(mobilePoint[8][0],mobilePoint[8][1],mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1]+mobilePoint[8][3]);
	   jg.drawLine(mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1],mobilePoint[8][0],mobilePoint[8][1]+mobilePoint[8][3]);
	   jg.setStroke(1);   
         }
         else{
	   if(focusedMobilePointNum==0){
 	     canvas.style.cursor="NW-resize";
           }
	   else if(focusedMobilePointNum==1){
 	     canvas.style.cursor="N-resize";
           }
	   else if(focusedMobilePointNum==2){
 	     canvas.style.cursor="NE-resize";
           }
	   else if(focusedMobilePointNum==3){
 	     canvas.style.cursor="E-resize";
           }
	   else if(focusedMobilePointNum==4){
 	     canvas.style.cursor="SE-resize";
           }
	   else if(focusedMobilePointNum==5){
 	     canvas.style.cursor="S-resize";
           }
	   else if(focusedMobilePointNum==6){
 	     canvas.style.cursor="SW-resize";
           }
	   else if(focusedMobilePointNum==7){
 	     canvas.style.cursor="W-resize";
           }
	   else if(focusedMobilePointNum==8){
 	     canvas.style.cursor="move";
           }
         }


   } 
   else if(highlightStep){
           canvas.style.cursor="auto";
	   jg.restoreHiddenCanvas(2);
   	   jg.setColor('#FF0000');	   
	   jg.setStroke(1);   
           jg.drawRect(mobilePoint[focusedMobilePointNum][0],mobilePoint[focusedMobilePointNum][1],mobilePoint[focusedMobilePointNum][2],mobilePoint[focusedMobilePointNum][3]);
           if(focusedBez[focusedMobilePointNum-3][line]==0){
 	     mousee[0] = focusedBez[focusedMobilePointNum-3][m][0];
	     mousee[1] = focusedBez[focusedMobilePointNum-3][m][1];
             node[0] = focusedBez[focusedMobilePointNum-3][p][0];
             node[1] = focusedBez[focusedMobilePointNum-3][p][1];
	     reflected[0] = focusedBez[focusedMobilePointNum-3][r][0];
	     reflected[1] = focusedBez[focusedMobilePointNum-3][r][1];
	     jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,node[0]-canvas_x,node[1]-canvas_y);
	     jg.drawLine(node[0]-canvas_x,node[1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);
             jg.fillEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
	     jg.fillEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
           }
           stepNum = focusedMobilePointNum;

   }
   else if(highlightMousee){
 	   canvas.style.cursor="auto";
           jg.restoreHiddenCanvas(2);
	   jg.setColor('#FF0000');	             
  	   jg.drawEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
           jg.drawEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
           jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,node[0]-canvas_x,node[1]-canvas_y);           
           jg.drawLine(node[0]-canvas_x,node[1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);           
   }
   else if(highlightReflected){
 	   canvas.style.cursor="auto";
           jg.restoreHiddenCanvas(2);
	   jg.setColor('#FF0000');	   
           jg.drawEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
  	   jg.drawEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
           jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,node[0]-canvas_x,node[1]-canvas_y);                      
           jg.drawLine(node[0]-canvas_x,node[1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);                      
   }
   else{
       canvas.style.cursor="auto";
       jg.restoreHiddenCanvas(2);
       jg.setColor('#000000');	   
       jg.setStroke(1);   
       if(mousee.length==2 && reflected.length==2){
 	 jg.fillEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
         jg.fillEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
         jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,node[0]-canvas_x,node[1]-canvas_y);
	 jg.drawLine(node[0]-canvas_x,node[1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);
       }
   }
        jg.paint();      
		highlightFocusMonitor =false;
		return true;
  }
}

function resizeFocusedBez(evt){
	if(++counter%5 != 0) return true;
	if (dragapproved){
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		left = focusedBez[1]+eval(weights[focusedMobilePointNum][0]);
		top = focusedBez[2]+eval(weights[focusedMobilePointNum][1]);
		width = focusedBez[3]+eval(weights[focusedMobilePointNum][2]);
		height = focusedBez[4]+eval(weights[focusedMobilePointNum][3]);
		jg.restoreHiddenCanvas(3);

		  bezSteps = new Array();
		  bezierModified=true;

		  var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;

		  for(var i=6;i<focusedBez.length;i++){
			bezSteps[i] = new Array();
			bezSteps[i][p] = new Array();
			bezSteps[i][m] = new Array();
			bezSteps[i][r] = new Array();

			var wx1 = (focusedBez[i][p][0]-focusedBez[1])/(focusedBez[3] != 0 ? focusedBez[3] : 1);
			var wy1 = (focusedBez[i][p][1]-focusedBez[2])/(focusedBez[4] != 0 ? focusedBez[4] : 1);			
			bezSteps[i][p][0] = Math.floor(width*wx1+left);
			bezSteps[i][p][1] = Math.floor(height*wy1+top);

			wx1 = (focusedBez[i][m][0]-focusedBez[1])/(focusedBez[3] != 0 ? focusedBez[3] : 1);
			wy1 = (focusedBez[i][m][1]-focusedBez[2])/(focusedBez[4] != 0 ? focusedBez[4] : 1);
			bezSteps[i][m][0] = Math.floor(width*wx1+left);
			bezSteps[i][m][1] = Math.floor(height*wy1+top);

			wx1 = (focusedBez[i][r][0]-focusedBez[1])/(focusedBez[3] != 0 ? focusedBez[3] : 1);
			wy1 = (focusedBez[i][r][1]-focusedBez[2])/(focusedBez[4] != 0 ? focusedBez[4] : 1);
			bezSteps[i][r][0] = Math.floor(width*wx1+left);
			bezSteps[i][r][1] = Math.floor(height*wy1+top);
			

		  }
                  if(focusedMobilePointNum!=8){
		    for(var j=7;j<focusedBez.length;j++){
			jg.sketchBezier((bezSteps[j-1][p][0]-canvas_x),(bezSteps[j-1][p][1]-canvas_y),(bezSteps[j-1][m][0]-canvas_x),(bezSteps[j-1][m][1]-canvas_y), (bezSteps[j][r][0]-canvas_x), (bezSteps[j][r][1]-canvas_y),(bezSteps[j][p][0]-canvas_x), (bezSteps[j][p][1]-canvas_y),poppyseed);			
		    }
                    if(focusedBez[focusedBez.length-1][termProp]==1){
                        jg.sketchBezier(bezSteps[focusedBez.length-1][p][0]-canvas_x,bezSteps[focusedBez.length-1][p][1]-canvas_y,bezSteps[focusedBez.length-1][m][0]-canvas_x,bezSteps[focusedBez.length-1][m][1]-canvas_y, bezSteps[6][r][0]-canvas_x,bezSteps[6][r][1]-canvas_y,bezSteps[6][p][0]-canvas_x, bezSteps[6][p][1]-canvas_y,poppyseed);
                    }
                    jg.fillRect(bezSteps[focusedBez.length-1][0]-1-canvas_x,bezSteps[focusedBez.length-1][1]-1-canvas_y,2,2);
                  }
                if(focusedMobilePointNum==8)jg.drawDiv(left-canvas_x,top-canvas_y,width,height,focusedBezDiv); 
		jg.paint();		
	}
}


function finishResizeFocusedBez(evt){
  if(bezierModified){
        dragapproved=false;
	bezierModified=false;
	focusedBez[1] = left;
	focusedBez[2] = top;
	focusedBez[3] = width;
	focusedBez[4] = height;
	var stepsCount = bezSteps.length;
	for(var i=6;i<stepsCount;i++){

		focusedBez[i][p][0] = bezSteps[i][p][0];
		focusedBez[i][p][1] = bezSteps[i][p][1];
		focusedBez[i][m][0] = bezSteps[i][m][0];
		focusedBez[i][m][1] = bezSteps[i][m][1];
		focusedBez[i][r][0] = bezSteps[i][r][0];
		focusedBez[i][r][1] = bezSteps[i][r][1];

	}
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
  focusedMobilePointNum = -1;
  drawFocusedBez();



}

function reallignFocusedBez(evt){
//        document.getElementById("debug").innerText+=" reallignFocusedBez ";
	if(++counter%2 == 0) return;
	if (dragapproved){
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();               
	        bezierModified=true;
		jg.restoreHiddenCanvas(3);
		jg.setColor("#00FF00");
	    jg.setStroke(1);   
		bezierModified=true;
		var dx = x1-focusedBez[focusedMobilePointNum-3][p][0];
		var dy = y1-focusedBez[focusedMobilePointNum-3][p][1];
		focusedBez[focusedMobilePointNum-3][p][0] = x1;
  		focusedBez[focusedMobilePointNum-3][p][1] = y1;
		focusedBez[focusedMobilePointNum-3][m][0] += dx;
  		focusedBez[focusedMobilePointNum-3][m][1] += dy;
		focusedBez[focusedMobilePointNum-3][r][0] += dx;
  		focusedBez[focusedMobilePointNum-3][r][1] += dy;
		mousee[0] = focusedBez[focusedMobilePointNum-3][m][0];
		mousee[1] = focusedBez[focusedMobilePointNum-3][m][1];
		reflected[0] = focusedBez[focusedMobilePointNum-3][r][0];
		reflected[1] = focusedBez[focusedMobilePointNum-3][r][1];
		node[0] = focusedBez[focusedMobilePointNum-3][p][0];
		node[1] = focusedBez[focusedMobilePointNum-3][p][1];
		
		  if(focusedMobilePointNum-4>=6){
			  jg.drawBezier(focusedBez[focusedMobilePointNum-4][p][0]-canvas_x,focusedBez[focusedMobilePointNum-4][p][1]-canvas_y,focusedBez[focusedMobilePointNum-4][m][0]-canvas_x,focusedBez[focusedMobilePointNum-4][m][1]-canvas_y,focusedBez[focusedMobilePointNum-3][r][0]-canvas_x,focusedBez[focusedMobilePointNum-3][r][1]-canvas_y,focusedBez[focusedMobilePointNum-3][p][0]-canvas_x,focusedBez[focusedMobilePointNum-3][p][1]-canvas_y);
		  }else if(focusedBez[focusedBez.length-1][termProp]==1){
  		          jg.drawBezier(focusedBez[focusedBez.length-1][p][0]-canvas_x,focusedBez[focusedBez.length-1][p][1]-canvas_y,focusedBez[focusedBez.length-1][m][0]-canvas_x,focusedBez[focusedBez.length-1][m][1]-canvas_y,focusedBez[focusedMobilePointNum-3][r][0]-canvas_x,focusedBez[focusedMobilePointNum-3][r][1]-canvas_y,focusedBez[focusedMobilePointNum-3][p][0]-canvas_x,focusedBez[focusedMobilePointNum-3][p][1]-canvas_y);
                  }

		  if(focusedMobilePointNum-2<focusedBez.length){
			  jg.drawBezier(focusedBez[focusedMobilePointNum-3][p][0]-canvas_x,focusedBez[focusedMobilePointNum-3][p][1]-canvas_y,focusedBez[focusedMobilePointNum-3][m][0]-canvas_x,focusedBez[focusedMobilePointNum-3][m][1]-canvas_y,focusedBez[focusedMobilePointNum-2][r][0]-canvas_x,focusedBez[focusedMobilePointNum-2][r][1]-canvas_y,focusedBez[focusedMobilePointNum-2][p][0]-canvas_x,focusedBez[focusedMobilePointNum-2][p][1]-canvas_y);
		  }else if(focusedBez[focusedBez.length-1][termProp]==1){
	                  jg.drawBezier(focusedBez[focusedMobilePointNum-3][p][0]-canvas_x,focusedBez[focusedMobilePointNum-3][p][1]-canvas_y,focusedBez[focusedMobilePointNum-3][m][0]-canvas_x,focusedBez[focusedMobilePointNum-3][m][1]-canvas_y,focusedBez[6][r][0]-canvas_x,focusedBez[6][r][1]-canvas_y,focusedBez[6][p][0]-canvas_x,focusedBez[6][p][1]-canvas_y);
                  }

		  jg.setColor("#000000");
		  jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,x1-canvas_x,y1-canvas_y);
		  jg.drawLine(x1-canvas_x,y1-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);
		  jg.fillEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
           	  jg.fillEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);


		jg.paint();
		return true;
	}
}

function finishReallignFocusedBez(evt){
//      document.getElementById("debug").innerText+=" finishReallignFocusedBez ";
	calculateBezLTWH();
	focusedBez[1] = left;
	focusedBez[2] = top;
	focusedBez[3] = width;
	focusedBez[4] = height;
	sendObject(focusedBez,"update");
	saveBezToUndoRedoLog("update");
        createFocusedBezDiv(focusedBez);
	x=0;y=0;x1=0;y1=0;
	dragapproved=false;
	//jg.restoreHiddenCanvas(0);
	//jg.paint();	
	if(bezierModified){bezierModified=false;focusedMobilePointNum=-1;drawFocusedBez();}
	else{bezierModified=false;setHandlersSet(10);}        
	return true;
}

function redirectFocusedBez(evt){
	if(++counter%2 == 0) return;
	if (dragapproved){		
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		jg.restoreHiddenCanvas(3);
		jg.setColor("#00FF00");
	        jg.setStroke(1);
		bezierModified=true;
		if(highlightMousee){
		  focusedBez[stepNum-3][m][0] = x1;
  		  focusedBez[stepNum-3][m][1] = y1;
                  if(focusedBez[stepNum-3][couple]==true){
  		    focusedBez[stepNum-3][r][0] = 2*focusedBez[stepNum-3][p][0]-focusedBez[stepNum-3][m][0];
  		    focusedBez[stepNum-3][r][1] = 2*focusedBez[stepNum-3][p][1]-focusedBez[stepNum-3][m][1];
                  }
		}
		else if(highlightReflected){
		  focusedBez[stepNum-3][r][0] = x1;
  		  focusedBez[stepNum-3][r][1] = y1;
                    if(focusedBez[stepNum-3][couple]==true){
   		      focusedBez[stepNum-3][m][0] = 2*focusedBez[stepNum-3][p][0]-focusedBez[stepNum-3][r][0];
  		      focusedBez[stepNum-3][m][1] = 2*focusedBez[stepNum-3][p][1]-focusedBez[stepNum-3][r][1];
                    }
		}

		mousee[0] = focusedBez[stepNum-3][m][0];
		mousee[1] = focusedBez[stepNum-3][m][1];
		reflected[0] = focusedBez[stepNum-3][r][0];
		reflected[1] = focusedBez[stepNum-3][r][1];
		node[0] = focusedBez[stepNum-3][p][0];
		node[1] = focusedBez[stepNum-3][p][1];
		
		  if(stepNum-4>=6){
			  jg.drawBezier(focusedBez[stepNum-4][p][0]-canvas_x,focusedBez[stepNum-4][p][1]-canvas_y,focusedBez[stepNum-4][m][0]-canvas_x,focusedBez[stepNum-4][m][1]-canvas_y,focusedBez[stepNum-3][r][0]-canvas_x,focusedBez[stepNum-3][r][1]-canvas_y,focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y);
		  }else if(focusedBez[focusedBez.length-1][termProp]==1){
  		          jg.drawBezier(focusedBez[focusedBez.length-1][p][0]-canvas_x,focusedBez[focusedBez.length-1][p][1]-canvas_y,focusedBez[focusedBez.length-1][m][0]-canvas_x,focusedBez[focusedBez.length-1][m][1]-canvas_y,focusedBez[stepNum-3][r][0]-canvas_x,focusedBez[stepNum-3][r][1]-canvas_y,focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y);
                  }

		  if(stepNum-2<focusedBez.length){
			  jg.drawBezier(focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y,focusedBez[stepNum-3][m][0]-canvas_x,focusedBez[stepNum-3][m][1]-canvas_y,focusedBez[stepNum-2][r][0]-canvas_x,focusedBez[stepNum-2][r][1]-canvas_y,focusedBez[stepNum-2][p][0]-canvas_x,focusedBez[stepNum-2][p][1]-canvas_y);
		  }else if(focusedBez[focusedBez.length-1][termProp]==1){
	                  jg.drawBezier(focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y,focusedBez[stepNum-3][m][0]-canvas_x,focusedBez[stepNum-3][m][1]-canvas_y,focusedBez[6][r][0]-canvas_x,focusedBez[6][r][1]-canvas_y,focusedBez[6][p][0]-canvas_x,focusedBez[6][p][1]-canvas_y);
                  }
                  
		  jg.setColor("#000000");
		  jg.drawLine(mousee[0]-canvas_x,mousee[1]-canvas_y,focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y);
                  jg.drawLine(focusedBez[stepNum-3][p][0]-canvas_x,focusedBez[stepNum-3][p][1]-canvas_y,reflected[0]-canvas_x,reflected[1]-canvas_y);
		  jg.fillEllipse(mousee[0]-3-canvas_x,mousee[1]-3-canvas_y,6,6);
           	  jg.fillEllipse(reflected[0]-3-canvas_x,reflected[1]-3-canvas_y,6,6);
  
		
		jg.paint();
		return true;
	}
}

function saveFourEditableLastPoints(){
		var curStep = bezSteps.length-1;
		fourEditableLastPoints[0]=new Array();
		fourEditableLastPoints[0][0] = bezSteps[curStep-1][p][0];
		fourEditableLastPoints[0][1] = bezSteps[curStep-1][p][1];
		fourEditableLastPoints[1]=new Array();
		fourEditableLastPoints[1][0] = bezSteps[curStep][p][0];
		fourEditableLastPoints[1][1] = bezSteps[curStep][p][1];
		fourEditableLastPoints[2]=new Array();
		fourEditableLastPoints[2][0] = bezSteps[curStep][m][0];
		fourEditableLastPoints[2][1] = bezSteps[curStep][m][1];
		fourEditableLastPoints[3]=new Array();
		fourEditableLastPoints[3][0] = bezSteps[curStep][r][0];
		fourEditableLastPoints[3][1] = bezSteps[curStep][r][1];
}

function reallignLastSegmentBez(evt){
  if(++counter%2 != 0){
  var tx=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
  var ty=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
  jg.restoreHiddenCanvas(0);
  if(editablePointNum==0){
        var curStep = bezSteps.length-1;
        var dx = tx-bezSteps[curStep-1][p][0];
	var dy = ty-bezSteps[curStep-1][p][1];
	bezSteps[curStep-1][p][0] = tx;
	bezSteps[curStep-1][p][1] = ty;
	bezSteps[curStep-1][r][0] += dx;
	bezSteps[curStep-1][r][1] += dy;
	bezSteps[curStep-1][m][0] += dx;
	bezSteps[curStep-1][m][1] += dy;
 	jg.setColor("#00FF00");
        if(curStep-2>=0){jg.drawBezier(bezSteps[curStep-2][p][0]-canvas_x,bezSteps[curStep-2][p][1]-canvas_y,bezSteps[curStep-2][m][0]-canvas_x,bezSteps[curStep-2][m][1]-canvas_y,bezSteps[curStep-1][r][0]-canvas_x,bezSteps[curStep-1][r][1]-canvas_y,bezSteps[curStep-1][p][0]-canvas_x,bezSteps[curStep-1][p][1]-canvas_y);}
  }
  if(editablePointNum==1){
        var curStep = bezSteps.length-1;
        var dx = tx-bezSteps[curStep][p][0];
	var dy = ty-bezSteps[curStep][p][1];
	bezSteps[curStep][p][0] = tx;
	bezSteps[curStep][p][1] = ty;
	bezSteps[curStep][r][0] += dx;
	bezSteps[curStep][r][1] += dy;
	bezSteps[curStep][m][0] += dx;
	bezSteps[curStep][m][1] += dy;
  }
  if(editablePointNum==2){
        var curStep = bezSteps.length-1;
        var dx = tx-bezSteps[curStep][m][0];
	var dy = ty-bezSteps[curStep][m][1];
	bezSteps[curStep][r][0] -= dx;
	bezSteps[curStep][r][1] -= dy;
	bezSteps[curStep][m][0] = tx;
	bezSteps[curStep][m][1] = ty;
  }
  if(editablePointNum==3){
        var curStep = bezSteps.length-1;
        var dx = tx-bezSteps[curStep][r][0];
	var dy = ty-bezSteps[curStep][r][1];
	bezSteps[curStep][r][0] = tx;
	bezSteps[curStep][r][1] = ty;
	bezSteps[curStep][m][0] -= dx;
	bezSteps[curStep][m][1] -= dy;
  }
  jg.setColor("#00FF00");
  jg.drawBezier(bezSteps[curStep-1][p][0]-canvas_x,bezSteps[curStep-1][p][1]-canvas_y,bezSteps[curStep-1][m][0]-canvas_x,bezSteps[curStep-1][m][1]-canvas_y,bezSteps[curStep][r][0]-canvas_x,bezSteps[curStep][r][1]-canvas_y,bezSteps[curStep][p][0]-canvas_x,bezSteps[curStep][p][1]-canvas_y);
  jg.setColor("#000000");
  jg.fillRect(bezSteps[curStep-1][p][0]-3-canvas_x,bezSteps[curStep-1][p][1]-3-canvas_y,6,6);
  jg.fillRect(bezSteps[curStep][p][0]-3-canvas_x,bezSteps[curStep][p][1]-3-canvas_y,6,6);		  
  saveFourEditableLastPoints();
  jg.drawLine(bezSteps[curStep][r][0]-canvas_x, bezSteps[curStep][r][1]-canvas_y, bezSteps[curStep][p][0]-canvas_x, bezSteps[curStep][p][1]-canvas_y);
  jg.drawLine(bezSteps[curStep][p][0]-canvas_x, bezSteps[curStep][p][1]-canvas_y, bezSteps[curStep][m][0]-canvas_x, bezSteps[curStep][m][1]-canvas_y);
  jg.fillEllipse(bezSteps[curStep][r][0]-canvas_x-3, bezSteps[curStep][r][1]-canvas_y-3,6,6);
  jg.fillEllipse(bezSteps[curStep][m][0]-canvas_x-3, bezSteps[curStep][m][1]-canvas_y-3,6,6);		
  jg.paint();    
  }
}

function finishReallignLastSegmentBez(evt){
  setHandlersSet(9);
  releaseBez(evt);
}

function finishBezier(){
	  curFigureId++;
	  bezSteps = new Array();
	  jg.restoreHiddenCanvas(0);  
	  calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
	  saveBezToUndoRedoLog("update");
	  drawFocusedBez();
}


function createFocusedBezDiv(fObj){
  focusedBezDiv = document.createElement("div");
  focusedBezDiv.style.position="absolute";
  var l = fObj[3]>0?fObj[1]:(fObj[1]+fObj[3]);
  var t = fObj[4]>0?fObj[2]:(fObj[2]+fObj[4]);
  var w = fObj[3]>0?fObj[3]:(-fObj[3]);
  var h = fObj[4]>0?fObj[4]:(-fObj[4]);
  w = w != 0 ? w : 1;
  h = h != 0 ? h : 1;  
  fObj[1] = l; fObj[2] = t; fObj[3] = w; fObj[4] = h;
  focusedBezDiv.style.left = l;
  focusedBezDiv.style.top = t;
  focusedBezDiv.style.width = w;
  focusedBezDiv.style.height = h;
  var g = new jsGraphics("nevermind",w+1,h+1,focusedBezDiv);
  g.setColor("#000000");
  g.setStroke(1);
  var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
  for(var i=0;i<fObj.length-7;i++){
    g.sketchBezier(fObj[6+i][p][0]-l,fObj[6+i][p][1]-t,fObj[6+i][m][0]-l,fObj[6+i][m][1]-t, fObj[7+i][r][0]-l,fObj[7+i][r][1]-t,fObj[7+i][p][0]-l, fObj[7+i][p][1]-t,poppyseed);
  }
  if(fObj[fObj.length-1][termProp]==1){
    g.sketchBezier(fObj[fObj.length-1][p][0]-l,fObj[fObj.length-1][p][1]-t,fObj[fObj.length-1][m][0]-l,fObj[fObj.length-1][m][1]-t, fObj[6][r][0]-l,fObj[6][r][1]-t,fObj[6][p][0]-l, fObj[6][p][1]-t,poppyseed);
  }
  g.fillRect(fObj[fObj.length-1][0]-1,fObj[fObj.length-1][1]-1,2,2);
  g.paint();
}
