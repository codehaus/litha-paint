//var focusedTextId;
var focusedText = new Array();
var textCommandType = 'insert'; // 'insert' || 'update'

var text_color	= 1;
var text_size	= 2;
var text_weight	= 3;
var text_style	= 4;
var text_decoration = 5;
var text_family = 6;

function downText(evt){
  t_x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
  t_y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
  downText_imp(t_x,t_y);
  return true;
}

function downText_imp(t_x1, t_y1){
  lostFocus();
  x = t_x1;
  y = t_y1;
  x1=x;y1=y;
  dragapproved=true;
  jg.storeHiddenCanvas(0);
}


function moveText(evt){
  if(++counter%2 == 0) return true;
  if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true){	
    x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
    y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
    jg.restoreHiddenCanvas(0);
    jg.setColor("#00FF00");
    jg.setStroke(1);    
    var w = x1-x;
    var h = y1-y;
    jg.drawRect(x-canvas_x, y-canvas_y, w, h);    
    jg.paint();
    left = x;
    top = y;
    width = w;
    height = h;
    idd = curFigureId;
    return true;
  }
}

function releaseText(evt){
  dragapproved=false;
  if(x==x1 || y==y1) return;
  jg.restoreHiddenCanvas(0);

/*  
  jg.setFont("Helvetica",20);
  jg.setColor("#000000");
  jg.drawString('<SPAN style="TEXT-DECORATION: underline">&nbsp;</SPAN>',curFigureId,left-canvas_x,top-canvas_y);
  jg.paint();
  jg.storeHiddenCanvas(5);
  var div = document.getElementById(curFigureId);
  jg.setColor("#00FF00");
  jg.drawRect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
  left = div.offsetLeft; top = div.offsetTop; width = div.offsetWidth; height = div.offsetHeight;
  jg.paint();
  jg.storeHiddenCanvas(6);
*/  

  createEditBox(left-canvas_x, top-canvas_y, width, height, curFigureId);  
  textInfo = new Array(curFigureId, strokeColor, fontSize, fontWeight, fontStyle, textDecoration, fontFamily);  
  focusedText = new Array("text", left, top, width, height, textInfo, '');
  curFigureId++;
/*  
  if(obj = document.getElementById('textarea_'+focusedText[5][0])){
	obj.focus();
  }
*/
  if(objFontPanel != null) {
	  objFontPanel.setState();
  }  
  
  jg.storeHiddenCanvas(0);
  setHandlersSet(15);

  return false;
}

function deleteFocusedText(){
  saveTextToUndoRedoLog("insert");
  sendObject(focusedText,"delete");  
 
  //saveTextToUndoRedoLog("insert");
  regionHistory[focusedText[5][0]] = new Array();
  focusedText = new Array();
  mobilePoint = new Array();
  focusedmobilePointNum = -1;
  clearr();

  x=0;y=0;x1=0;y1=0;
}

function freezeText(evt){
  dragapproved=false;
  var textValue = '';
  if(focusedText && focusedText.length>0){
	  var textarea = document.getElementById('textarea_'+focusedText[5][0]);
	  if(textarea != null){
		x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
/*	
		if(focusedMobilePointNum != -1 || 
		(x >= left && x <= left+removePx(textarea.style.width) && y >= top && y <= top+removePx(textarea.style.height))){
			return true;
		}
*/

		if(isLanguageNotPermitt(textarea.value)){
			alert('Limitations: only latin letters are permitted');
			textarea.value = '';
		}

		if(textarea.value.length == 0){
			// delete focusedText
		  if(textCommandType == 'update') deleteFocusedText();
		  else{
		     focusedText = new Array();
		     mobilePoint = new Array();
		     focusedmobilePointNum = -1;
		     clearr();
		     x=0;y=0;x1=0;y1=0;
              }
		  if(tool_selected == 2){
			setHandlersSet(3);  
		  }
		  if(tool_selected == 7){
			setHandlersSet(14);
		  }
		  			
		}else{
			// send to server focusedText
			if(objDiv = document.getElementById(focusedText[5][0])){	
				objDiv.style.width	= textarea.style.width;
				objDiv.style.clip	= setClipWidth(objDiv, textarea.style.width);
			}		
			
			var regExp = /\n/gi;
			textValue = textarea.value.replace(regExp,'<BR>');
	
			if(isFocusedTextChanged(focusedText, textValue)){
				// TODO: save To UndoRedo Log delete->insert
				textInfo = new Array(focusedText[5][0], strokeColor, fontSize, fontWeight, fontStyle, textDecoration, fontFamily);  
				focusedText = new Array("text", left, top, width, height, textInfo, textValue);
				prosessLines();
                                if(textCommandType=="insert") saveTextToUndoRedoLog("delete");
                                if(textCommandType=="update") saveTextToUndoRedoLog("update");
				sendObject(focusedText,textCommandType);
			}		
			x=0;y=0;x1=0;y1=0;
			drawFocusedText();
		}
	  }
	}
  return true;  
}


function drawFocusedText(){
  clearr();
  jg.storeHiddenCanvas(1);
  var x = focusedText[1];
  var y = focusedText[2];
  var width = focusedText[3];
  var height = focusedText[4];

  jg.setColor('#000000');  
  jg.drawRect(x-canvas_x,y-canvas_y,width,height);
  mobilePoint = new Array();
//  drawMobilePoints(0,x-3,y-3,6,6);
//  	drawMobilePoints(1,(2*x+width-6)/2,y-3,6,6);
//  drawMobilePoints(2,x+width-3,y-3,6,6);
//    drawMobilePoints(3,x+width-3,(2*y+height-6)/2,6,6);
//  drawMobilePoints(4,x+width-3,y+height-3,6,6);
//  	drawMobilePoints(5,(2*x-6+width)/2,y+height-3,6,6);
//  drawMobilePoints(6,x-3,y+height-3,6,6);
//    drawMobilePoints(7,x-3,(2*y-6+height)/2,6,6);
	
  jg.setStroke(3);
  mobilePoint[8] = new Array((2*x+width)/2-6-canvas_x,(2*y+height)/2-6-canvas_y,10,10);
  jg.drawLine(mobilePoint[8][0],mobilePoint[8][1],mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1]+mobilePoint[8][3]);
  jg.drawLine(mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1],mobilePoint[8][0],mobilePoint[8][1]+mobilePoint[8][3]);

  jg.setColor('#00FF00');
  jg.setStroke(1);
  jg.paint();
  jg.storeHiddenCanvas(2);
  setHandlersSet(16);  
  //lostFocus();  
  //setHandlersSet(3);
}

function highlightTextFocus(evt){
   if(highlightFocusMonitor ) return false;
   if(focusedText.length < 6){
	focusedText = new Array();
	return false;
   }

   highlightFocusMonitor = true;
   var x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
   var y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
   var highlight = false;
   focusedMobilePointNum = -1;
   
     if(x-canvas_x>=mobilePoint[8][0] && x-canvas_x<=mobilePoint[8][0]+mobilePoint[8][2] 
		&& y-canvas_y>=mobilePoint[8][1] && y-canvas_y<=mobilePoint[8][1]+mobilePoint[8][3]){
	   highlight = true;
	   focusedMobilePointNum = 8;
     }

   
   if(highlight){
        if(window.opera != null){
   	   jg.setColor('#FF0000');	   
	   jg.setStroke(1);   
           jg.drawRect(focusedText[1]-canvas_x,focusedText[2]-canvas_y,focusedText[3],focusedText[4]);
	   jg.setStroke(3);
           jg.drawLine(mobilePoint[8][0],mobilePoint[8][1],mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1]+mobilePoint[8][3]);
           jg.drawLine(mobilePoint[8][0]+mobilePoint[8][2],mobilePoint[8][1],mobilePoint[8][0],mobilePoint[8][1]+mobilePoint[8][3]);
	   jg.setStroke(1);   
        }
        else{
           canvas.style.cursor = "move";
        }
   }else{
       if(window.opera != null )jg.restoreHiddenCanvas(2);
       else canvas.style.cursor = "auto";
   }
        jg.paint();      
		highlightFocusMonitor =false;
		return true;
}

function hitTextFocus(evt){
	x=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	y=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
	if(focusedMobilePointNum != -1 || 
	(x >= focusedText[1] && x <= focusedText[1]+focusedText[3] 
	&& y >= focusedText[2] && y <= focusedText[2]+focusedText[4])){ //mobilePoint hit
		dragapproved=true;
		jg.storeHiddenCanvas(3);
		setHandlersSet(17);
		return true;
	}
	else{//start draw another shape
		if(tool_selected == 7){
			setHandlersSet(14);downText_imp(x,y);
		}
		else if(tool_selected == 2){
			setHandlersSet(3);selectRegion_imp(x,y);
		}
		return true;
	}
}

function moveFocusedText(evt){
	if(++counter%2 == 0) return;

		y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
	//(x1 >= focusedText[1] && x1 <= focusedText[1] + focusedText[3] && y1 >= focusedText[2] && y1 <= focusedText[2] + focusedText[4])
	if ((evt?(evt.button==65535 || evt.button == 0):event.button==1) && dragapproved == true && focusedMobilePointNum != -1){
		jg.restoreHiddenCanvas(3);
		jg.setColor("#00FF00");
	    jg.setStroke(1);   
			
		var t_x=focusedText[1];
		var t_y=focusedText[2];
		var t_w=focusedText[3];
		var t_h=focusedText[4];
		if(x>x1){t_x=x1;t_w=focusedText[1]-x1;}
		if(y>y1){t_y=y1;t_h=focusedText[2]-y1;}

		jg.setFont(fontFamily, fontSize, objFontPanel.getJsFontStyle());
	    jg.drawString(removeSPAN(focusedText[6]),focusedText[5][0],focusedText[1]+eval(weights[8][0])-canvas_x, 
	    focusedText[2]+eval(weights[focusedMobilePointNum][1])-canvas_y);

		left = focusedText[1]+eval(weights[8][0]);
		top = focusedText[2]+eval(weights[8][1]);		
		width = focusedText[3]+eval(weights[8][2]);
		height = focusedText[4]+eval(weights[8][3]);

		jg.paint();
		return true;
	}else{
	
	  lostFocus();
	  setHandlersSet(3);
	  tool_selected = 2;
	  return true;
	  
	}
	
}

function finishMoveFocusedText(evt){
	div = document.getElementById(focusedText[5][0]);
	if(div){
	
	textInfo = new Array(focusedText[5][0], strokeColor, fontSize, fontWeight, fontStyle, textDecoration, fontFamily);
	focusedText = new Array("text", left, top, width, height, textInfo, focusedText[6]);
	saveTextToUndoRedoLog("update");
	sendObject(focusedText,"update");
	x=0;y=0;x1=0;y1=0;
	dragapproved=false;
	jg.restoreHiddenCanvas(0);
	jg.paint();
	drawFocusedText();
	}
	return true;
}

function processOnKeyDownFocusedText(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==46){
    deleteFocusedText();
    return false;
  }
  if(keyCode==17){//ctrl pressed
    ctrlPressed = true;
  }
  if(keyCode==16){//shift pressed
    shiftPressed = true;
  }

  if(ctrlPressed && keyCode==67){//"Ctrl+C" pressed. Perform copying focused object into buffer
    performCopyText();
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
  if(keyCode==37){// "<-" pressed
    moveLeftText();
  }

  if(keyCode==38){// "^" pressed
    moveUpText();
  }
  if(keyCode==39){// "->" pressed
    moveRightText();
  }
  if(keyCode==40){// "v" pressed
    moveDownText();
  }
  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;

}

function processOnKeyUpFocusedText(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
  if(keyCode==17){//ctrl released
    ctrlPressed = false;
  }
  if(keyCode==16){//shift released
    shiftPressed = false;
  }
  if(keyCode==37 || keyCode==38 || keyCode==39 || keyCode==40){
    saveTextToUndoRedoLog("update");
    sendObject(focusedText,"update");    
  }

  if(evt)evt.returnValue=false;else event.returnValue=false;
  if(evt)evt.cancel = true;else event.cancelBubble=true;

  return false;
}


function regenerateText(evt){
	var horizontalScrollHeight = 25;

	dragapproved=false;
	if(x==x1 || y==y1) return;
	//jg.restoreHiddenCanvas(0);
	
	createEditBox(left-canvas_x, top-canvas_y, focusedText[3], focusedText[4] + horizontalScrollHeight, focusedText[5][0]);
	textarea = document.getElementById('textarea_'+focusedText[5][0]);
	
	if(textarea){
		var regExp = /<BR>/gi;
		textValue = focusedText[6].replace(regExp,'\n');
		textarea.value = textValue;
	}
	
	textCommandType = 'update';

	if(objFontPanel != null) {
		objFontPanel.initState();
		objFontPanel.setState();
	}
	
	setHandlersSet(15);	
	return true;
}


function saveTextToUndoRedoLog(operation){

  if(focusedText.length>6 && !theTextSameAsLastInBuffer(operation)){
    undoRedoPtr++;
    undoRedoLog[undoRedoPtr] = new Array(focusedText[0],focusedText[1]+scrollVectorX,focusedText[2]+scrollVectorY,focusedText[3],focusedText[4],new Array(focusedText[5][0],focusedText[5][1],focusedText[5][2],focusedText[5][3],focusedText[5][4],focusedText[5][5],focusedText[5][6]),focusedText[6]);
    undoRedoLogOper[undoRedoPtr] = operation;
    undoRedoLog.length = undoRedoPtr+1;
    undoRedoLogOper.length = undoRedoPtr+1;

    while(undoRedoLog>30){//set max boundary of undo/redo log to 30 operations
      undoRedoLog = undoRedoLog.slice(1);
      undoRedoLogOper = undoRedoLogOper.slice(1);
    }
  }
}


function theTextSameAsLastInBuffer(oper){
  if(undoRedoPtr>=0){
    if(undoRedoLogOper[undoRedoPtr]!=oper) return false;
    for(var i=0;i<5;i++){
      if(focusedText[i] != undoRedoLog[undoRedoPtr][i]) return false;
    }
    
    //compare TextInfo section of focusedText and undoRedoLog
    if(focusedText[5][0]!=undoRedoLog[undoRedoPtr][5][0]) return false;
    for(var j=0;j<focusedText[5].length;j++){
      if(focusedText[5][j]!=undoRedoLog[undoRedoPtr][5][j]) return false;
    }   
    if(focusedText[6]!=undoRedoLog[undoRedoPtr][6]) return false;

    return true;
  }
  return false;  
}

function setGlobalTextVariables(){
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
	
    idd = focusedText[5][0];

	if(objFontPanel != null) {
	  objFontPanel.initState();
	  objFontPanel.setState();
	}
}

function performUndoText(){
  if(undoRedoPtr>0 && undoRedoLog.length>=undoRedoPtr){
    if(undoRedoLog[undoRedoPtr][0]=='text'){//undo for text
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
      var textInfo = new Array(undoRedoLog[ind][5][0],undoRedoLog[ind][5][1],undoRedoLog[ind][5][2],undoRedoLog[ind][5][3],undoRedoLog[ind][5][4],undoRedoLog[ind][5][5],undoRedoLog[ind][5][6]);
      focusedText = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],textInfo,undoRedoLog[ind][6]);
      setGlobalTextVariables();
      sendObject(focusedText,undoRedoLogOper[undoRedoPtr]);
      drawFocusedText();
      if(oper=='delete'){
  	    regionHistory[focusedText[5][0]] = new Array();
        focusedText = new Array();        
        if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="text"){
          textInfo = new Array(undoRedoLog[ind-1][5][0],undoRedoLog[ind-1][5][1],undoRedoLog[ind-1][5][2],undoRedoLog[ind-1][5][3],undoRedoLog[ind-1][5][4],undoRedoLog[ind-1][5][5],undoRedoLog[ind-1][5][6]);
          focusedText = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],textInfo,undoRedoLog[ind-1][6]);
		  setGlobalTextVariables();
		  drawFocusedText();              
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
        else if(ind>0 && undoRedoLogOper[ind-1]!='insert' && undoRedoLog[ind-1][0]=="image"){
            focusedImage = new Array(undoRedoLog[ind-1][0],undoRedoLog[ind-1][1]-scrollVectorX,undoRedoLog[ind-1][2]-scrollVectorY,undoRedoLog[ind-1][3],undoRedoLog[ind-1][4],undoRedoLog[ind-1][5]);
            idd = focusedImage[5];              
            drawFocusedImage();              
        }
	    else{
	      clearr();
          x=0;y=0;x1=0;y1=0;
          setHandlersSet(14);
        }
      }
      else{
        regionHistory[focusedText[5][0]] = new Array(focusedText[0],focusedText[1]+scrollVectorX,focusedText[2]+scrollVectorY,focusedText[3],focusedText[4],'nevermind',focusedText[6]);
        regionHistory[focusedText[5][0]][5] = new Array(focusedText[5][0],focusedText[5][1],focusedText[5][2],focusedText[5][3],focusedText[5][4],focusedText[5][5],focusedText[5][6]);
		setGlobalTextVariables();
        drawFocusedText();              
      }
    }
    undoRedoPtr--;
  }
}


function performRedoText(){
  if(undoRedoPtr < undoRedoLog.length-1){
    if(undoRedoLog[undoRedoPtr+1][0]=='text'){//undo for text
      if(undoRedoLogOper[undoRedoPtr+1]=='selection'){
        undoRedoPtr++;
        performRedo();
        return;
      }
      undoRedoPtr++; 
      var ind = undoRedoPtr;
      var textInfo = new Array(undoRedoLog[ind][5][0],undoRedoLog[ind][5][1],undoRedoLog[ind][5][2],undoRedoLog[ind][5][3],undoRedoLog[ind][5][4],undoRedoLog[ind][5][5],undoRedoLog[ind][5][6]);
      focusedText = new Array(undoRedoLog[ind][0],undoRedoLog[ind][1]-scrollVectorX,undoRedoLog[ind][2]-scrollVectorY,undoRedoLog[ind][3],undoRedoLog[ind][4],textInfo,undoRedoLog[ind][6]);
	  setGlobalTextVariables();
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

      if(oper!='delete'){
        regionHistory[focusedText[5][0]] = new Array(focusedText[0],focusedText[1]+scrollVectorX,focusedText[2]+scrollVectorY,focusedText[3],focusedText[4],"nevermind",focusedText[6]);
        regionHistory[focusedText[5][0]][5] = new Array(focusedText[5][0],focusedText[5][1],focusedText[5][2],focusedText[5][3],focusedText[5][4],focusedText[5][5],focusedText[5][6]);
        drawFocusedText();                      
        sendObject(focusedText,oper);
      }
      else{
          sendObject(focusedText,oper);
          regionHistory[focusedText[5][0]] = new Array();
 	      clearr();
          x=0;y=0;x1=0;y1=0;
          focusedText = new Array();
          setHandlersSet(16);       
      } 
    }
  }
}

function performCopyText(){
    if(focusedText.length>6){
      copyPasteBuffer = new Array();
      copyPasteBuffer[0] = focusedText[0];
      copyPasteBuffer[1] = focusedText[1]+scrollVectorX;
      copyPasteBuffer[2] = focusedText[2]+scrollVectorY;
      copyPasteBuffer[3] = focusedText[3];
      copyPasteBuffer[4] = focusedText[4];
      copyPasteBuffer[5] = new Array("nevermind",focusedText[5][1],focusedText[5][2],focusedText[5][3],focusedText[5][4],focusedText[5][5],focusedText[5][6]);
      copyPasteBuffer[6] = focusedText[6];
      pastedCount=0;
    }
}

function performPasteText(){
    if(copyPasteBuffer.length==0) return;
    lostFocus();
    focusedText = new Array();
    focusedText[0] = copyPasteBuffer[0];
    focusedText[1] = copyPasteBuffer[1]+(pastedCount+1)*10-scrollVectorX;
    focusedText[2] = copyPasteBuffer[2]+(pastedCount+1)*10-scrollVectorY;
    focusedText[3] = copyPasteBuffer[3];
    focusedText[4] = copyPasteBuffer[4];
    idd=curFigureId;
    focusedText[5] = new Array(curFigureId++,copyPasteBuffer[5][1],copyPasteBuffer[5][2],copyPasteBuffer[5][3],copyPasteBuffer[5][4],copyPasteBuffer[5][5],copyPasteBuffer[5][6]);
    focusedText[6] = copyPasteBuffer[6];

    saveTextToUndoRedoLog("delete");
    sendObject(focusedText,"insert");
    drawFocusedText();
    objFontPanel.initState();
    objFontPanel.setState();
    pastedCount++;
}

function moveLeftText(){
    if(shiftPressed) focusedText[1]-=10;
    else if(ctrlPressed) focusedText[1]-=1;
    else focusedText[1]-=5;
    drawFocusedText();    
}

function moveUpText(){
    if(shiftPressed) focusedText[2]-=10;
    else if(ctrlPressed) focusedText[2]-=1;
    else focusedText[2]-=5;
    drawFocusedText();    
}

function moveRightText(){
    if(shiftPressed) focusedText[1]+=10;
    else if(ctrlPressed) focusedText[1]+=1;
    else focusedText[1]+=5;
    drawFocusedText();    
}

function moveDownText(){
    if(shiftPressed) focusedText[2]+=10;
    else if(ctrlPressed) focusedText[2]+=1;
    else focusedText[2]+=5;
    drawFocusedText();    
}
