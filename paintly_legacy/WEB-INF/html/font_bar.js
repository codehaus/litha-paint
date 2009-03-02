function fontBar(){
	
	// id, state, img, css propName, value=1, value=0
	var panelButtons = [['btnBold',		0, 'font_bold.gif',		'fontWeight',	'bold',		'normal',	'font-weight'],
						['btnItalic',	0, 'font_italic.gif',	'fontStyle', 	'italic',	'normal',	'font-style'],
						['btnUnderline',0, 'font_underline.PNG','textDecoration','underline','none',	'text-decoration']];
//						['btnFalse',	0, '', 'color', strokeColor, strokeColor,'color']];
						
	var panelSelectors = [['selFontStyle',	'Arial',	'fontFamily',	'font-family'],
						  ['selFontSize',	'30px',		'fontSize',		'font-size']];						
	
	function getState(){
		// get fontObject state
	}
	
	this.getJsFontStyle = function(){
		var style = Font.PLAIN;
		if(panelButtons[1][1] == 1){//italic
			style = Font.ITALIC;
		}
		if(panelButtons[0][1] == 1){//bold
			if(style == Font.ITALIC){
				style = Font.ITALIC_BOLD;
			}else{
				style = Font.BOLD;
			}
		}
		return style;
	}
	
	this.initState = function (){
		// init fontPanel state		
		for(var i=0; i<panelButtons.length; i++){
			panelButtons[i][1] = (eval(panelButtons[i][3]) == panelButtons[i][4]) ? 1 : 0;
			if((obj = document.getElementById(panelButtons[i][0])) != null) {
				obj.src = 'img/pickers/'+((panelButtons[i][1] == 0) ? panelButtons[i][2] : ('pressed_'+panelButtons[i][2]));
		 	}
		}

		for(var i=0; i<panelSelectors.length; i++){
			panelSelectors[i][1] = eval(panelSelectors[i][2]);
			if((obj = document.getElementById(panelSelectors[i][0])) != null){
				for(var j=0; j<obj.length; j++){
					if(obj[j].value == panelSelectors[i][1]){
						obj.selectedIndex = j;
						break;
					}
				}
			}
		}
	}
	
	this.setBtnState = function (id){
		// set btnFontPanel state
		for(var i=0; i<panelButtons.length; i++){
			if(panelButtons[i][0] == id && (obj=document.getElementById(panelButtons[i][0])) != null){
				panelButtons[i][1] = (panelButtons[i][1] == 0) ? 1 : 0;
				obj.src = 'img/pickers/'+((panelButtons[i][1] == 0) ? panelButtons[i][2] : ('pressed_'+panelButtons[i][2]));
			}
		}
		this.setState();		
	}
	
	this.setSelState = function (id){
		// set btnFontPanel state
		for(var i=0; i<panelSelectors.length; i++){
			if(panelSelectors[i][0] == id){
				var obj = document.getElementById(id);
				if(obj != null) panelSelectors[i][1] = obj[obj.selectedIndex].value;
			}
		}
		this.setState();
	}

	this.getTextarea = function (){
		var activeObject = document.getElementById('textarea_'+focusedText[5][0]);
		if(activeObject != null){
			return activeObject.innerHTML;
		}
		return '';
	}	
	
	this.setState = function (){		

		for(var i=0; i<panelButtons.length; i++){
			if(panelButtons[i][0] == 'btnFalse') panelButtons[i][4] = panelButtons[i][5] = strokeColor;
			var value = (panelButtons[i][1] == 0) ? panelButtons[i][5] : panelButtons[i][4];
			eval(panelButtons[i][3]+'="'+value+'";');
		}
		for(var i=0; i<panelSelectors.length; i++){				
			eval(panelSelectors[i][2]+'="'+panelSelectors[i][1]+'";');
		}

		if(focusedText.length != 0){
		var activeObject = document.getElementById('textarea_'+focusedText[5][0]);
			var hiddenSpan = document.getElementById('hiddenSpan');

			for(var i=0; i<panelButtons.length; i++){
				if(panelButtons[i][0] == 'btnFalse') panelButtons[i][4] = panelButtons[i][5] = strokeColor;
				var value = (panelButtons[i][1] == 0) ? panelButtons[i][5] : panelButtons[i][4];
			if(hiddenSpan!=null){
				eval('hiddenSpan.style.'+panelButtons[i][3]+' = "' + value + '";');
			}
				if(activeObject){
					//setElementParam(activeObject, panelButtons[i][3], panelButtons[i][6], value, '');					
					eval('activeObject.style.'+panelButtons[i][3]+' = "' + value + '";');
				}
			}

			for(var i=0; i<panelSelectors.length; i++){
				if(hiddenSpan!=null)eval('hiddenSpan.style.'+panelSelectors[i][2]+' = "' + panelSelectors[i][1] + '";');
				//setElementParam(hiddenSpan, panelSelectors[i][2], panelSelectors[i][3], panelSelectors[i][1], '');

				if(activeObject){
					eval('activeObject.style.'+panelSelectors[i][2]+' = "' + panelSelectors[i][1] + '";');
					//setElementParam(activeObject, panelSelectors[i][2], panelSelectors[i][3], panelSelectors[i][1], '');
				}
			}

			if(activeObject && activeObject.value.length != 0){
				formatTextBox();
			}

			if(activeObject != null){
				activeObject.focus();
			}

			if(focusedText && focusedText[6] && focusedText[6].length != 0 && activeObject == null){
			if(/*(activeObject == null ||*/ 
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
}

function formatTextBox(){
	var objElement = document.getElementById('textarea_'+focusedText[5][0]);
	var hiddenSpan = document.getElementById('hiddenSpan');
	
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
		
			elementWidth = calculateText(objElement.value, '\n');
			
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

function calculateText(textValue, delimeter){
	var hiddenSpan = document.getElementById('hiddenSpan');	
	
	var scrollWidth = 20;
	
	var fullString = textValue;
	fullString = fullString.replace(new RegExp('[\x20]','g'),'&nbsp;');

	var posReturn = 0;
	var subString = '';
	var oneSymbolWidth = 0;	
	
	var elementWidth = 0;
	var maxTextblockWidth = 0;	
	
	if(hiddenSpan != null){
		//if(text.length != 0){
			hiddenSpan.innerHTML = 'W';
			oneSymbolWidth = hiddenSpan.offsetWidth;
			
			var lines = fullString.split(delimeter);
			for(var i = 0; i < lines.length; i++){
				posReturn = lines[i].indexOf(delimeter);
				if(posReturn == -1){
					subString = lines[i];
				}else {
					subString = lines[i].substring(0, posReturn-1);
				}				

				if(subString.length == 0) break;
				hiddenSpan.innerHTML = subString;
				
				offset = (2*oneSymbolWidth > scrollWidth) ? 2*oneSymbolWidth : scrollWidth;
				
				if(maxTextblockWidth < hiddenSpan.offsetWidth + offset) 
					maxTextblockWidth = hiddenSpan.offsetWidth + offset;
					
				if((hiddenSpan.offsetWidth + offset) >= width){
					elementWidth = (elementWidth > hiddenSpan.offsetWidth+offset) 
					? elementWidth : hiddenSpan.offsetWidth+offset;
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

function setClipWidth(obj, width){
	var _width = obj.style.clip;
	var startpos = _width.indexOf(' ',2);
	var firstPart = _width.substring(0, startpos+1);
	var secondPart = _width.substring(_width.indexOf('px', startpos), _width.length);
	clip = firstPart + width + secondPart;
	return clip;
}

function pressButton(id){
	if(objFontPanel != null){
		objFontPanel.setBtnState(id);
	}
}

function changeSelector(id){
	if(objFontPanel != null){
		objFontPanel.setSelState(id);
	}
}
