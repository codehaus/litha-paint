function sendObject(fObj,comm){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  request.onreadystatechange = processRequestChange;
  performRequest(fObj,comm);
}


function sendObjectWithoutDisplay(fObj,comm){
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  performRequest(fObj,comm);
}


function processRequestChange(){
     if (request.readyState == 4) {
       if (request.status==0 || request.status == 200) {
         var response = request.responseText.substr(10,request.responseText.length-22).split("|");
		 for(var i=0;i<(response.length-1);i++){	
		   var coord = response[i].split(",");
		   updateScrap(coord[0],coord[1]);
		 }		 		 
       } 
       else {
           alert("Error: server has returned status: " + request.status);
       }
     }
}


function generateD(focusedObject){
  var strResult = "M"+(focusedObject[6][p][0]-canvas_x+scrollVectorX)+","+(focusedObject[6][p][1]-canvas_y+scrollVectorY);
  for(var i=7;i<focusedObject.length;i++){
    strResult+=" ";
    strResult+="C"+Math.round(focusedObject[i-1][m][0]-canvas_x+scrollVectorX)+','+Math.round(focusedObject[i-1][m][1]-canvas_y+scrollVectorY)+" "+Math.round(focusedObject[i][r][0]-canvas_x+scrollVectorX)+','+Math.round(focusedObject[i][r][1]-canvas_y+scrollVectorY)+" "+Math.round(focusedObject[i][p][0]-canvas_x+scrollVectorX)+','+Math.round(focusedObject[i][p][1]-canvas_y+scrollVectorY);
  }
  if(focusedObject.length>6 && focusedObject[focusedObject.length-1][termProp]==1){
    strResult+=" C"+Math.round(focusedObject[focusedObject.length-1][m][0]-canvas_x+scrollVectorX)+','+Math.round(focusedObject[focusedObject.length-1][m][1]-canvas_y+scrollVectorY)+" "+Math.round(focusedObject[6][r][0]-canvas_x+scrollVectorX)+","+Math.round(focusedObject[6][r][1]-canvas_y+scrollVectorY)+" "+Math.round(focusedObject[6][p][0]-canvas_x+scrollVectorX)+','+Math.round(focusedObject[6][p][1]-canvas_y+scrollVectorY)+"Z";
  }
  return strResult;
}




function updateScrap(j,i){
  try{
    var rnd = ""+Math.random();  
    scrap[i][j].src = url+"/"+rnd.substr(2,5)+"/"+j+"_"+i+".PNG?rnd="+Math.random();
  }
  catch(e){
    alert(e.message);
  }
}


function generateBezFillColor(focusedBez){
  return "none";
}

function performRequest(fObj,comm){
  var strObj;
  if(comm=='insert' || comm=='update'){
    strObj = "<command type=\""+comm+"\">";
    if(fObj[0]=='bezier') strObj = strObj+"<"+fObj[0]+" id=\""+fObj[5][0]+"\" points=\""+generateD(fObj)+"\" fill=\""+getFillColor(fObj)+"\" stroke=\""+fObj[5][1][0]+"\" stroke-width=\""+fObj[5][1][1]+"\" left=\""+(fObj[1]-canvas_x+scrollVectorX)+"\" top=\""+(fObj[2]-canvas_y+scrollVectorY)+"\" width=\""+fObj[3]+"\" height=\""+fObj[4]+"\" stroke-opacity=\""+fObj[5][1][2]+"\" stroke-dasharray=\""+fObj[5][1][3]+"\" stroke-linecap=\""+fObj[5][1][4]+"\" stroke-linejoin=\""+fObj[5][1][5]+"\" stroke-miterlimit=\""+fObj[5][1][6]+"\" fill-opacity=\""+fObj[5][2][1]+"\" fill-rule=\""+fObj[5][2][2]+"\" />";
    if(fObj[0]=='text'){
			  var lines = extractLines(fObj[6]);
			  var textValue=lines[0][0];
			  var points=lines[0][1]+","+lines[0][2];
			  for(var i=1;i<lines.length;i++){
				textValue+="!!!BR!!!"+lines[i][0];
				points+=" "+lines[i][1]+","+lines[i][2];
			  }
			  
			  width_height = fObj[3]+','+fObj[4];
			  left_top = (fObj[1]-canvas_x+scrollVectorX)+','+(fObj[2]-canvas_y+scrollVectorY);			  
			strObj = strObj+"<"+fObj[0]+" id=\""+fObj[5][0]+"\" points=\""+points+"\" text=\""+//removeNBSP(removeSPAN(text))
			removeTab(textValue)+"\" left_top=\""+left_top+"\" width_height=\""+width_height+"\" stroke=\""+fObj[5][text_color]+
			"\" size=\""+fObj[5][text_size]+"\" font=\""+fObj[5][6]+"\" weight=\""+fObj[5][3]+"\" text-style=\""+fObj[5][4]+"\" text-decoration=\""+fObj[5][5]+"\"/>";
    }
    if(fObj[0]=='image') strObj = strObj+"<"+fObj[0]+" id=\""+fObj[5]+"\" x=\""+(fObj[1]-canvas_x+scrollVectorX)+"\" y=\""+(fObj[2]-canvas_y+scrollVectorY)+"\" width=\""+fObj[3]+"\" height=\""+fObj[4]+"\" />";
    strObj = strObj+"</command>";
  }
  if(comm=='delete'){
    if(fObj[0]=='bezier' || fObj[0]=='text') strObj = "<command type=\"delete\" id=\""+fObj[5][0]+"\" ></command>";
    if(fObj[0]=='image') strObj = "<command type=\"delete\" id=\""+fObj[5]+"\" ></command>";
  }
  if(comm=='new_document'){
    strObj = "<command type=\"new_document\" document_width=\""+fObj[0]+"\" document_height=\""+fObj[1]+"\" ></command>";
  }
  if(comm=='save_workstate'){
    strObj = "<command type=\"save_workstate\">";
    strObj+="<regionhistory curfigureid=\""+curFigureId+"\">"+regionHistoryToString()+"</regionhistory>";
    //strObj+="<undoredolog undoredoptr=\""+undoRedoPtr+"\">"+undoRedoLogToString()+"</undoredolog>";
    if(focusedBez.length>6){strObj+="<focusedbez>"+focusedBezToString()+"</focusedbez>";}
    strObj+="</command>";
  }
  if(comm=='copy_image'){
    strObj = "<command type=\"copy_image\" fromid=\""+fObj[6]+"\">"+"<"+fObj[0]+" id=\""+fObj[5]+"\" x=\""+(fObj[1]-canvas_x)+"\" y=\""+(fObj[2]-canvas_y)+"\" width=\""+fObj[3]+"\" height=\""+fObj[4]+"\" />"+"</command>";
  }
  if(comm=='bring_back'){//fObj contains only id in the 0-th element and that's all.
    strObj = "<command type=\"bring_back\" id=\""+fObj[0]+"\" />";
  }
  if(comm=='bring_front'){//fObj contains only id in the 0-th element and that's all.
    strObj = "<command type=\"bring_front\" id=\""+fObj[0]+"\" />";
  }

  if(comm=='bring_top'){//fObj contains only id in the 0-th element and that's all.
    strObj = "<command type=\"bring_top\" id=\""+fObj[0]+"\" />";
  }

  if(comm=='bring_bottom'){//fObj contains only id in the 0-th element and that's all.
    strObj = "<command type=\"bring_bottom\" id=\""+fObj[0]+"\" />";
  }

  request.send(strObj);
}


function initXMLHttpRequest(){
  try {
    request = new XMLHttpRequest();
  } 
  catch (trymicrosoft) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (othermicrosoft) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } 
      catch (failed) {
        request = false;
      }
    }
  }
}

function getFillColor(fObj){
  return fObj[fObj.length-1][termProp]==1?fObj[5][2][0]:'alpha';
}