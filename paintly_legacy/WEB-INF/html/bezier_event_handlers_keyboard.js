function processKeyDownBez(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==27){
    finishBezier();
  }
  if(keyCode==17){//ctrl pressed
    ctrlPressed = true;
  }
  if(keyCode==16){//shift pressed
    shiftPressed = true;
  }
  if(ctrlPressed && keyCode==67){//"Ctrl+C" pressed. Perform copying focused object into buffer
    performCopyBez();
  }
  if(ctrlPressed && keyCode==86){//"Ctrl+V" pressed. Perform pasting focused object from buffer into document
    performPaste();
  }
  if(keyCode==90 && ctrlPressed){//Ctrl+Z means Undo
    performUndo();
  }
  if(keyCode==89 && ctrlPressed){//Ctrl+Y means Redo
    performRedo();
  }  
  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;
}

function processKeyUpBez(evt){
 var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl released
    ctrlPressed = false;
  }
  if(keyCode==16){//shift released
    shiftPressed = false;
  }
  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;
}

function processKeyDownFocusedBez(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl pressed
    ctrlPressed = true;
  }
  if(keyCode==16){//shift pressed
    shiftPressed = true;
  }

  if(ctrlPressed && keyCode==67){//"Ctrl+C" pressed. Perform copying focused object into buffer
    performCopyBez();
  }

  if(ctrlPressed && keyCode==86){//"Ctrl+V" pressed. Perform pasting focused object from buffer into document
    performPaste();
  }

  if(keyCode==37){// "<-" pressed
    moveLeftBez();
  }

  if(keyCode==38){// "^" pressed
    moveUpBez();
  }
  if(keyCode==39){// "->" pressed
    moveRightBez();
  }
  if(keyCode==40){// "v" pressed
    moveDownBez();
  }
  if(keyCode==46){//Del pressed
    deleteFocusedBez();
  }
  if(keyCode==90 && ctrlPressed){//Ctrl+Z means Undo
    performUndo();
  }
  if(keyCode==89 && ctrlPressed){//Ctrl+Y means Redo
    performRedo();
  }  
  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;
  
}

function processKeyUpFocusedBez(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl released
    ctrlPressed = false;
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true; 
    return false;

  }
  if(keyCode==16){//shift released
    shiftPressed = false;
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;

  }
  if(keyCode==37 || keyCode==38 || keyCode==39 || keyCode==40){
    saveBezToUndoRedoLog("update");
    sendObject(focusedBez,"update");    
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;

  }

}

function saveBezToUndoRedoLog(operation){
  if(focusedBez.length>6 && !theSameAsLastInBuffer(operation)){
    undoRedoPtr++;
    undoRedoLog[undoRedoPtr] = new Array(focusedBez[0],focusedBez[1]+scrollVectorX,focusedBez[2]+scrollVectorY,focusedBez[3],focusedBez[4],new Array(focusedBez[5][0],new Array(focusedBez[5][1][0],focusedBez[5][1][1],focusedBez[5][1][2],focusedBez[5][1][3],focusedBez[5][1][4],focusedBez[5][1][5],focusedBez[5][1][6]),new Array(focusedBez[5][2][0],focusedBez[5][2][1],focusedBez[5][2][2])));
    undoRedoLogOper[undoRedoPtr] = operation;
    for(var i=6;i<focusedBez.length;i++){
      undoRedoLog[undoRedoPtr][i] = new Array();
      undoRedoLog[undoRedoPtr][i][p] = new Array();
      undoRedoLog[undoRedoPtr][i][m] = new Array();
      undoRedoLog[undoRedoPtr][i][r] = new Array();
      undoRedoLog[undoRedoPtr][i][p][0] = focusedBez[i][p][0]+scrollVectorX;
      undoRedoLog[undoRedoPtr][i][p][1] = focusedBez[i][p][1]+scrollVectorY;
      undoRedoLog[undoRedoPtr][i][m][0] = focusedBez[i][m][0]+scrollVectorX;
      undoRedoLog[undoRedoPtr][i][m][1] = focusedBez[i][m][1]+scrollVectorY;
      undoRedoLog[undoRedoPtr][i][r][0] = focusedBez[i][r][0]+scrollVectorX;
      undoRedoLog[undoRedoPtr][i][r][1] = focusedBez[i][r][1]+scrollVectorY;
      undoRedoLog[undoRedoPtr][i][couple] = focusedBez[i][couple];
      undoRedoLog[undoRedoPtr][i][termProp] = focusedBez[i][termProp];
      undoRedoLog[undoRedoPtr][i][line] = focusedBez[i][line];
    }  
    undoRedoLog.length = undoRedoPtr+1;
    undoRedoLogOper.length = undoRedoPtr+1;

    while(undoRedoLog.length>30){//set max boundary of undo/redo log to 30 operations
      undoRedoLog = undoRedoLog.slice(1);
      undoRedoLogOper = undoRedoLogOper.slice(1);
      undoRedoPtr--;
    }
  }
}

function deleteFocusedBez(){
  saveBezToUndoRedoLog("insert");
  sendObject(focusedBez,"delete");
  regionHistory[focusedBez[5][0]] = new Array();
  focusedBez = new Array();
  mousee = new Array();
  reflected = new Array();
  node = new Array();
  mobilePoint = new Array();
  focusedmobilePointNum = -1;
  focusedPoly = new Array();
  polylineSteps = new Array();
  clearr();
  if(tool_selected==0 || tool_selected==1) setHandlersSet(0);
  if(tool_selected==2) setHandlersSet(3);
  if(tool_selected==4 || tool_selected==5) setHandlersSet(5);
  if(tool_selected==6) setHandlersSet(9);
  if(tool_selected==3) setHandlersSet(4);
  if(tool_selected==8 || tool_selected==9) setHandlersSet(18);
  if(tool_selected==10) setHandlersSet(31);
}

function performCopyBez(){
    if(focusedBez.length>5){
      copyPasteBuffer = new Array();
      copyPasteBuffer[0] = focusedBez[0];
      copyPasteBuffer[1] = focusedBez[1]+scrollVectorX;
      copyPasteBuffer[2] = focusedBez[2]+scrollVectorY;
      copyPasteBuffer[3] = focusedBez[3];
      copyPasteBuffer[4] = focusedBez[4];
      copyPasteBuffer[5] = new Array("nevermind",new Array(focusedBez[5][1][0],focusedBez[5][1][1],focusedBez[5][1][2],focusedBez[5][1][3],focusedBez[5][1][4],focusedBez[5][1][5],focusedBez[5][1][6]), new Array(focusedBez[5][2][0],focusedBez[5][2][1],focusedBez[5][2][2]));
      for(var i=6;i<focusedBez.length;i++){
        copyPasteBuffer[i] = new Array();
        copyPasteBuffer[i][p] = new Array();
        copyPasteBuffer[i][m] = new Array();
        copyPasteBuffer[i][r] = new Array();
        copyPasteBuffer[i][p][0] = focusedBez[i][p][0]+scrollVectorX;
        copyPasteBuffer[i][p][1] = focusedBez[i][p][1]+scrollVectorY;
        copyPasteBuffer[i][m][0] = focusedBez[i][m][0]+scrollVectorX;
        copyPasteBuffer[i][m][1] = focusedBez[i][m][1]+scrollVectorY;
        copyPasteBuffer[i][r][0] = focusedBez[i][r][0]+scrollVectorX;
        copyPasteBuffer[i][r][1] = focusedBez[i][r][1]+scrollVectorY;
        copyPasteBuffer[i][couple] = focusedBez[i][couple];
        copyPasteBuffer[i][termProp] = focusedBez[i][termProp];
        copyPasteBuffer[i][line] = focusedBez[i][line];
      }
      pastedCount=0;
    }
}

function performPasteBez(){
    if(copyPasteBuffer.length==0) return;
    lostFocus();
    focusedBez = new Array();
    focusedBez[0] = copyPasteBuffer[0];
    focusedBez[1] = copyPasteBuffer[1]+(pastedCount+1)*10-scrollVectorX;
    focusedBez[2] = copyPasteBuffer[2]+(pastedCount+1)*10-scrollVectorY;
    focusedBez[3] = copyPasteBuffer[3];
    focusedBez[4] = copyPasteBuffer[4];
    idd=curFigureId;
    focusedBez[5] = new Array(curFigureId++,new Array(copyPasteBuffer[5][1][0],copyPasteBuffer[5][1][1],copyPasteBuffer[5][1][2],copyPasteBuffer[5][1][3],copyPasteBuffer[5][1][4],copyPasteBuffer[5][1][5],copyPasteBuffer[5][1][6]), new Array(copyPasteBuffer[5][2][0],copyPasteBuffer[5][2][1],copyPasteBuffer[5][2][2]));

    for(var i=6;i<copyPasteBuffer.length;i++){
      focusedBez[i] = new Array();
      focusedBez[i][p] = new Array();
      focusedBez[i][m] = new Array();
      focusedBez[i][r] = new Array();
      focusedBez[i][p][0] = copyPasteBuffer[i][p][0]+(pastedCount+1)*10-scrollVectorX;
      focusedBez[i][p][1] = copyPasteBuffer[i][p][1]+(pastedCount+1)*10-scrollVectorY; 
      focusedBez[i][m][0] = copyPasteBuffer[i][m][0]+(pastedCount+1)*10-scrollVectorX; 
      focusedBez[i][m][1] = copyPasteBuffer[i][m][1]+(pastedCount+1)*10-scrollVectorY; 
      focusedBez[i][r][0] = copyPasteBuffer[i][r][0]+(pastedCount+1)*10-scrollVectorX; 
      focusedBez[i][r][1] = copyPasteBuffer[i][r][1]+(pastedCount+1)*10-scrollVectorY; 
      focusedBez[i][couple] = copyPasteBuffer[i][couple];
      focusedBez[i][termProp] = copyPasteBuffer[i][termProp];
      focusedBez[i][line] = copyPasteBuffer[i][line];
    }

    saveBezToUndoRedoLog("delete");
    sendObject(focusedBez,"insert");
    drawFocusedBez();
    pastedCount++;
}

function moveLeftBez(){
    if(shiftPressed) focusedBez[1]-=10;
    else if(ctrlPressed) focusedBez[1]-=1;
    else focusedBez[1]-=5;
    for(var i=6;i<focusedBez.length;i++){
      if(shiftPressed){
        focusedBez[i][p][0] -=10;
        focusedBez[i][m][0] -=10;
	focusedBez[i][r][0] -=10;
      }
      else if(ctrlPressed){
        focusedBez[i][p][0]-=1;
	focusedBez[i][m][0]-=1;
	focusedBez[i][r][0]-=1;
      }
      else{
        focusedBez[i][p][0]-=5;
	focusedBez[i][m][0]-=5;
	focusedBez[i][r][0]-=5;
      }
    }
    drawFocusedBez();    
}

function moveUpBez(){
    if(shiftPressed) focusedBez[2]-=10;
    else if(ctrlPressed) focusedBez[2]-=1;
    else focusedBez[2]-=5;
    for(var i=6;i<focusedBez.length;i++){
      if(shiftPressed){
        focusedBez[i][p][1] -=10;
        focusedBez[i][m][1] -=10;
	focusedBez[i][r][1] -=10;
      }
      else if(ctrlPressed){
        focusedBez[i][p][1]-=1;
	focusedBez[i][m][1]-=1;
	focusedBez[i][r][1]-=1;
      }
      else{
        focusedBez[i][p][1]-=5;
	focusedBez[i][m][1]-=5;
	focusedBez[i][r][1]-=5;
      }
    }
    drawFocusedBez();    
}

function moveRightBez(){
    if(shiftPressed) focusedBez[1]+=10;
    else if(ctrlPressed) focusedBez[1]+=1;
    else focusedBez[1]+=5;
    for(var i=6;i<focusedBez.length;i++){
      if(shiftPressed){
        focusedBez[i][p][0] +=10;
        focusedBez[i][m][0] +=10;
	focusedBez[i][r][0] +=10;
      }
      else if(ctrlPressed){
        focusedBez[i][p][0]+=1;
	focusedBez[i][m][0]+=1;
	focusedBez[i][r][0]+=1;
      }
      else{
        focusedBez[i][p][0]+=5;
	focusedBez[i][m][0]+=5;
	focusedBez[i][r][0]+=5;
      }
    }
    drawFocusedBez();    
}

function moveDownBez(){
    if(shiftPressed) focusedBez[2]+=10;
    else if(ctrlPressed) focusedBez[2]+=1;
    else focusedBez[2]+=5;
    for(var i=6;i<focusedBez.length;i++){
      if(shiftPressed){
        focusedBez[i][p][1]+=10;
        focusedBez[i][m][1]+=10;
	focusedBez[i][r][1]+=10;
      }
      else if(ctrlPressed){
        focusedBez[i][p][1]+=1;
	focusedBez[i][m][1]+=1;
	focusedBez[i][r][1]+=1;
      }
      else{
        focusedBez[i][p][1]+=5;
	focusedBez[i][m][1]+=5;
	focusedBez[i][r][1]+=5;
      }
    }
    drawFocusedBez();    
}


function performUndoBez(){

  if(undoRedoPtr>0 && undoRedoLog.length>=undoRedoPtr){
    if(undoRedoLog[undoRedoPtr][0]=='bezier'){//undo for bezier
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
      var bezInfo = new Array(undoRedoLog[ind][5][0],new Array(undoRedoLog[ind][5][1][0],undoRedoLog[ind][5][1][1],undoRedoLog[ind][5][1][2],undoRedoLog[ind][5][1][3],undoRedoLog[ind][5][1][4],undoRedoLog[ind][5][1][5],undoRedoLog[ind][5][1][6]), new Array(undoRedoLog[ind][5][2][0],undoRedoLog[ind][5][2][1],undoRedoLog[ind][5][2][2]));
      focusedBez = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],bezInfo);

      for(var i=6;i<undoRedoLog[ind].length;i++){
	focusedBez[i] = new Array();
        focusedBez[i][p] = new Array();
        focusedBez[i][m] = new Array();
        focusedBez[i][r] = new Array();
        focusedBez[i][p][0]=undoRedoLog[ind][i][p][0]-scrollVectorX;
        focusedBez[i][p][1]=undoRedoLog[ind][i][p][1]-scrollVectorY;
        focusedBez[i][m][0]=undoRedoLog[ind][i][m][0]-scrollVectorX;
        focusedBez[i][m][1]=undoRedoLog[ind][i][m][1]-scrollVectorY;
        focusedBez[i][r][0]=undoRedoLog[ind][i][r][0]-scrollVectorX;
        focusedBez[i][r][1]=undoRedoLog[ind][i][r][1]-scrollVectorY;
        focusedBez[i][couple]=undoRedoLog[ind][i][couple];
        focusedBez[i][termProp]=undoRedoLog[ind][i][termProp];
        focusedBez[i][line]=undoRedoLog[ind][i][line];

      }
      sendObject(focusedBez,undoRedoLogOper[undoRedoPtr]); objectModified=false;
          idd = focusedBez[5][0];              
          mousee = new Array();
          node = new Array();
          reflected = new Array();
          stepNum = -1;
	  createFocusedBezDiv(focusedBez);
          drawFocusedBez();              
      if(oper=='delete'){
	regionHistory[focusedBez[5][0]] = new Array();
        focusedBez = new Array();        
        if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="bezier"){
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
        else if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="image"){
            focusedImage = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],undoRedoLog[ind-1][5]);
            idd = focusedImage[5];              
            drawFocusedImage();              
        }

	else{
	  clearr();
          mobilePoint = new Array();          
          focusedMobilePointNum = -1;
          x=0;y=0;x1=0;y1=0;
          setHandlersSet(9);
        }
      }
      else{
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
        idd = focusedBez[5][0];     
          mousee = new Array();
          node = new Array();
          reflected = new Array();
          stepNum = -1;
        createFocusedBezDiv(focusedBez);
        drawFocusedBez();              
      }
    }
    undoRedoPtr--;
  }
}

function performRedoBez(){
  if(undoRedoPtr < undoRedoLog.length-1){
    if(undoRedoLog[undoRedoPtr+1][0]=='bezier'){//undo for bezier
      if(undoRedoLogOper[undoRedoPtr+1]=='selection'){
        undoRedoPtr++;
        performRedo();
        return;
      }
      undoRedoPtr++; 
      var ind = undoRedoPtr;
      var bezInfo = new Array(undoRedoLog[ind][5][0],new Array(undoRedoLog[ind][5][1][0],undoRedoLog[ind][5][1][1],undoRedoLog[ind][5][1][2],undoRedoLog[ind][5][1][3],undoRedoLog[ind][5][1][4],undoRedoLog[ind][5][1][5],undoRedoLog[ind][5][1][6]), new Array(undoRedoLog[ind][5][2][0],undoRedoLog[ind][5][2][1],undoRedoLog[ind][5][2][2]));
      focusedBez = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],bezInfo);


      for(var i=6;i<undoRedoLog[ind].length;i++){
	focusedBez[i] = new Array();
        focusedBez[i][p] = new Array();
        focusedBez[i][m] = new Array();
        focusedBez[i][r] = new Array();
        focusedBez[i][p][0]=undoRedoLog[ind][i][p][0]-scrollVectorX;
        focusedBez[i][p][1]=undoRedoLog[ind][i][p][1]-scrollVectorY;
        focusedBez[i][m][0]=undoRedoLog[ind][i][m][0]-scrollVectorX;
        focusedBez[i][m][1]=undoRedoLog[ind][i][m][1]-scrollVectorY;
        focusedBez[i][r][0]=undoRedoLog[ind][i][r][0]-scrollVectorX;
        focusedBez[i][r][1]=undoRedoLog[ind][i][r][1]-scrollVectorY;
        focusedBez[i][couple]=undoRedoLog[ind][i][couple];
        focusedBez[i][termProp]=undoRedoLog[ind][i][termProp];
        focusedBez[i][line]=undoRedoLog[ind][i][line];

      }


      idd = focusedBez[5][0];
          mousee = new Array();
          node = new Array();
          reflected = new Array();
          stepNum = -1;

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


      sendObject(focusedBez,oper);bezierModified=false;
      if(oper!='delete'){
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
        idd = focusedBez[5][0];     
          mousee = new Array();
          node = new Array();
          reflected = new Array();
          stepNum = -1;

        createFocusedBezDiv(focusedBez);
        drawFocusedBez();              

        
      }
      else{
          regionHistory[focusedBez[5][0]] = new Array();
 	  clearr();
          x=0;y=0;x1=0;y1=0;
          focusedBez = new Array();
          mobilePoint = new Array();
          mousee = new Array();
          node = new Array();
          reflected = new Array();
          stepNum = -1;
          focusedMobilePointNum = -1;
          setHandlersSet(9);       
      }
 
    }
  }
}


function theSameAsLastInBuffer(oper){
  if(undoRedoPtr>=0){
    if(undoRedoLog[undoRedoPtr].length!=focusedBez.length) return false;
    if(undoRedoLogOper[undoRedoPtr]!=oper) return false;
    for(var i=0;i<5;i++){
      if(focusedBez[i] != undoRedoLog[undoRedoPtr][i]) return false;
    }
    
    //compare BezInfo section of focusedBez and undoRedoLog
    if(focusedBez[5][0]!=undoRedoLog[undoRedoPtr][5][0]) return false;
    for(var i=1;i<3;i++){
      for(var j=0;j<focusedBez[5][i].length;j++){
        if(focusedBez[5][i][j]!=undoRedoLog[undoRedoPtr][5][i][j]) return false;
      }
    }

    for(var i=6;i<focusedBez.length;i++){
      for(var j=0;j<focusedBez[i].length;j++){
        if(focusedBez[i][j].length>0){
          for(var k=0;k<focusedBez[i][j].length;k++){
            if(focusedBez[i][j][k]+((1-k)*scrollVectorX+k*scrollVectorY)!=undoRedoLog[undoRedoPtr][i][j][k]) return false;
          }
        }
        else{
	  if(focusedBez[i][j]!=undoRedoLog[undoRedoPtr][i][j]) return false;
        }
      } 
    }
    return true;
  }
  return false;
  
}