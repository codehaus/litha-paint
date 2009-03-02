//should be called by timeout when system whants to save user's state
function performAutosave(){
  sendObject(new Array(),"save_workstate");
}

function regionHistoryToString(){
  var outputHistory = regionHistory.length>0?regionHistory.join("!region!"):"";
  outputHistory = outputHistory.replace(/<BR>/gi, "!!!BR!!!");  
  return outputHistory;
}

function undoRedoLogToString(){
  return undoRedoLog.length>0?undoRedoLog.join("!undo!"):"";
}

function focusedBezToString(){
  return focusedBez.join(",");
}

function copyPasteBufferToString(){
  return copyPasteBuffer.join(",");
}

function mobilePointToString(){
  return mobilePoint.join(",");
}

function bezStepsToString(){
  return bezSteps.join(",");
}

function fourEditableLastPointsToString(){
  return fourEditableLastPoints.join(",");
}

function joinStartPointToString(){
  return joinStartPoint.join(",");
}

function mouseeToString(){
  return mousee.join(",");
}

function nodeToString(){
  return node.join(",");
}

function reflectedToString(){
  return reflected.join(",");
}

function rotCenterToStirng(){
  return roCenter.join(",");
}

function rotStartVectorToString(){
  return rotStartVector.join(",");
}

function rotEndVectorToString(){
  return rotEndVector.join(",");
}

function penStepsToString(){
  return penSteps.join(",");
}

function focusedPenToString(){
  return focusedPen.join(",");
}

function polylineStepsToString(){
  return polylineSteps.join(",");
}

function focusedPolyToString(){
  return focusedPoly.join(",");
}

function focusedTextToString(){
  var lines = extractLines(focusedText[6]);
  var text=lines[0][0];
  for(var i=1;i<lines.length;i++){
      text+="!!!BR!!!"+lines[i][0];
  }
  var focusedTextEscaped = new Array(focusedText[0],focusedText[1],focusedText[2],focusedText[3],focusedText[4],new Array(focusedText[5][0],focusedText[5][1],focusedText[5][2],focusedText[5][3],focusedText[5][4],focusedText[5][5],focusedText[5][6]),focusedText[6]);
  focusedTextEscaped[6] = text;
  focusedTextEscaped[1] -= (canvasX-scrolVectorX);
  focusedTextEscaped[2] -= (canvasY-scrolVectorY);
  var arr =  focusedTextEscaped.join(",");
  return arr;
}

function performSave(fileName){
  lostFocus();
  /*
  var saveFileDialog = document.getElementById("save_document_div");
  if(saveFileDialog) document.body.removeChild(saveFileDialog);
  */
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  var req = "<command type=\"save_document\" filename=\""+fileName+"\">";
  req+="<regionhistory curfigureid=\""+curFigureId+"\">"+regionHistoryToString()+"</regionhistory>";
  if(focusedBez.length>6){req+="<focusedbez>"+focusedBezToString()+"</focusedbez>";}
  if(focusedText.length==7){req+="<focusedtext>"+focusedTextToString()+"</focusedtext>";}
  req+="</command>";
  request.send(req);  
  switchArrow();
  curProjectName = fileName;  
}