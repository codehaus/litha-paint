var packetBuffer = [];
var maxGetLength = 1500;

var callbacks = [];

function sendObject(fObj,comm){
  performRequestScript(fObj,comm);
}

function sendObjectWithoutDisplay(fObj,comm){
  performRequestScript(fObj,comm);
}

function performRequestScript(fObj,comm){
  var strObj;
  if(comm=='insert' || comm=='update'){
    if(fObj[0]=='bezier') strObj = "type="+comm+"&shape=bezier&id="+(fObj[5][0])+"&points="+(generateD(fObj))+"&fill="+(getFillColor(fObj))+"&stroke="+(fObj[5][1][0])+"&stroke-width="+(fObj[5][1][1])+"&left="+(fObj[1]-canvas_x+scrollVectorX)+"&top="+(fObj[2]-canvas_y+scrollVectorY)+"&width="+(fObj[3])+"&height="+(fObj[4])+"&stroke-opacity="+(fObj[5][1][2])+"&stroke-dasharray="+(fObj[5][1][3])+"&stroke-linecap="+(fObj[5][1][4])+"&stroke-linejoin="+(fObj[5][1][5])+"&stroke-miterlimit="+(fObj[5][1][6])+"&fill-opacity="+(fObj[5][2][1])+"&fill-rule="+(fObj[5][2][2])+"&command_id="+(curCommandId++);
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
          
			strObj = "type="+comm+"&shape=text&id="+(fObj[5][0])+"&points="+(points)+"&text="+
			(removeTab(textValue))+"&left_top="+(left_top)+"&width_height="+(width_height)+"&stroke="+(fObj[5][text_color])+
			"&size="+(fObj[5][text_size])+"&font="+(fObj[5][6])+"&weight="+(fObj[5][3])+"&text-style="+(fObj[5][4])+"&text-decoration="+(fObj[5][5])+"&command_id="+(curCommandId++);
    }
    if(fObj[0]=='image') strObj = "type="+comm+"&shape=image&id="+(fObj[5])+"&x="+(fObj[1]-canvas_x+scrollVectorX)+"&y="+(fObj[2]-canvas_y+scrollVectorY)+"&width="+(fObj[3])+"&height="+(fObj[4])+"&command_id="+(curCommandId++);
  }
  if(comm=='delete'){
    if(fObj[0]=='bezier' || fObj[0]=='text') strObj = "type=delete&id="+(fObj[5][0])+"&command_id="+(curCommandId++);
    if(fObj[0]=='image') strObj = "type=delete&id="+(fObj[5])+"&command_id="+(curCommandId++);
  }
  
  if(comm=='new_document'){
    strObj = "type=new_document&document_width="+fObj[0]+"&document_height="+fObj[1]+"&background_color="+(fObj[2])+"&command_id="+(curCommandId++);
  }
  
  if(comm=='copy_image'){
    strObj = "type=copy_image&shape=image&fromid="+(fObj[6])+"&id="+fObj[5]+"&x="+(fObj[1]-canvas_x)+"&y="+(fObj[2]-canvas_y)+"&width="+(fObj[3])+"&height="+(fObj[4])+"&command_id="+(curCommandId++);
  }
  if(comm=='bring_back'){//fObj contains only id in the 0-th element and that's all.
    strObj = "type=bring_back&id="+(fObj[0])+"&command_id="+(curCommandId++);
  }
  if(comm=='bring_front'){//fObj contains only id in the 0-th element and that's all.
    strObj = "type=bring_front&id="+(fObj[0])+"&command_id="+(curCommandId++);
  }

  if(comm=='bring_top'){//fObj contains only id in the 0-th element and that's all.
    strObj = "type=bring_top&id="+(fObj[0])+"&command_id="+(curCommandId++);
  }

  if(comm=='bring_bottom'){//fObj contains only id in the 0-th element and that's all.
    strObj = "type=bring_bottom&id="+fObj[0]+"&command_id="+(curCommandId++);
  }
  
  if(comm=='change_background'){
    strObj = "type=change_background&background_color="+(fObj[0])+"&command_id="+(curCommandId++);
  }
  
  if(comm=='save_document') {
    var comId = curCommandId++;
    strObj = "type=save_document&curfigureid="+curFigureId+"&command_id="+comId+"&format_name="+fObj[1];
    if (typeof(fObj[0]) == 'function') {
      callbacks[comId] = fObj[0];
      strObj += "&callback=_callbackHandler";
    }
  }
  
  if(comm=='insert_image'){
    var comId = curCommandId++;
    strObj = "type=insert_image&id="+(curFigureId++)+"&url="+encodeURIComponent(fObj[0])+"&command_id="+(comId);
    if (fObj[1] && typeof(fObj[1]) == 'function') {
      callbacks[comId] = fObj[1];
      strObj += "&callback=_callbackHandler";
    }
  }     
  
  if(comm=='open_document') {
    var comId = curCommandId++;
    var strObj = "type=open_document&fileurl="+encodeURIComponent(fObj[0])+"&command_id="+comId+"&format_name="+fObj[1];
    if (typeof(fObj[2]) == 'function') {
      callbacks[comId] = fObj[2];
      strObj +="&callback=_callbackHandler";
    }    
  }
  insertScript(strObj);
}

function insertScript(strObj) {
    var packetizer = new Packetizer(strObj);
    var commandId = packetizer.packetizeCommand();
    sendPacket(commandId,0);
}

function sendPacket(commandId, packetNum) {
  var str = packetBuffer[commandId][packetNum].join("&");
  if (packetNum == packetBuffer[commandId].length - 1) {
    //packetBuffer[commandId] = [];
    packetBuffer.splice(commandId,2,packetBuffer[commandId+1]);
  }
  sendStringWithGetMethod(str);
}

function sendStringWithGetMethod(strObj) {
    var toDelete = document.getElementById("litscrmach");
    if (toDelete) {
	  document.body.removeChild(toDelete);    
    }
    var s=document.createElement("script");
    if("object"!=typeof(s)){
	  s=document.standardCreateElement("script");
    }
    var id = document.createAttribute("id");
    id.value="litscrmach";
    s.setAttributeNode(id);  
    s.charset="UTF-8";
    s.src=url+"?"+strObj+"&session_id="+sessionId;
    s.type="text/javascript";
    document.body.appendChild(s);
}

function Packetizer(str) {

	  var pairs = str.split("&");
	  var command_id_pos = findElement (pairs,"command_id");
	  var command_type_pos = findElement (pairs,"type");
	  var pair = pairs[command_id_pos];
	  var command_id = pair.split("=")[1];
	  pair = pairs[command_type_pos];
	  var command_type = pair.split("=")[1];
	  pairs = removeElementAt (command_id_pos,pairs);
	  pairs = removeElementAt (command_type_pos,pairs);    
	  pairs.sort(sortStrings); 


	 this.packetizeCommand = function() {

		  var res = -1;	   
		  var j=0;
		  var i = 0;
		  var wouldBeTheNextPacket = true;
		  packetBuffer[command_id] = [];
			
		  while (wouldBeTheNextPacket)   {
			  var packet = [];
			  packet[0] = "command_id="+command_id;
			  packet[1] = "type="+command_type;
			  var packetSize = packet[0].length+packet[1].length;
			  while ( i<pairs.length && ((packetSize + pairs[i].length) < maxGetLength) ) {
			    var pairSplited = pairs[i].split("=");
			    var encodedPair = pairSplited[0]+"="+encodeURIComponent(pairSplited[1]);
			    packet[packet.length] = encodedPair;
			    packetSize += encodedPair.length;
			    i++;
			  }
			  wouldBeTheNextPacket = false;
			  
			  if (i < pairs.length) {
			    wouldBeTheNextPacket = true;
			    var nextPair = pairs[i].split("=");
			    var fitLength = maxGetLength-packetSize-nextPair[0].length-1;
			    if (fitLength > 0) {
			      var fitData = extractFitData(nextPair[1],fitLength);
			      packet[packet.length] = nextPair[0]+"="+encodeURIComponent(fitData);
			      var restData = nextPair[1].substr(fitData.length);
			      pairs[i] = nextPair[0]+"="+restData;    		  
			    }
			  }
			  if (wouldBeTheNextPacket) {
			    packet[1] = "type=buffering";
			  }	  
			  packetBuffer[command_id][j] = packet;
			  j++;
		  }
		  res = command_id;
		  return res;
	}
	
	function removeElementAt(pos, arr) {
	  if (pos == arr.length-1) {
	    arr.pop();
	  } else {
	    arr.splice(pos,2,arr[pos+1]);
	  }
	  return arr;
	}
	
	function findElement (arr, ell) {
	  for (var i=0; i<arr.length; i++) {
	    var elem = arr[i].split("=");
	    if (elem[0] == ell) {
	      return i;
	    }
	  }
	}
	
	function sortStrings(str1, str2) {
	  return str1.length - str2.length;
	}
	
	function extractFitData(str, length) {
	  var res = "";
	  var encodedStr = encodeURIComponent(str);
	  if (encodedStr.length == str.length) {
	    res = str.substr(0,length);
	  } else {
	    var index = encodedStr.substr(0,length).lastIndexOf("%");
	    res = decodeURIComponent(encodedStr.substr(0,index));
	  }
	  return res;
	}
}




function generateD(focusedObject){
  var tmpFocusedObject = [];
  for (var i=6;i<focusedObject.length;i++) {
    tmpFocusedObject[i-6] = [];
    tmpFocusedObject[i-6][0] = [];
    tmpFocusedObject[i-6][1] = [];
    tmpFocusedObject[i-6][2] = [];
    tmpFocusedObject[i-6][0][0] = focusedObject[i][0][0] - canvas_x + scrollVectorX;
    tmpFocusedObject[i-6][0][1] = focusedObject[i][0][1] - canvas_y + scrollVectorY;
    tmpFocusedObject[i-6][1][0] = focusedObject[i][1][0] - canvas_x + scrollVectorX;
    tmpFocusedObject[i-6][1][1] = focusedObject[i][1][1] - canvas_y + scrollVectorY;
    tmpFocusedObject[i-6][2][0] = focusedObject[i][2][0] - canvas_x + scrollVectorX;
    tmpFocusedObject[i-6][2][1] = focusedObject[i][2][1] - canvas_y + scrollVectorY;        
    tmpFocusedObject[i-6][3] = focusedObject[i][3];
    tmpFocusedObject[i-6][4] = focusedObject[i][4];
    tmpFocusedObject[i-6][5] = focusedObject[i][5];
  }
  var strResult = tmpFocusedObject[0].join(",");
  for(var i=1;i<tmpFocusedObject.length;i++){
    strResult+="NECH";
    strResult+=tmpFocusedObject[i].join(",");
  }
  return strResult;
}



function updateScrap(j,i){
  try{
    var rnd = ""+Math.random();
    if (scrap && scrap[i] && scrap[i][j]) {
      scrap[i][j].src = url2scrap+"/"+rnd.substr(2,5)+"/"+j+"_"+i+".PNG?rnd="+Math.random()+"&session_id="+sessionId;
    }
  }
  catch(e){
    alert(e.message);
  }
}


function generateBezFillColor(focusedBez){
  return "none";
}


function getFillColor(fObj){
  return fObj[fObj.length-1][termProp]==1?fObj[5][2][0]:'alpha';
}

function callbackHandler(callbackFuncNum) {
  
  switch (arguments.length) {
    case 1: callbacks[callbackFuncNum]();
    break;
    case 2: callbacks[callbackFuncNum](arguments[1]);
    break;
    case 3: callbacks[callbackFuncNum](arguments[1], arguments[2]);
    break;
    case 4: callbacks[callbackFuncNum](arguments[1], arguments[2], arguments[3]);
    break;
  }
  
  callbacks[callbackFuncNum] = null;
}