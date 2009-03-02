var spanBeg = '<SPAN style="TEXT-DECORATION: underline">';
var spanBegLength = 41;

function prosessLines() {
	if (typeof(focusedText[6])!='undefined' && focusedText[6]) {
		var horizontalScrollHeight = 15;
		var lines = extractLines(focusedText[6]);
		var focusedTextArray = new Array();
		var hiddenSpan = document.getElementById(hiddenSpanId);
		focusedTextArray = calculateText(hiddenSpan, focusedText[6], '<BR>');
	
		_height = lines[lines.length-1][2] - (focusedText[2]-canvas_y+scrollVectorY) + horizontalScrollHeight;
		_width  = focusedTextArray[1];
		focusedText[3] = _width;
		focusedText[4] = _height;
	}
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

function extractLines(str) {
  var res = new Array();
  var strFocusedText = str;
  var strSize = 0;
  if(strFocusedText && strFocusedText.length > 0){
	var lines = strFocusedText.split("<BR>");    
    strSize = removePx(fontSize);
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
	div.style.backgroundColor = backgroundColor;
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
	return result;
}

function isLanguageNotPermitt(text){
	for(var i = 0; i < text.length; i++){
		if(text.charCodeAt(i) > 128) return true;
	}
	return false;
}