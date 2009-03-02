var spanBeg = '<SPAN style="TEXT-DECORATION: underline">';
var spanBegLength = 41;

function prosessLines(){
	var horizontalScrollHeight = 15;
	var lines = extractLines(focusedText[6]);
	var focusedTextArray = new Array();
	focusedTextArray = calculateText(focusedText[6], '<BR>');

	_height = lines[lines.length-1][2] - (focusedText[2]-canvas_y+scrollVectorY) + horizontalScrollHeight;
	_width  = focusedTextArray[1];
	focusedText[3] = _width;
	focusedText[4] = _height;
}

function removePx(val){
	val +='';
	regExp = /[px]/gi;
	val = parseInt(val.replace(regExp, ''));
	return val;
}

function removeTab(val, value){
	val +='';
	regExp = /\t/gi;
	val = val.replace(regExp, value);
	return val;
}

function removeSpace(val){
	val +='';
	regExp = /[\u20]/gi;
	val = val.replace(regExp, '&nbsp;');
	return val;
}

function extractLines(str){
  var res = new Array();
  var strFocusedText = str;
  var strSize = 0;
  //var content = document.getElementById('textarea_'+id);
  if(strFocusedText.length > 0){
    //var str = focusedText[6];
    var lines = strFocusedText.split("<BR>");
    
    strSize = removePx(fontSize);
	//if(fontSize.indexOf('px') != -1) strSize = parseInt(fontSize.substring(0, fontSize.indexOf('px')));

	for(var i=0;i<lines.length;i++){
		//if(i != lines.length-1) lines[i] = lines[i].substring(0, lines[i].length-1); removed \n in th epast. Not neccessary now becase <BR> used instead of \n
		res[i] = new Array();		
		res[i][0] = lines[i];
		res[i][1] = focusedText[1] - canvas_x + 2 + scrollVectorX;
		res[i][2] = focusedText[2] - canvas_y + (i+1)*strSize - Math.floor(strSize/10) + scrollVectorY;
	}    
  }
  return res;
}
/*
function extractLines(id){
  var res = new Array();
  var div = document.getElementById(id);
  if(div){
    var clone = div.cloneNode();
    clone.style.visibility = "hidden";
    canvas.appendChild(clone);
    var str = div.innerHTML;
    var lines = str.split("<BR>");
    clone.innerHTML +=lines[0];
    res[0] = new Array();
    res[0][0] = lines[0];
    res[0][1] = clone.offsetLeft;
    res[0][2] = clone.offsetTop+clone.offsetHeight-5;
      for(var i=1;i<lines.length;i++){
        clone.innerHTML +="<BR>"+lines[i];
	res[i] = new Array();
	res[i][0] = lines[i];
        res[i][1] = clone.offsetLeft;
	res[i][2] = clone.offsetTop+clone.offsetHeight-5;
      }    
  }
  return res;
}
*/

function keyPress(evt){
/*
  var keyCode = evt?evt.keyCode:event.keyCode;
  jg.restoreHiddenCanvas(5);
  jg.paint();
  var div = document.getElementById(curFigureId);  
  var cursorPos = div.innerHTML.indexOf(spanBeg);
  var firstPart =div.innerHTML.substring(0,cursorPos);
  var secondPart =div.innerHTML.substring(cursorPos);
  if(keyCode == 0x20){      
    div.innerHTML=firstPart+"&nbsp;"+secondPart;     
  }
  else if(keyCode == 13){
    div.innerHTML=firstPart+"&nbsp;<BR>"+secondPart;
  }else if(keyCode == 27){
    freezeText();
  }else{
    div.innerHTML=firstPart+String.fromCharCode(keyCode)+secondPart;
  }

  jg.storeHiddenCanvas(5);
  jg.drawRect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
  jg.paint();
  jg.storeHiddenCanvas(6);
  left = div.offsetLeft;
  top = div.offsetTop;
  width = div.offsetWidth;
  height = div.offsetHeight;
*/  
  return false;
}

function keyDown(evt){
  var keyCode = evt?evt.keyCode:event.keyCode;
/*
keyCode=37 <-
keyCode=39 ->
keyCode=38 ^
keyCode=40 v
keyCode=36 Home
keyCode=35 End
keyCode=33 PgUp
keyCode=34 PgDn
keyCode=8 Backspace
keyCode=46 Delete
*/
/*
  if(keyCode==37 || keyCode==38 || keyCode==39 || keyCode==40 || keyCode==35 || keyCode==36 || keyCode==33 || keyCode==34){
    moveCursor(keyCode);
    return false;
  }else if(keyCode==8){
    backSpace();
  }else if(keyCode==46){
    del();
  }else{ 
    //alert(keyCode);
  }
*/  
}

function moveCursor(keyCode){
    jg.restoreHiddenCanvas(5);
    jg.paint();
    var div = document.getElementById(curFigureId);  
    if(div){    
      var inner = div.innerHTML;
      var cursorBegPos = inner.indexOf(spanBeg);
      var cursorEndPos = inner.indexOf('</SPAN>');
      
      if(keyCode==37){
        inner = moveLeft(cursorBegPos,cursorEndPos,1,inner);
      }
      if(keyCode==39){
        inner = moveRight(cursorBegPos,cursorEndPos,1,inner);
      }
      if(keyCode==38){
        inner = moveUp();
      }
      if(keyCode==40){
        inner = moveDown(cursorBegPos,cursorEndPos,1,inner);
      }
      if(keyCode==36){
        inner = moveHome();
      }
      if(keyCode==35){
        inner = moveEnd();
      }
      if(keyCode==33){
        inner = moveFirst();
      }
      if(keyCode==34){
        inner = moveLast();
      }
      div.innerHTML=inner;
      //alert(inner);
      jg.storeHiddenCanvas(5);      
      jg.drawRect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
      jg.paint();
      jg.storeHiddenCanvas(6);
    }
}

function isNbsp(index,str){
  var res=false;
  if('&nbsp;'==str.substring(index-5,index+1) || '&nbsp;'==str.substring(index,index+6)){res=true;}
  return res;
}

function isBR(index,str){
  var res=false;
  if('<BR>'==str.substring(index-3,index+1) || '<BR>'==str.substring(index,index+4)){res=true;}
  return res;
}


function moveLeft(cursorBegPos,cursorEndPos,delta,inner){
  var res=inner;
  if(cursorBegPos>0){
    var str1 = inner.substring(0,cursorBegPos);
    var str2 = inner.substring(cursorBegPos+spanBegLength,cursorEndPos);
    var str3 = inner.substring(cursorEndPos+7,inner.length);
    if(!isNbsp(cursorBegPos-delta,inner) && !isBR(cursorBegPos-delta,inner)){
      res = str1.substring(0,str1.length-delta)+spanBeg+str1.substring(str1.length-delta,str1.length-delta+1)+'</SPAN>'+str1.substring(str1.length-delta+1,str1.length)+str2+str3;       
    }else if(isNbsp(cursorBegPos-delta,inner)){
      res = str1.substring(0,str1.length-delta-5)+spanBeg+str1.substring(str1.length-delta-5,str1.length-delta+1)+'</SPAN>'+str1.substring(str1.length-delta+1,str1.length)+str2+str3;                
    }else if(isBR(cursorBegPos-delta,inner)){
      res = moveLeft(cursorBegPos,cursorEndPos,5,inner);
    }
  }
  //alert(res);
  return res;
}

function moveRight(cursorBegPos,cursorEndPos,delta,inner){
  var res=inner;
  if(cursorEndPos<(inner.length-7)){
    var str1 = inner.substring(0,cursorBegPos);
    var str2 = inner.substring(cursorBegPos+spanBegLength,cursorEndPos);
    var str3 = inner.substring(cursorEndPos+7,inner.length);
    if(!isNbsp(cursorEndPos+delta+6,inner) && !isBR(cursorEndPos+delta+6,inner)){
      res = str1+str2+str3.substring(0,delta-1)+spanBeg+str3.substring(delta-1,delta)+'</SPAN>'+str3.substring(delta);       
    }else if(isNbsp(cursorEndPos+delta+6,inner)){      
      res = str1+str2+str3.substring(0,delta-1)+spanBeg+'&nbsp;'+'</SPAN>'+str3.substring(delta+5);        
    }else if(isBR(cursorEndPos+delta+6,inner)){
      res = moveRight(cursorBegPos,cursorEndPos,5,inner);
    }	
  }
  return res;    
}

function moveUp(){
  var div = document.getElementById(curFigureId);  
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);
  for(var i=0;i<lines.length;i++){
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
    var cursorPos = lines[i][0].indexOf(spanBeg);
    if(cursorPos>-1 && i>0){
      var prevLineRest = 0;
      if(lines[i-1][0].length>cursorPos){prevLineRest = lines[i-1][0].length-cursorPos-1;}
      var stepsLeft = cursorPos+1+prevLineRest;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveLeft(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;
}

function moveDown(cursorBegPos,cursorEndPos,inner){
  var div = document.getElementById(curFigureId);
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);
  for(var i=0;i<lines.length;i++){
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
  }
  for(var i=0;i<lines.length;i++){
    var cursorPos = lines[i][0].indexOf(spanBeg);
    if(cursorPos>-1 && i<lines.length-1){
      lines[i][0]=lines[i][0].replace(spanBeg,'');
      lines[i][0]=lines[i][0].replace('</SPAN>','');
      var nextLineRest = lines[i+1][0].length;
      if(lines[i+1][0].length>cursorPos){nextLineRest = cursorPos+1;}
      var stepsLeft = lines[i][0].length-1-cursorPos+nextLineRest;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveRight(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;
}

function moveHome(){
  var div = document.getElementById(curFigureId);  
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);
  for(var i=0;i<lines.length;i++){
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
    var cursorPos = lines[i][0].indexOf(spanBeg);
    if(cursorPos>-1){
      var stepsLeft = cursorPos;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveLeft(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;
}

function moveEnd(cursorBegPos,cursorEndPos,inner){
  var div = document.getElementById(curFigureId);
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);

  for(var i=0;i<lines.length;i++){
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
    var cursorPos = lines[i][0].indexOf(spanBeg);

    if(cursorPos>-1){
      lines[i][0]=lines[i][0].replace(spanBeg,'');
      lines[i][0]=lines[i][0].replace('</SPAN>','');
      var stepsLeft = lines[i][0].length-cursorPos-1;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveRight(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;
}

function moveFirst(){
  var div = document.getElementById(curFigureId);  
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);
  var restLinesLength=0;
  for(var i=0;i<lines.length;i++){    
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
    var cursorPos = lines[i][0].indexOf(spanBeg);
    if(i>0 && cursorPos==-1){restLinesLength+=lines[i][0].length;}
    if(cursorPos>-1 && i>0){
      var firstLineRest = 0;
      if(lines[0][0].length>cursorPos){firstLineRest = lines[0][0].length-cursorPos-1;}
      var stepsLeft = cursorPos+1+firstLineRest+restLinesLength;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveLeft(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;
}

function moveLast(){
  var div = document.getElementById(curFigureId);
  var res = div.innerHTML;
  var lines = extractLines(curFigureId);
  var restLinesLength=0;
  var begin=false;
  for(var i=0;i<lines.length;i++){
    while(lines[i][0].indexOf('&nbsp;')>-1){lines[i][0] = lines[i][0].replace('&nbsp;',' ');}
    if(begin && i<lines.length-1){restLinesLength+=lines[i][0].length;}    
    if(lines[i][0].indexOf(spanBeg)>-1){begin=true;}    
  }
  for(var i=0;i<lines.length;i++){
    var cursorPos = lines[i][0].indexOf(spanBeg);
    if(cursorPos>-1 && i < lines.length-1){
      lines[i][0]=lines[i][0].replace(spanBeg,'');
      lines[i][0]=lines[i][0].replace('</SPAN>','');
      var lastLineRest = lines[lines.length-1][0].length;
      if(lines[lines.length-1][0].length>cursorPos){lastLineRest = cursorPos+1;}
      var stepsLeft = lines[i][0].length-1-cursorPos+lastLineRest+restLinesLength;      
      if(div){    
        for(var i=0;i<stepsLeft;i++){  
          var inner = div.innerHTML;
          var cursorBegPos = inner.indexOf(spanBeg);
          var cursorEndPos = inner.indexOf('</SPAN>');
          div.innerHTML = moveRight(cursorBegPos,cursorEndPos,1,inner);
        }
        res = div.innerHTML;
      }
    }
  }
  return res;  
}

function deleteSymbolLeft(index,inner){
  var res=inner;
  if(index>0){
    var str2 = inner.substring(index);
    if(isNbsp(index-1,inner)){
      var str1 = inner.substring(0,index-6);      
      res=str1+str2; 
    }
    else if(isBR(index-1,inner)){
      var str1 = inner.substring(0,index-4);
      res=str1+str2;
    }
    else{
      var str1 = inner.substring(0,index-1);
      res = str1+str2;
    }
  }
  return res;
}

function deleteSymbolRight(index,inner){
  var res=inner;
  if(index<(inner.length-7)){
    var str1 = inner.substring(0,index+1);
    if(isNbsp(index+1,inner)){
      var str2 = inner.substring(index+7);      
      res=str1+str2; 
    }
    else if(isBR(index+1,inner)){
      var str2 = inner.substring(index+5);
      res=str1+str2;
    }                                  
    else{
      var str2 = inner.substring(index+2);
      res = str1+str2;
    }
  }
  return res;
}


function backSpace(){
  jg.restoreHiddenCanvas(5);
  jg.paint();
  var div = document.getElementById(curFigureId);
  var inner = div.innerHTML;
  var cursorPos = inner.indexOf(spanBeg);
  inner = deleteSymbolLeft(cursorPos,inner);
  div.innerHTML=inner;  
  jg.storeHiddenCanvas(5);      
  jg.drawRect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
  jg.paint();
  jg.storeHiddenCanvas(6);
  left = div.offsetLeft;
  top = div.offsetTop;
  width = div.offsetWidth;
  height = div.offsetHeight;

}

function del(){
  jg.restoreHiddenCanvas(5);
  jg.paint();
  var div = document.getElementById(curFigureId);
  var inner = div.innerHTML;
  var cursorBegPos = inner.indexOf(spanBeg);
  var cursorEndPos = inner.indexOf('</SPAN>');
  if(cursorEndPos+6<inner.length-1){
    inner=moveRight(cursorBegPos,cursorEndPos,1,inner);
    inner=deleteSymbolLeft(inner.indexOf(spanBeg),inner);
  }
  div.innerHTML=inner;
  jg.storeHiddenCanvas(5);
  jg.drawRect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
  jg.paint();
  jg.storeHiddenCanvas(6);
  left = div.offsetLeft;
  top = div.offsetTop;
  width = div.offsetWidth;
  height = div.offsetHeight;

}

function removeSPAN(str){
  var res=str;
  var begIndex = res.indexOf(spanBeg);
  if(begIndex>-1){
    var res = res.substring(0,begIndex)+res.substring(begIndex+spanBegLength);
  }
  var endIndex = res.indexOf("</SPAN>");
  if(endIndex>-1){
    var res = res.substring(0,endIndex)+res.substring(endIndex+7);
  }
  return res;
}

function removeNBSP(str){
  var res=str;
  while(res.indexOf("&nbsp;") >-1) res = res.replace("&nbsp;"," ");
  return res;
}

function createEditBox(left, top, width, height, id){

	if(width < 0){
		width	= Math.abs(width);
		left	= left	- width;
	}

	if(height < 0){
		height	= Math.abs(height);
		top		= top	- height;
	}
/*
	if(document.getElementById('hiddenSpan') == null){
		hiddenSpan = document.createElement("span");
		hiddenSpan.setAttribute('id', 'hiddenSpan');
		hiddenSpan.style.visibility = 'hidden';
		document.body.appendChild(hiddenSpan);
	}
*/
	div = document.createElement("div");

	textarea = document.createElement("textarea");
	textarea.setAttribute('id', 'textarea_'+id);
	textarea.setAttribute('class', 'editBox');
	textarea.setAttribute('wrap', 'off');

	textarea.style.width  = width;
	textarea.style.height = height-1;
	textarea.style.color  = strokeColor;

	textarea.style.fontFamily = fontFamily+', sans-serif';
	textarea.style.fontSize = fontSize;
	textarea.style.borderWidth = 1;
	textarea.style.borderColor = '#25820A';
	textarea.style.borderStyle = 'solid';
	textarea.style.backgroundColor = 'white';
	
	div.appendChild(textarea);	
	
	jg.drawDiv(left, top, width, height, div);
	jg.paint();
	
	textarea = document.getElementById('textarea_'+id);
	textarea.onkeyup = formatTextBox;
		
	div = textarea.parentNode;
	
	div.setAttribute('id', id);
	div.style.backgroundColor = 'white';
	div.style.clip = 'rect(0px, '+width+'px, '+height+'px, 0px)';
	
	if(canvas.setCapture) canvas.setCapture();
	if(div.focus) div.focus();
	textarea.focus();
}

function isFocusedTextChanged(arrFocusedText, text){
	var result = 0;
	if(arrFocusedText[1] != left	||
	   arrFocusedText[2] != top		||
	   arrFocusedText[5][text_color] != strokeColor ||
	   arrFocusedText[5][text_size]  != fontSize ||
	   arrFocusedText[5][text_weight]!= fontWeight ||
	   arrFocusedText[5][text_style] != fontStyle ||
	   arrFocusedText[5][text_decoration] != textDecoration ||
	   arrFocusedText[5][text_family] != fontFamily ||	   
	   arrFocusedText[6] != text) result = 1;
/*
	alert((arrFocusedText[1] != left)	+"|"+
	   (arrFocusedText[2] != top)		+"|"+
	   (arrFocusedText[5][text_color] != strokeColor) +"|"+
	   (arrFocusedText[5][text_size]  != fontSize) +"|"+
	   (arrFocusedText[5][text_weight]!= fontWeight) +"|"+
	   (arrFocusedText[5][text_style] != fontStyle) +"|"+
	   (arrFocusedText[5][text_decoration] != textDecoration) +"|"+
	   (arrFocusedText[5][text_family] != fontFamily) +"|"+
	   (arrFocusedText[6] != text));
*/
		return result;
}

function isLanguageNotPermitt(text){
	for(var i = 0; i < text.length; i++){
		if(text.charCodeAt(i) > 128) return true;
	}
        return false;
}