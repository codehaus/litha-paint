function globalDataToString(){
  res = "<regionhistory curfigureid=\""+curFigureId+"\">"+regionHistoryToString()+"</regionhistory>\n";
  res += "<undoredolog undoredoptr=\""+undoRedoPtr+"\">"+undoRedoLogToString()+"</undoredolog>\n";
  if(focusedBez.length>6){res+="<focusedbez>"+focusedBezToString()+"</focusedbez>\n";}
  res += "<copypaste>"+copyPasteBufferToString()+"</copypaste>\n";
  res += "<mobilepoint>"+mobilePointToString()+"</mobilepoint>\n";
  res += "<bezsteps>"+bezStepsToString+"</bezsteps>\n";
  res += "<foreditablelastpoints>"+forEditableLastPointsToString()+"</foreditablelastpoints>\n";
  res += "<joinstartpoint>"+joinStartPointToString()+"</joinstartpoint>\n";
  res += "<mousee>"+mouseeToString()+"</mousee>\n";
  res += "<node>"+nodeToString()+"</mousee>\n";
  res += "<mousee>"+mouseeToString()+"</node>\n";
  res += "<reflected>"+reflectedToString()+"</reflected>\n";
  res +="<rotcenter>"+rotCenterToString()+"</rotcenter>\n";
  res +="<rotstartvector>"+rotStartVectorToString()+"</rotstartvector>\n";
  res +="<rotendvector>"+rotEndVectorToString()+"</rotendvector\n";
  res +="<pensteps>"+penStepsToString()+"</pensteps>\n";
  res +="<focusedpen>"+focusedPenToString()+"</focusedpen>\n";
  res +="<polylinesteps>"+polylineStepsToString()+"</polylinesteps>\n";
  res +="<focusedpoly>"+focusedPolyToString()+"</focusedpoly>\n";
  res +="<focusedtext>"+focusedTextToString()+"</focusedtext>\n";
  return res;
}

function globalDataFromString(str){
  
}

function sendJSStateToServer(funcName,e){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  var req = "<command type=\"exception\" />\n";
  res+="<exceptionfunction>"+funcName+"</exceptionfunction>\n";
  res+="<exceptionstring>"+e+"</exceptionstring>\n";
  req+=globalDataToString();  
  req+="</command>";
  request.send(req);    

}