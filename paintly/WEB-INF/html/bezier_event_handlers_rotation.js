var rotCenter = new Array();//coordinates of rotation centers of figures relative to their top left point

var centerMoved=false;

var rotStartVector = new Array();
var rotEndVector = new Array();

function drawFocusedBezRot(){
  clearr();
//  jg.storeHiddenCanvas(1); -already stored by drawFocusedBez
  var x = focusedBez[1];
  var y = focusedBez[2];
  var width = focusedBez[3];
  var height = focusedBez[4];

  jg.setColor('#000000');  
	
  mobilePoint = new Array();
  drawMobilePointsRot(0,x-9-canvas_x,y-9-canvas_y,18,18);
  	drawMobilePointsRot(1,(2*x+width-17-2*canvas_x)/2,y-10-canvas_y,17,9);
  drawMobilePointsRot(2,x+width-9-canvas_x,y-9-canvas_y,18,18);
    drawMobilePointsRot(3,x+width-canvas_x,(2*y+height-17-2*canvas_y)/2,9,17);
  drawMobilePointsRot(4,x+width-9-canvas_x,y+height-9-canvas_y,18,18);
  	drawMobilePointsRot(5,(2*x-17+width-2*canvas_x)/2,y+height-canvas_y,17,9);
  drawMobilePointsRot(6,x-9-canvas_x,y+height-9-canvas_y,18,18);
    drawMobilePointsRot(7,x-10-canvas_x,(2*y-17+height-2*canvas_y)/2,9,17);
	
  drawRotCenter(x,y,width,height);
  jg.setStroke(1);
  //drawBezStepPoints();
  jg.paint();
  jg.storeHiddenCanvas(2);

  jg.paint();
  jg.setColor('#00FF00');
  focusedMobilePointNum = -1;
  setHandlersSet(24);
}

function drawRotCenter(x,y,width,height){
  if(!rotCenter[focusedBez[5][0]] || rotCenter[focusedBez[5][0]].length!=2){//rotCenter is inconsistent for this figure
     rotCenter[focusedBez[5][0]] = new Array();
     rotCenter[focusedBez[5][0]][0] = (2*x+width)/2-x;
     rotCenter[focusedBez[5][0]][1] = (2*y+height)/2-y;
  }
  jg.drawEllipse(x+rotCenter[focusedBez[5][0]][0]-1-canvas_x,y+rotCenter[focusedBez[5][0]][1]-1-canvas_y,2,2);
  jg.drawEllipse(x+rotCenter[focusedBez[5][0]][0]-10-canvas_x,y+rotCenter[focusedBez[5][0]][1]-10-canvas_y,20,20);
  mobilePoint[8] = new Array(x+rotCenter[focusedBez[5][0]][0]-10-canvas_x,y+rotCenter[focusedBez[5][0]][1]-10-canvas_y,20,20);
}

function drawMobilePointsRot(num,x,y,w,h){
  mobilePoint[num]=new Array(x,y,w,h);
  if(num==0){
    jg.drawImage(baseURL+"/"+"img/rot_top_left.gif",x,y,w,h,"rotate");
  }
  else if(num==1){
    jg.drawImage(baseURL+"/"+"img/skew_hor.gif",x,y,w,h,"rotate");
  }
  else if(num==2){
    jg.drawImage(baseURL+"/"+"img/rot_top_right.gif",x,y,w,h,"rotate");
  }
  else if(num==3){
    jg.drawImage(baseURL+"/"+"img/skew_ver.gif",x,y,w,h,"rotate");
  }
  else if(num==4){
    jg.drawImage(baseURL+"/"+"img/rot_bottom_right.gif",x,y,w,h,"rotate");
  }
  else if(num==5){
    jg.drawImage(baseURL+"/"+"img/skew_hor.gif",x,y,w,h,"rotate");
  }
  else if(num==6){
    jg.drawImage(baseURL+"/"+"img/rot_bottom_left.gif",x,y,w,h,"rotate");
  }
  else if(num==7){
    jg.drawImage(baseURL+"/"+"img/skew_ver.gif",x,y,w,h,"rotate");
  }
}



function setDrawRotCenter(x,y){
  rotCenter[focusedBez[5][0]] = new Array();
  rotCenter[focusedBez[5][0]][0] = x-focusedBez[1];
  rotCenter[focusedBez[5][0]][1] = y-focusedBez[2];
  jg.drawEllipse(focusedBez[1]+rotCenter[focusedBez[5][0]][0]-1-canvas_x,focusedBez[2]+rotCenter[focusedBez[5][0]][1]-1-canvas_y,2,2);
  jg.drawEllipse(focusedBez[1]+rotCenter[focusedBez[5][0]][0]-10-canvas_x,focusedBez[2]+rotCenter[focusedBez[5][0]][1]-10-canvas_y,20,20);
  mobilePoint[8] = new Array(focusedBez[1]+rotCenter[focusedBez[5][0]][0]-10-canvas_x,focusedBez[2]+rotCenter[focusedBez[5][0]][1]-10-canvas_y,20,20);
}


function hitFocusedBezRot(evt){
  x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
  y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
        if(focusedMobilePointNum ==8){ //rotcenter move
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		centerMoved=false;
		setHandlersSet(25);		
	}
	else if(focusedMobilePointNum ==0 || focusedMobilePointNum == 2 || focusedMobilePointNum ==4 || focusedMobilePointNum == 6){ //rotationPoint hit
		rotStartVector = new Array();
		rotStartVector[0] = x-(focusedBez[1]+rotCenter[focusedBez[5][0]][0]);
		rotStartVector[1] = y-(focusedBez[2]+rotCenter[focusedBez[5][0]][1]);
		dragapproved=true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(26);
	}
        else if(focusedMobilePointNum ==1){ //upper shift hit
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(27);		
	}
        else if(focusedMobilePointNum ==3){ //right shift hit
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(28);		
	}
        else if(focusedMobilePointNum ==5){ //bottom shift hit
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(29);		
	}
        else if(focusedMobilePointNum ==7){ //left shift hit
		dragapproved = true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(30);		
	}

	else{//start draw another bezier or select another region
		if(tool_selected == 6){
			setHandlersSet(9);downBezImp(x,y,0);
		}
		if(tool_selected == 2){
			//if(pointingToBez==-1){
			  pointingToBez=-1;
			  setHandlersSet(3);selectRegion_imp(x,y);
			//}
			//else{
			  //drawFocusedBez();
			//}
		}
		if(tool_selected == 8 || tool_selected == 9){
			setHandlersSet(18);downPenImp(x,y);
		}
	}

  return true; 

}

function highlightFocusedBezRot(evt){
   if(highlightFocusMonitor ) return false;
   highlightFocusMonitor = true;
   var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
   var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
   focusedMobilePointNum = -1;
   pointingToBez = (x>=focusedBez[1] && x<=(focusedBez[1]+focusedBez[3]) && y>=focusedBez[2] && y<=(focusedBez[2]+focusedBez[4]))?focusedBez[5][0]:-1;
   for(var i=0;i<=8;i++){
     if(x-canvas_x>=mobilePoint[i][0] && x-canvas_x<=mobilePoint[i][0]+mobilePoint[i][2] && y-canvas_y>=mobilePoint[i][1] && y-canvas_y<=mobilePoint[i][1]+mobilePoint[i][3]){          
	   highlightMobile = true;
	   focusedMobilePointNum = i;
	   break;
	 }
   }   
   if(focusedMobilePointNum==0 || focusedMobilePointNum==2 || focusedMobilePointNum==4 || focusedMobilePointNum==6){
     jg.setColor('#FF0000');	   
     jg.setStroke(1);   	   
     jg.drawRect(mobilePoint[0][0],mobilePoint[0][1],mobilePoint[0][2],mobilePoint[0][3]);
     jg.drawRect(mobilePoint[2][0],mobilePoint[2][1],mobilePoint[2][2],mobilePoint[2][3]);
     jg.drawRect(mobilePoint[4][0],mobilePoint[4][1],mobilePoint[4][2],mobilePoint[4][3]);
     jg.drawRect(mobilePoint[6][0],mobilePoint[6][1],mobilePoint[6][2],mobilePoint[6][3]);
     jg.setColor('#000000');	   
     canvas.style.cursor = "url("+baseURL+"/"+"img/rot.cur)";

   } 
   else if(focusedMobilePointNum==1 || focusedMobilePointNum==3 || focusedMobilePointNum==5 || focusedMobilePointNum==7){
     jg.setColor('#FF0000');	   
     jg.setStroke(1);   	   
     jg.drawRect(mobilePoint[1][0],mobilePoint[1][1],mobilePoint[1][2],mobilePoint[1][3]);
     jg.drawRect(mobilePoint[3][0],mobilePoint[3][1],mobilePoint[3][2],mobilePoint[3][3]);
     jg.drawRect(mobilePoint[5][0],mobilePoint[5][1],mobilePoint[5][2],mobilePoint[5][3]);
     jg.drawRect(mobilePoint[7][0],mobilePoint[7][1],mobilePoint[7][2],mobilePoint[7][3]);
     jg.setColor('#000000');	  
   }
   else if(focusedMobilePointNum==8){
     if(window.opera!=null){
       jg.setColor('#FF0000');
       drawRotCenter(focusedBez[1],focusedBez[2],focusedBez[3],focusedBez[4]);
       jg.setStroke(1);   	   
       jg.setColor('#000000');	   
     }else{
       canvas.style.cursor = "crosshair";
     }
   } 
   else{
     jg.restoreHiddenCanvas(2);
     jg.setColor('#000000');	   
     jg.setStroke(1);   
     canvas.style.cursor = "auto";
   }
   jg.paint();      
   highlightFocusMonitor =false;
   return true;
}


function moveFocusedBezCenter(evt){    
   if(++counter%2 == 0) return true;
   if(dragapproved){
     var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
     var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
     jg.restoreHiddenCanvas(3);
     jg.drawEllipse(x-1-canvas_x,y-1-canvas_y,2,2);
     jg.drawEllipse(x-10-canvas_x,y-10-canvas_y,20,20);
     centerMoved=true;
     jg.paint();
   }
}

function finishMoveFocusedBezCenter(evt){
   var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
   var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
   dragapproved=false;
   if(centerMoved){setDrawRotCenter(x,y);}
   else{rotCenter[focusedBez[5][0]] = new Array();drawRotCenter(focusedBez[1],focusedBez[2],focusedBez[3],focusedBez[4]);}
   drawFocusedBezRot();
}

function rotateFocusedBez(evt){
     if(++counter%2 == 0) return true;
     if(dragapproved){
     bezierModified=true;
     var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
     var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
     rotEndVector = new Array();
     rotEndVector[0] = x-(focusedBez[1]+rotCenter[focusedBez[5][0]][0]);
     rotEndVector[1] = y-(focusedBez[2]+rotCenter[focusedBez[5][0]][1]);
     var rotEndVectorLength = Math.sqrt(rotEndVector[0]*rotEndVector[0]+rotEndVector[1]*rotEndVector[1]);
     var rotStartVectorLength = Math.sqrt(rotStartVector[0]*rotStartVector[0]+rotStartVector[1]*rotStartVector[1]);
     var scalarMult = rotStartVector[0]*rotEndVector[0]+rotStartVector[1]*rotEndVector[1];
     var vectorMult = rotStartVector[0]*rotEndVector[1]-rotStartVector[1]*rotEndVector[0];
     var cos_theta = (scalarMult)/(rotEndVectorLength*rotStartVectorLength);
     var sin_theta = (vectorMult)/(rotEndVectorLength*rotStartVectorLength);
     
     var transformMatrix = new Array();
     transformMatrix[0] = new Array();
     transformMatrix[1] = new Array();
     transformMatrix[0][0] = cos_theta;
     transformMatrix[0][1] = 0-sin_theta;
     transformMatrix[1][0] = sin_theta;
     transformMatrix[1][1] = cos_theta;
     


     jg.restoreHiddenCanvas(3);
      bezSteps = new Array();
     var poppyseed = focusedBez.length-6>20?(focusedBez.length-6>30?1:2):3;
     for(var i=6;i<focusedBez.length;i++){
       bezSteps[i] = new Array();
       bezSteps[i][p] = new Array();
       bezSteps[i][m] = new Array();
       bezSteps[i][r] = new Array();

       var vx = focusedBez[i][p][0]-(focusedBez[1]+rotCenter[focusedBez[5][0]][0]);
       var vy = focusedBez[i][p][1]-(focusedBez[2]+rotCenter[focusedBez[5][0]][1]);
       var vx1 = transformMatrix[0][0]*vx+transformMatrix[0][1]*vy;
       var vy1 = transformMatrix[1][0]*vx+transformMatrix[1][1]*vy;
       bezSteps[i][p][0] = Math.floor(vx1+(focusedBez[1]+rotCenter[focusedBez[5][0]][0]));
       bezSteps[i][p][1] = Math.floor(vy1+(focusedBez[2]+rotCenter[focusedBez[5][0]][1]));
  
       vx = focusedBez[i][m][0]-(focusedBez[1]+rotCenter[focusedBez[5][0]][0]);
       vy = focusedBez[i][m][1]-(focusedBez[2]+rotCenter[focusedBez[5][0]][1]);
       vx1 = transformMatrix[0][0]*vx+transformMatrix[0][1]*vy;
       vy1 = transformMatrix[1][0]*vx+transformMatrix[1][1]*vy;
       bezSteps[i][m][0] = Math.floor(vx1+(focusedBez[1]+rotCenter[focusedBez[5][0]][0]));
       bezSteps[i][m][1] = Math.floor(vy1+(focusedBez[2]+rotCenter[focusedBez[5][0]][1]));

       vx = focusedBez[i][r][0]-(focusedBez[1]+rotCenter[focusedBez[5][0]][0]);
       vy = focusedBez[i][r][1]-(focusedBez[2]+rotCenter[focusedBez[5][0]][1]);
       vx1 = transformMatrix[0][0]*vx+transformMatrix[0][1]*vy;
       vy1 = transformMatrix[1][0]*vx+transformMatrix[1][1]*vy;
       bezSteps[i][r][0] = Math.floor(vx1+(focusedBez[1]+rotCenter[focusedBez[5][0]][0]));
       bezSteps[i][r][1] = Math.floor(vy1+(focusedBez[2]+rotCenter[focusedBez[5][0]][1]));
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

function finishRotateFocusedBez(evt){
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
        var cx = rotCenter[focusedBez[5][0]][0]+focusedBez[1];
	var cy = rotCenter[focusedBez[5][0]][1]+focusedBez[2];
        focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
        rotCenter[focusedBez[5][0]][0] = cx-focusedBez[1];
        rotCenter[focusedBez[5][0]][1] = cy-focusedBez[2]; 
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
