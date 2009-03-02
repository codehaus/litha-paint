var focusedImage = new Array();//"image",left,top,width,height,id.

function drawFocusedImage(){
  clearr();
  jg.storeHiddenCanvas(1);
  var x = focusedImage[1];
  var y = focusedImage[2];
  var width = focusedImage[3];
  var height = focusedImage[4];

  jg.setColor('#000000');  

jg.drawRect(x-canvas_x,y-canvas_y,width,height);

  mobilePoint = new Array();
  drawMobilePoints(0,x-3-canvas_x,y-3-canvas_y,6,6);
  	drawMobilePoints(1,(2*x+width-6-2*canvas_x)/2,y-3-canvas_y,6,6);
  drawMobilePoints(2,x+width-3-canvas_x,y-3-canvas_y,6,6);
    drawMobilePoints(3,x+width-3-canvas_x,(2*y+height-6-2*canvas_y)/2,6,6);
  drawMobilePoints(4,x+width-3-canvas_x,y+height-3-canvas_y,6,6);
  	drawMobilePoints(5,(2*x-6+width-2*canvas_x)/2,y+height-3-canvas_y,6,6);
  drawMobilePoints(6,x-3-canvas_x,y+height-3-canvas_y,6,6);
    drawMobilePoints(7,x-3-canvas_x,(2*y-6+height-2*canvas_y)/2,6,6);
	
  drawMobileCenter(x,y,width,height);
  jg.setColor('#00FF00');
  jg.setStroke(1);
  jg.paint();
  jg.storeHiddenCanvas(2);
  setHandlersSet(45);
}

function highlightImageFocus(evt){
   if(focusedImage && focusedImage.length>5){
	   if(highlightFocusMonitor ) return false;
	   highlightFocusMonitor = true;
	   var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft()+f_scrollLeft();
	   var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop()+f_scrollTop();
	   var highlight = false;
	   focusedMobilePointNum = -1;
	   for(var i=0;i<9;i++){
	     if(x-canvas_x>=mobilePoint[i][0] && x-canvas_x<=mobilePoint[i][0]+mobilePoint[i][2] && y-canvas_y>=mobilePoint[i][1] && y-canvas_y<=mobilePoint[i][1]+mobilePoint[i][3]){          
		   highlight = true;
		   focusedMobilePointNum = i;
		   break;
		 }
	   }
	   
	   if(highlight){
	   	   jg.setColor('#FF0000');	   
		   jg.setStroke(1);   
	       jg.drawRect(focusedImage[1]-canvas_x,focusedImage[2]-canvas_y,focusedImage[3],focusedImage[4]);
		   for(var j=0;j<8;j++){
		     jg.fillRect(mobilePoint[j][0],mobilePoint[j][1],mobilePoint[j][2],mobilePoint[j][3]);
		   }
		   jg.setStroke(3);
	       jg.drawLine((2*(mobilePoint[0][0]+3)+focusedImage[3])/2-6,(2*(mobilePoint[0][1]+3)+focusedImage[4])/2-6,(2*(mobilePoint[0][0]+3)+focusedImage[3])/2+4,(2*(mobilePoint[0][1]+3)+focusedImage[4])/2+4);
	       jg.drawLine((2*(mobilePoint[0][0]+3)+focusedImage[3])/2+4,(2*(mobilePoint[0][1]+3)+focusedImage[4])/2-6,(2*(mobilePoint[0][0]+3)+focusedImage[3])/2-6,(2*(mobilePoint[0][1]+3)+focusedImage[4])/2+4);
		   jg.setStroke(1);   
	   } 
	   else{
	       jg.restoreHiddenCanvas(2);
	   }
	   jg.paint();      
	   highlightFocusMonitor =false;
	   return true;
   }
}

function hitImageFocus(evt){
	x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
        hitImageFocusImp(x,y);
}

function hitImageFocusImp(x,y){
	if(focusedMobilePointNum != -1){ //mobilePoint hit
		dragapproved=true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(46);
		return true;
	}
	else{//start draw another shape
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

		return true;
	}
}

function resizeFocusedImage(evt){
	if(++counter%2 == 0) return;
	if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){
		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		jg.restoreHiddenCanvas(3);
		jg.setColor("#00FF00");
	    jg.setStroke(1);
			
		var t_x=focusedImage[1];
		var t_y=focusedImage[2];
		var t_w=focusedImage[3];
		var t_h=focusedImage[4];
		if(x>x1){t_x=x1;t_w=focusedImage[1]-x1;}
		if(y>y1){t_y=y1;t_h=focusedImage[2]-y1;}
		objectModified = true;
		jg.drawRect(focusedImage[1]-canvas_x+eval(weights[focusedMobilePointNum][0]), focusedImage[2]-canvas_y+eval(weights[focusedMobilePointNum][1]), focusedImage[3]+eval(weights[focusedMobilePointNum][2]), focusedImage[4]+eval(weights[focusedMobilePointNum][3]));
		left = focusedImage[1]+eval(weights[focusedMobilePointNum][0]);
		top = focusedImage[2]+eval(weights[focusedMobilePointNum][1]);		
		width = focusedImage[3]+eval(weights[focusedMobilePointNum][2]);
		height = focusedImage[4]+eval(weights[focusedMobilePointNum][3]);

		jg.paint();
		return true;
	}
}

function finishResizeFocusedImage(evt){
        focusedImage = new Array("image",left,top,width,height,idd);
	if (objectModified){saveImageToUndoRedoLog("update");sendObject(focusedImage,"update");objectModified=false;}
	x=0;y=0;x1=0;y1=0;

	
	dragapproved=false;
	jg.restoreHiddenCanvas(0);
	jg.paint();
	drawFocusedImage();
	return true;
}

function saveImageToUndoRedoLog(operation){
  undoRedoPtr++;  
  undoRedoLog[undoRedoPtr] = new Array();
  undoRedoLogOper[undoRedoPtr] = operation;
  undoRedoLog[undoRedoPtr] = new Array(focusedImage[0],focusedImage[1]+scrollVectorX, focusedImage[2]+scrollVectorY, focusedImage[3], focusedImage[4], focusedImage[5]);
  undoRedoLog.length = undoRedoPtr+1;
  undoRedoLogOper.length = undoRedoPtr+1;
}

function processKeyDownFocusedImage(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl pressed
    ctrlPressed = true;
  }
  if(keyCode==16){//shift pressed
    shiftPressed = true;
  }

  if(ctrlPressed && keyCode==67){//"Ctrl+C" pressed. Perform copying focused object into buffer
    performCopyImage();
  }
  if(ctrlPressed && keyCode==86){//"Ctrl+V" pressed. Perform pasting focused object from buffer into document
    performPaste();
  }
  if(keyCode==46){//Del pressed
    deleteFocusedImage();
  }
  if(keyCode==90 && ctrlPressed){//Ctrl+Z means Undo
    performUndo();
  }
  if(keyCode==89 && ctrlPressed){//Ctrl+Y means Redo
    performRedo();
  }  
  if(keyCode==37){// "<-" pressed
    moveLeftImage();
  }

  if(keyCode==38){// "^" pressed
    moveUpImage();
  }
  if(keyCode==39){// "->" pressed
    moveRightImage();
  }
  if(keyCode==40){// "v" pressed
    moveDownImage();
  }
  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;

}

function processKeyUpFocusedImage(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl released
    ctrlPressed = false;
  }
  if(keyCode==16){//shift released
    shiftPressed = false;
  }
  if(keyCode==37 || keyCode==38 || keyCode==39 || keyCode==40){
    saveImageToUndoRedoLog("update");
    sendObject(focusedImage,"update");    
  }

  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;
}

function performUndoImage(){

  if(undoRedoPtr>0 && undoRedoLog.length>=undoRedoPtr){
    if(undoRedoLog[undoRedoPtr][0]=='image'){//undo for image
      var oper = undoRedoLogOper[undoRedoPtr];
      var ind;
      if(oper=='selection'){
        undoRedoPtr--;
        performUndo();
        return;
      }
      if(oper=='update' ){//|| oper=='selection'
        ind=undoRedoPtr-1;
      }else{
        ind=undoRedoPtr;
      }

      focusedImage = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],undoRedoLog[ind][5]);

      sendObject(focusedImage,undoRedoLogOper[undoRedoPtr]); objectModified=false;
          idd = focusedImage[5];
          drawFocusedImage();
      if(oper=='delete'){
	regionHistory[focusedImage[5]] = new Array();
        focusedImage = new Array();        
        if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="image"){
            focusedImage = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],undoRedoLog[ind-1][5]);
            idd = focusedImage[5];              
            drawFocusedImage();              
        }
	else if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="bezier"){
            bezInfo = new Array(undoRedoLog[ind-1][5][0],new Array(undoRedoLog[ind-1][5][1][0],undoRedoLog[ind-1][5][1][1],undoRedoLog[ind-1][5][1][2],undoRedoLog[ind-1][5][1][3],undoRedoLog[ind-1][5][1][4],undoRedoLog[ind-1][5][1][5],undoRedoLog[ind-1][5][1][6]), new Array(undoRedoLog[ind-1][5][2][0],undoRedoLog[ind-1][5][2][1],undoRedoLog[ind-1][5][2][2]));
            focusedBez = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],bezInfo);
            for(var i=6;i<undoRedoLog[ind-1].length;i++){
              focusedBez[i] = new Array();
              focusedBez[i][p] = new Array();
              focusedBez[i][m] = new Array();
              focusedBez[i][r] = new Array();
              focusedBez[i][p][0]=undoRedoLog[ind-1][i][p][0]-scrollVectorX;
              focusedBez[i][p][1]=undoRedoLog[ind-1][i][p][1]-scrollVectorY;
              focusedBez[i][m][0]=undoRedoLog[ind-1][i][m][0]-scrollVectorX;
              focusedBez[i][m][1]=undoRedoLog[ind-1][i][m][1]-scrollVectorY;
              focusedBez[i][r][0]=undoRedoLog[ind-1][i][r][0]-scrollVectorX;
              focusedBez[i][r][1]=undoRedoLog[ind-1][i][r][1]-scrollVectorY;
              focusedBez[i][couple]=undoRedoLog[ind-1][i][couple];
              focusedBez[i][termProp]=undoRedoLog[ind-1][i][termProp];
              focusedBez[i][line]=undoRedoLog[ind-1][i][line];
            }
            idd = focusedBez[5][0];
            mousee = new Array();
            node = new Array();
            reflected = new Array();
            stepNum = -1;
            createFocusedBezDiv(focusedBez);
            drawFocusedBez();
        }
        else if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="text"){
          textInfo = new Array(undoRedoLog[ind-1][5][0],undoRedoLog[ind-1][5][1],undoRedoLog[ind-1][5][2],undoRedoLog[ind-1][5][3],undoRedoLog[ind-1][5][4],undoRedoLog[ind-1][5][5],undoRedoLog[ind-1][5][6]);
          focusedText = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],textInfo,undoRedoLog[ind-1][6]);
          left = focusedText[1];top = focusedText[2]; width = focusedText[3]; height = focusedText[4];     
          idd = focusedText[5][0];              
          drawFocusedText();              
        }
	else{
	  clearr();
          mobilePoint = new Array();          
          focusedMobilePointNum = -1;
          x=0;y=0;x1=0;y1=0;
          setHandlersSet(3);
        }
      }
      else{
        regionHistory[focusedImage[5]] = new Array(focusedImage[0],focusedImage[1]+scrollVectorX,focusedImage[2]+scrollVectorY,focusedImage[3],focusedImage[4],focusedImage[5]);
        idd = focusedImage[5];     
        drawFocusedImage();              
      }
    }
    undoRedoPtr--;
  }
}

function performRedoImage(){
  if(undoRedoPtr < undoRedoLog.length-1){
    if(undoRedoLog[undoRedoPtr+1][0]=='image'){//undo for image
      if(undoRedoLogOper[undoRedoPtr+1]=='selection'){
        undoRedoPtr++;
        performRedo();
        return;
      }
      undoRedoPtr++; 
      var ind = undoRedoPtr;
      focusedImage = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],undoRedoLog[ind][5]);
      idd = focusedImage[5];
      var oper;
      if(undoRedoLogOper[undoRedoPtr]=='insert'){
         oper = 'delete';
      }
      else if(undoRedoLogOper[undoRedoPtr]=='delete'){
         oper = 'insert';
      }
      else if(undoRedoLogOper[undoRedoPtr]=='update'){
         oper = 'update';
      }
      else if(undoRedoLogOper[undoRedoPtr]=='selection'){
         oper = 'update';
      }


      sendObject(focusedImage,oper);
      if(oper!='delete'){
        regionHistory[focusedImage[5]] = new Array(focusedImage[0],focusedImage[1]+scrollVectorX,focusedImage[2]+scrollVectorY,focusedImage[3],focusedImage[4],focusedImage[5]);
        idd = focusedImage[5];     
        drawFocusedImage();                      
      }
      else{
          regionHistory[focusedImage[5]] = new Array();
 	  clearr();
          x=0;y=0;x1=0;y1=0;
          focusedImage = new Array();
          focusedMobilePointNum = -1;
          setHandlersSet(3);       
      }
 
    }
  }
}

function deleteFocusedImage(){
  saveImageToUndoRedoLog("insert");
  sendObject(focusedImage,"delete");
  regionHistory[focusedImage[5]] = new Array();
  focusedImage = new Array();
  focusedmobilePointNum = -1;
  clearr();
  if(tool_selected==0 || tool_selected==1) setHandlersSet(0);
  if(tool_selected==2) setHandlersSet(3);
  if(tool_selected==4 || tool_selected==5) setHandlersSet(5);
  if(tool_selected==6) setHandlersSet(9);
  if(tool_selected==3) setHandlersSet(4);
  if(tool_selected==8 || tool_selected==9) setHandlersSet(18);
  if(tool_selected==10) setHandlersSet(31);
}

function performCopyImage(){
    if(focusedImage.length==6){
      copyPasteBuffer = new Array();
      copyPasteBuffer[0] = focusedImage[0];
      copyPasteBuffer[1] = focusedImage[1]+scrollVectorX;
      copyPasteBuffer[2] = focusedImage[2]+scrollVectorY;
      copyPasteBuffer[3] = focusedImage[3];
      copyPasteBuffer[4] = focusedImage[4];
      copyPasteBuffer[5] = focusedImage[5];
      pastedCount=0;
    }
}

function performPasteImage(){
    if(copyPasteBuffer.length==0) return;
    lostFocus();
    focusedImage = new Array();
    focusedImage[0] = copyPasteBuffer[0];
    focusedImage[1] = copyPasteBuffer[1]+(pastedCount+1)*10-scrollVectorX;
    focusedImage[2] = copyPasteBuffer[2]+(pastedCount+1)*10-scrollVectorY;
    focusedImage[3] = copyPasteBuffer[3];
    focusedImage[4] = copyPasteBuffer[4];
    focusedImage[5] = curFigureId;
    idd=curFigureId;
    curFigureId++;
    saveImageToUndoRedoLog("delete");
    focusedImage[6] = copyPasteBuffer[5];//focusedImage + id of a copy prototype
    sendObject(focusedImage,"copy_image");
    focusedImage.length--;
    drawFocusedImage();
    pastedCount++;
}

function deleteFocusedImage(){
  saveImageToUndoRedoLog("insert");
  sendObject(focusedImage,"delete");  
  regionHistory[focusedImage[5]] = new Array();
  focusedImage = new Array();
  focusedmobilePointNum = -1;
  clearr();

  x=0;y=0;x1=0;y1=0;
}

function moveLeftImage(){
    if(shiftPressed) focusedImage[1]-=10;
    else if(ctrlPressed) focusedImage[1]-=1;
    else focusedImage[1]-=5;
    drawFocusedImage();    
}

function moveUpImage(){
    if(shiftPressed) focusedImage[2]-=10;
    else if(ctrlPressed) focusedImage[2]-=1;
    else focusedImage[2]-=5;
    drawFocusedImage();    
}

function moveRightImage(){
    if(shiftPressed) focusedImage[1]+=10;
    else if(ctrlPressed) focusedImage[1]+=1;
    else focusedImage[1]+=5;
    drawFocusedImage();    
}

function moveDownImage(){
    if(shiftPressed) focusedImage[2]+=10;
    else if(ctrlPressed) focusedImage[2]+=1;
    else focusedImage[2]+=5;
    drawFocusedImage();    
}


