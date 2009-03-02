function setTextState() {
	if(focusedText.length != 0) {
		var activeObject = document.getElementById('textarea_'+focusedText[5][0]);
		var hiddenSpan = document.getElementById(hiddenSpanId);
		
		if (hiddenSpan != null) {
			eval('hiddenSpan.style.fontWeight = "' + fontWeight + '";');
			eval('hiddenSpan.style.fontStyle = "' + fontStyle + '";');
			eval('hiddenSpan.style.textDecoration = "' + textDecoration + '";');
			eval('hiddenSpan.style.fontFamily = "' + fontFamily + '";');
			eval('hiddenSpan.style.fontSize = "' + fontSize + '";');						
		}
		
		if (activeObject) {
			eval('activeObject.style.fontWeight = "' + fontWeight + '";');
			eval('activeObject.style.fontStyle = "' + fontStyle + '";');
			eval('activeObject.style.textDecoration = "' + textDecoration + '";');
			eval('activeObject.style.fontFamily = "' + fontFamily + '";');
			eval('activeObject.style.fontSize = "' + fontSize + '";');			
		}

		if(activeObject && activeObject.value.length != 0) formatTextBox();

		if(activeObject != null) activeObject.focus();

		if(focusedText && focusedText[6] && focusedText[6].length != 0 && activeObject == null){
			if(
			(activeObject == null && isFocusedTextChanged(focusedText, focusedText[6])) ||
			(activeObject != null && isFocusedTextChanged(focusedText, activeObject.value))
				&& focusedText[5][text_color] == strokeColor){

				focusedText[5][text_size]	= fontSize;
				focusedText[5][text_weight]	= fontWeight;
				focusedText[5][text_style]	= fontStyle;
				focusedText[5][text_family]	= fontFamily;
				focusedText[5][text_decoration] = textDecoration;

				prosessLines();
				saveTextToUndoRedoLog("update");	
				sendObject(focusedText,"update");
				drawFocusedText();
				setHandlersSet(16);
			}
		}
	}
}

function formatTextBox(){
	var objElement = document.getElementById('textarea_'+focusedText[5][0]);
	var hiddenSpan = document.getElementById(hiddenSpanId);
	
	if(objElement.value.indexOf('\t') != -1) objElement.value = removeTab(objElement.value, ' ');
	
	if(objElement){
		var objDiv = objElement.parentNode;		
		var maxElements = 200;
		
		var fullString = objElement.value;
		fullString = fullString.replace(new RegExp('[\x20]','g'),'&nbsp;');

		var elementWidth = width;
		var _width = 0;
		
		if(objElement != null && hiddenSpan != null){	
		
			if(objElement.value.length > maxElements){
				objElement.value = objElement.value.substring(0, maxElements);
				alert('Maximum symbols in the textblock are ' + maxElements);
			}
		
			elementWidth = calculateText(hiddenSpan, objElement.value, '\n');
			
			_width = removePx(elementWidth[1]);
			_text = elementWidth[0];
			
			if(_text.length == 0 || _width < width){// && objElement.value != ''){
				if(_text.length == 0){
					_width = objElement.style.width;
				}
			}else{
				objDiv.style.width = _width;
				objDiv.style.clip = setClipWidth(objDiv, _width);
			}
			objElement.style.width = _width;
			return true;
		}
	}
	return false;
}

function calculateText(objHiddenSpan, textValue, delimeter) {
	var scrollWidth = 20;
	
	var fullString = textValue;
	fullString = fullString.replace(new RegExp('[\x20]','g'),'&nbsp;');

	var posReturn = 0;
	var subString = '';
	var oneSymbolWidth = 0;	
	
	var elementWidth = 0;
	var maxTextblockWidth = 0;	
	
	if(objHiddenSpan != null){
		//if(text.length != 0){
			objHiddenSpan.innerHTML = 'W';
			oneSymbolWidth = objHiddenSpan.offsetWidth;
			
			var lines = fullString.split(delimeter);
			for(var i = 0; i < lines.length; i++){
				posReturn = lines[i].indexOf(delimeter);
				if(posReturn == -1){
					subString = lines[i];
				}else {
					subString = lines[i].substring(0, posReturn-1);
				}				

				if(subString.length == 0) break;
				objHiddenSpan.innerHTML = subString;
				
				offset = (2*oneSymbolWidth > scrollWidth) ? 2*oneSymbolWidth : scrollWidth;
				
				if(maxTextblockWidth < objHiddenSpan.offsetWidth + offset) 
					maxTextblockWidth = objHiddenSpan.offsetWidth + offset;
					
				if((objHiddenSpan.offsetWidth + offset) >= width){
					elementWidth = (elementWidth > objHiddenSpan.offsetWidth+offset) 
					? elementWidth : objHiddenSpan.offsetWidth+offset;
				}		
			}			
			
			if(maxTextblockWidth < width && textValue != ''){
				elementWidth = maxTextblockWidth;
			}
			elementWidth = removePx(elementWidth);
			if(elementWidth == 0) elementWidth = 3*scrollWidth;
		//}			
	}
	return new Array(textValue,elementWidth);
}

function setClipWidth(obj, width) {
	if(obj) {
		var clipArray = obj.style.clip.split(",");
	    return clipArray[0]+","+width+","+clipArray[2]+","+clipArray[3];
	}
}

function getJsFontStyle(){
		var style = Font.PLAIN;
		if(fontStyle == 'italic'){//italic
			style = Font.ITALIC;
		}
		if(fontWeight == 'bold'){//bold
			if(style == Font.ITALIC){
				style = Font.ITALIC_BOLD;
			}else{
				style = Font.BOLD;
			}
		}
		return style;
	}
