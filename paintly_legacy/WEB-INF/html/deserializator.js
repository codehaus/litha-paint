// should be called when user whants to restore session
function performAutoopen(){
  var splash = document.getElementById("splash");
  if(splash)document.body.removeChild(splash);
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  request.onreadystatechange = processAutoopen;
  request.send("<command type=\"open_workstate\" />");  
}

function processAutoopen(){
     if (request.readyState == 4) {
       if (request.status == 200) {
         undoRedoLog = new Array();
         undoRedoLogOper = new Array(); 
         undoRedoPtr = -1;
         var str = request.responseText;
         processOpen(str);
       } 
       else{
         alert("Error: server has returned status: " + request.status);
       }
     }
}

function processOpen(str){
         var startIdx;
         var endIdx = -1;
         var textContent;
         
         startIdx = str.indexOf("<regionhistory");
         if(startIdx!=-1){
	   	   startIdx = str.indexOf(" curfigureid=\"",startIdx+14);           
           if(startIdx!=-1){
	         endIdx = str.indexOf("\"",startIdx+14);
             if(endIdx!=-1){
               curFigureId = parseInt(str.substring(startIdx+14,endIdx));
             }
           }

           startIdx = str.indexOf(">",startIdx+1);
           if(startIdx!=-1){
             endIdx = str.indexOf("</regionhistory>");
             if(endIdx!=-1){
               textContent = str.substring(startIdx+1,endIdx);
               regionHistoryFromString(textContent);
             }
	   }
         }

         startIdx = str.indexOf("<undoredolog");
         if(startIdx!=-1){
           startIdx = str.indexOf("\">",startIdx+12);
           if(startIdx!=-1){
             endIdx = str.indexOf("</undoredolog>");
             if(endIdx!=-1){
               textContent = str.substring(startIdx+2,endIdx);
               undoRedoLogFromString(textContent);
             }
           }
         }

         startIdx = str.indexOf("<canvas");
         if(startIdx!=-1){
           startIdx = str.indexOf("scrapsX=\"");
           if(startIdx!=-1){
             endIdx = str.indexOf("\"",startIdx+9);
             if(endIdx!=-1){
               textContent = str.substring(startIdx+9,endIdx);
               scrapCountX = Math.ceil(parseFloat(textContent)/scrapWidth);
             }
           }
           startIdx = str.indexOf("scrapsY=\"");
           if(startIdx!=-1){
             endIdx = str.indexOf("\"",startIdx+9);
             if(endIdx!=-1){
               textContent = str.substring(startIdx+9,endIdx);
               scrapCountY = Math.ceil(parseFloat(textContent)/scrapHeight);
             }
           }
           scrapCount = scrapCountX*scrapCountY;

           startIdx = str.indexOf("realWidth=\"");
           if(startIdx!=-1){
             endIdx = str.indexOf("\"",startIdx+11);
             if(endIdx!=-1){
               textContent = str.substring(startIdx+11,endIdx);
               projectWidth = parseInt(textContent);
             }
           }

           startIdx = str.indexOf("realHeight=\"");
           if(startIdx!=-1){
             endIdx = str.indexOf("\"",startIdx+12);
             if(endIdx!=-1){
               textContent = str.substring(startIdx+12,endIdx);
               projectHeight = parseInt(textContent);
             }
           }


         }

         initWorkSpace();
         retrieveClientSize();
         canvas.style.width = Math.min(clientWidth-canvas_x,projectWidth);
         canvas.style.height = Math.min(clientHeight-canvas_y,projectHeight);
         jg = new jsGraphics("canvas",Math.min(clientWidth-canvas_x,projectWidth),Math.min(clientHeight-canvas_y,projectHeight));

	     for(var j=0;j<scrapCountX;j++){
           for(var i=0;i<scrapCountY;i++){
               updateScrap(j,i);
           }
         }
         canvas.style.display="block";

         startIdx = str.indexOf("<focusedbez>");
         if(startIdx!=-1){
           endIdx = str.indexOf("</focusedbez>",startIdx+12);
           if(endIdx!=-1){
             textContent = str.substring(startIdx+12,endIdx);
             focusedBezFromString(textContent);
           }
         }

         startIdx = str.indexOf("<focusedtext>");
         if(startIdx!=-1){
           endIdx = str.indexOf("</focusedtext>",startIdx+13);
           if(endIdx!=-1){
             textContent = str.substring(startIdx+13,endIdx);
             focusedTextFromString(textContent);
           }
         }


       removeMessageWhaitWhileDocumentLoads();
       enableToolbars();
       switchArrow();

}

function regionHistoryFromString(str){
  var arr1 = str.split("!region!");
  regionHistory = new Array();
  for(var ii=0;ii<arr1.length;ii++){
    var arr = arr1[ii].split(',');
    if(arr.length>0){
      if(arr[0]=='bezier'){
        var bezInfo = new Array(parseInt(arr[5]),new Array(arr[6],arr[7],arr[8],arr[9],arr[10],arr[11],arr[12]),new Array(arr[13],arr[14],arr[15]));
        regionHistory[parseInt(arr[5])] = new Array(arr[0],parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3]),parseInt(arr[4]),bezInfo);
        for(var i=16;i<arr.length;i+=9){
          regionHistory[parseInt(arr[5])][regionHistory[parseInt(arr[5])].length] = new Array(new Array(parseInt(arr[i]),parseInt(arr[i+1])),new Array(parseInt(arr[i+2]),parseInt(arr[i+3])),new Array(parseInt(arr[i+4]),parseInt(arr[i+5])),(arr[i+6]=="true"),parseInt(arr[i+7]),parseInt(arr[i+8]));
        }
      }
      if(arr[0]=='text'){
		var textInfo = new Array(parseInt(arr[5]),arr[6],arr[7],arr[8],arr[9],arr[10],arr[11]);
		var textValue = arr[12].replace(/!!!BR!!!/gi, "<BR>");
        regionHistory[parseInt(arr[5])] = new Array(arr[0],parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3]),parseInt(arr[4]),textInfo,textValue);
      }
      if(arr[0]=='image'){
        regionHistory[parseInt(arr[5])] = new Array(arr[0],parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3]),parseInt(arr[4]),parseInt(arr[5]));
      }
    }
  }
}

function undoRedoLogFromString(str){
  var arr = str.split(",");
}

function focusedBezFromString(str){
  var arr = str.split(",");
  var bezInfo = new Array(parseInt(arr[5]),new Array(arr[6],parseInt(arr[7]),parseFloat(arr[8]),arr[9],arr[10],arr[11],parseInt(arr[12])),new Array(arr[13],parseFloat(arr[14]),arr[15]));
  focusedBez = new Array(arr[0],parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3]),parseInt(arr[4]),bezInfo);
  for(var i=16;i<arr.length;i+=9){
    focusedBez[focusedBez.length] = new Array(new Array(parseInt(arr[i]),parseInt(arr[i+1])),new Array(parseInt(arr[i+2]),parseInt(arr[i+3])),new Array(parseInt(arr[i+4]),parseInt(arr[i+5])),(arr[i+6]=="true"),parseInt(arr[i+7]),parseInt(arr[i+8]));
  }
  mousee = new Array(); reflected = new Array(); node = new Array();
  createFocusedBezDiv(focusedBez);
  
  //This section needs for user is able to move bezier object after picking it without targeting to central cross


				left = focusedBez[1];
				top = focusedBez[2];		
				width = focusedBez[3];
				height = focusedBez[4];
				idd = focusedBez[5][0];
                                bezSteps = new Array();
				drawFocusedBez(); 
  //End of the section
}

function focusedTextFromString(str){
  var arr = str.split(",");
  var textInfo = new Array(parseInt(arr[5]),arr[6],parseInt(arr[7]),arr[8],arr[9],arr[10],arr[11]);
  focusedText = new Array(arr[0],parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3]),parseInt(arr[4]),textInfo,arr[12]); 
  focusedText[6] = focusedText[6].replace(/!!!BR!!!/g,"<BR>");  
  drawFocusedText();
}



function performOpen(fileName){
  var u_openFileDialog = document.getElementById("u_open_document_div");
  if(u_openFileDialog){
    document.body.removeChild(u_openFileDialog);
    u_openDocumentDialog='';
  }
  clearWorkSpace();
  initXMLHttpRequest();
  if (!request) alert("Error initializing XMLHttpRequest!");
  request.open("POST",url,true);
  request.onreadystatechange = processAutoopen;
  request.send("<command type=\"open_document\" filename=\""+fileName+"\"/>");  
}


