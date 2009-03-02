var wsx=40; //absolute X coordinate of workspace (div which holds scaps), it constant during runtime
var wsy=90;  //absolute Y coordinate of workspace
var wsx1=500;  //width of workspace //varying during runtime depending on avaliable client space
var wsy1=500;  //width of workspace

//minimal dimension of WS when scrollbar begins to appear
var minWSWidth = 500;
var minWSHeight = 420;

//vector pointing from top left of first scrap to top left of canvas 
var scrollVectorX = 0;
var scrollVectorY = 0;

var oldLeft;
var oldTop;

function workspaceMouseDown(evt){
  workspaceMouseDownImp(evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft(),evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop());
}

function workspaceMouseDownImp(tx,ty){
  lostFocus();
  dragapproved=true;
  x=tx;
  y=ty;
  var img = scrap[0][0];
  oldLeft = parseInt(window.opera?img.style.left:img.style.left.substring(0,img.style.left.length-2));
  oldTop = parseInt(window.opera?img.style.top:img.style.top.substring(0,img.style.top.length-2));     

  return false;
}

function workspaceMouseUp(evt){
  dragapproved=false;
  refreshWorkspace();
  return false;
}

function workspaceMouseMove(evt){

   if((evt?(evt.button==65535 || evt.button==0):event.button==1) && dragapproved){
    var x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
    var y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
    var img = scrap[0][0];
    var left = parseInt(window.opera?img.style.left:img.style.left.substring(0,img.style.left.length-2));
    var top = parseInt(window.opera?img.style.top:img.style.top.substring(0,img.style.top.length-2));     
    var oldLeft1 = left;
    var oldTop1 = top;

    if(scrapCountX*scrapWidth > (wsx1-wsx)){ //do horizontal shift if only workspace is wider then visible part
      if(left+(x1-x) > 0){left=0;} //preserve top left corner of workspace from being shifted
      else if(left+(x1-x)+scrapCountX*scrapWidth < wsx1){left = wsx1-scrapCountX*scrapWidth;} //preserve bottom right corner from being shifted
      else {left+=(x1-x);}
    }

    if(scrapCountY*scrapHeight>(wsy1-wsy)){//do vertical shift if only workspace is higher then visible part
      if(top+(y1-y)>0){top=0}
      else if(top+(y1-y)+scrapCountY*scrapHeight < wsy1){top = wsy1-scrapCountY*scrapHeight}
      else {top+=(y1-y)}
    }
     
    
    scrollVectorX = -left;
    scrollVectorY = -top;

    

    img.style.top=top;
    img.style.left=left;
    var i=1;
    while(i<scrapCount){
        var l = oldLeft+(scrapWidth*(i%scrapCountX));
        var t = oldTop+(scrapHeight*Math.floor(i/scrapCountX));

        if((l>=0 && l<=wsx1 && t>=0 && t<=wsy1)
           ||(l+scrapWidth>=0 && l+scrapWidth<=wsx1 && t>=0 && t<=wsy1)
           ||(l+scrapWidth>=0 && l+scrapWidth<=wsx1 && t+scrapHeight>=0 && t+scrapHeight<=wsy1)
           ||(l>=0 && l<=wsx1 && t+scrapHeight>=0 && t+scrapHeight<=wsy1)){
          l = oldLeft1+(scrapWidth*(i%scrapCountX));
          t = oldTop1+(scrapHeight*Math.floor(i/scrapCountX));
          if((l>=0 && l<=wsx1 && t>=0 && t<=wsy1)
           ||(l+scrapWidth>=0 && l+scrapWidth<=wsx1 && t>=0 && t<=wsy1)
           ||(l+scrapWidth>=0 && l+scrapWidth<=wsx1 && t+scrapHeight>=0 && t+scrapHeight<=wsy1)
           ||(l>=0 && l<=wsx1 && t+scrapHeight>=0 && t+scrapHeight<=wsy1)){

            l = left+(scrapWidth*(i%scrapCountX));
            t = top+(scrapHeight*Math.floor(i/scrapCountX));
  	    img = scrap[Math.floor(i/scrapCountX)][i%scrapCountX];
            img.style.top = t;
            img.style.left = l;
          }
        }
        i++;
    }
  }
  x=x1;
  y=y1;
  return false;
}

function refreshWorkspace(){
    var img = scrap[0][0];
    var left = parseInt(img.style.left.substring(0,img.style.left.length-2));
    var top = parseInt(img.style.top.substring(0,img.style.top.length-2));     
    img.style.top=top;
    img.style.left=left;
    var i=1;

//    if(left+scrapCountX*scrapWidth < wsx1){left = wsx1-scrapCountX*scrapWidth}
//    if(top+scrapCountY*scrapHeight < wsy1){top = wsy1-scrapCountY*scrapHeight}
    
    while(i<scrapCount){
        var l = left+(scrapWidth*(i%scrapCountX));
        var t = top+(scrapHeight*Math.floor(i/scrapCountX));
        //if((l>=wsx && l<=wsx1 && t>=wsy && t<=wsy1)
//           ||(l+scrapWidth>=wsx && l+scrapWidth<=wsx1 && t>=wsy && t<=wsy1)
//           ||(l+scrapWidth>=wsx && l+scrapWidth<=wsx1 && t+scrapHeight>=wsy && t+scrapHeight<=wsy1)
//           ||(l>=wsx && l<=wsx1 && t+scrapHeight>=wsy && t+scrapHeight<=wsy1)){
  	  img = scrap[Math.floor(i/scrapCountX)][i%scrapCountX];
          img.style.top = t;
          img.style.left = l;
//        }
        i++;
    }

}

function avoidStickingOfWorkspace(evt){
  //this avoid sticking of workspace to the mouse for opera
  if(window.opera){
    dragapproved=false;
  }
}

function processKeyDownHand(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;  
  if(keyCode==17){//ctrl pressed
    ctrlPressed = true;
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  if(keyCode==16){//shift pressed
    shiftPressed = true;
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  //if object is not focused can't copy but still can paste any object that is in the buffer
  if(ctrlPressed && keyCode==86){//"Ctrl+V" pressed. Perform pasting object from buffer into document
    performPaste();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
  if(keyCode==90 && ctrlPressed){//Ctrl+Z means Undo
    performUndo();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;

  }
  if(keyCode==89 && ctrlPressed){//Ctrl+Y means Redo
    performRedo();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;

  }  
}

function processKeyUpHand(evt){
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

  if(keyCode==17){//Ctrl released, so return previous handler
    if(eventHandlerAfterAltReleased!=-1){
      setHandlersSet(eventHandlerAfterAltReleased);
      eventHandlerAfterAltReleased=-1;
      if(evt)evt.returnValue=false;else event.returnValue=false;
      if(evt)evt.cancel = true;else event.cancelBubble=true;
      return false;
    }
  }

}
