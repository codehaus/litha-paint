var ctrlPressed = false;
var shiftPressed = false;
var copyPasteBuffer = new Array();
var pastedCount=0; //

var objectModified=false;//avoid sending object to server if there weren't changes done

var undoRedoLog = new Array();// log for Undo/Redo operations. After focusedObject lost focus and after object 
//is putted into regionHistory it is putted into this undoRedoLog and pointer increases by one
//is user performs undo object is taken from undoRedolog and placed into focusedObject(Bez,Line...) and removed from regionHistory
//and pointer decreases by one
var undoRedoLogOper = new Array();
var undoRedoPtr=-1;

var eventHandlerAfterAltReleased = -1;

function processKeyDownSelectRegion(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;  
  if(keyCode==17){//ctrl pressed
//    alert(keyCode);
    ctrlPressed = true;
    //Ctrl pressed, so perform shift of workspace    
    eventHandlerAfterAltReleased = 3;
    setHandlersSet(31);
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
  //if object is not focused can't copy but still can paste any object that is in the buffer
  if(ctrlPressed && keyCode==86){//"Ctrl+V" pressed. Perform pasting object from buffer into document
    performPaste();
    if(evt)evt.returnValue=false;else event.returnValue=false;
    if(evt)evt.cancel = true;else event.cancelBubble=true;
    return false;
  }
 

}

function processKeyUpSelectRegion(evt){
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
}


function performUndo(){
  if(undoRedoPtr>=0){
    if(undoRedoLog[undoRedoPtr][0]=='bezier'){//undo for bezier
      performUndoBez();
      return;
    }
    if(undoRedoLog[undoRedoPtr][0]=='text'){//undo for text
      performUndoText();
      return;
    }
    if(undoRedoLog[undoRedoPtr][0]=='image'){//undo for image
      performUndoImage();
      return;
    }

  }
}

function performRedo(){
  if(undoRedoPtr < undoRedoLog.length-1){
    if(undoRedoLog[undoRedoPtr+1][0]=='bezier'){
      performRedoBez();
      return;
    }

    if(undoRedoLog[undoRedoPtr+1][0]=='text'){
      performRedoText();
      return;
    }

    if(undoRedoLog[undoRedoPtr+1][0]=='image'){
      performRedoImage();
      return;
    }
  }
 
}

function performCopy(){
  if(focusedBez!=null && focusedBez.length>6){
    performCopyBez();
    return;
  }
  if(focusedText!=null && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
    performCopyText();
    return;
  }
  if(focusedImage!=null && focusedImage.length==6){
    performCopyImage();
    return;
  }

}

function performPaste(){
  if(copyPasteBuffer[0]=='bezier'){
    performPasteBez();
  }
  if(copyPasteBuffer[0]=='text'){
    performPasteText();
  }
  if(copyPasteBuffer[0]=='image'){
    performPasteImage();
  }
}