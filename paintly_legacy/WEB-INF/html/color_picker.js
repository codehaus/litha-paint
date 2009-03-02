function ColorPicker(){
	var itemColor = '#FFFFFF';
	var itemVariable;
	var itemOpacity = '100';
	var itemTypeOpacity;
	var windowID;
    var nextEventHandler;

	var colorsMap = [
	["#000000", "#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#330000", "#333300","#336600", "#339900", "#33CC00", "#33FF00", "#660000", "#663300","#666600", "#669900", "#66CC00", "#66FF00"],
	["#000033", "#003333", "#006633", "#009933", "#00CC33", "#00FF33", "#330033", "#333333","#336633", "#339933", "#33CC33", "#33FF33", "#660033", "#663333","#666633", "#669933", "#66CC33", "#66FF33"],
	["#000066", "#003366", "#006666", "#009966", "#00CC66", "#00FF66", "#330066", "#333366","#336666", "#339966", "#33CC66", "#33FF66", "#660066", "#663366","#666666", "#669966", "#66CC66", "#66FF66"],
	["#000099", "#003399", "#006699", "#009999", "#00CC99", "#00FF99", "#330099", "#333399","#336699", "#339999", "#33CC99", "#33FF99", "#660099", "#663399","#666699", "#669999", "#66CC99", "#66FF99"],
	["#0000CC", "#0033CC", "#0066CC", "#0099CC", "#00CCCC", "#00FFCC", "#3300CC", "#3333CC","#3366CC", "#3399CC", "#33CCCC", "#33FFCC", "#6600CC", "#6633CC","#6666CC", "#6699CC", "#66CCCC", "#66FFCC"],
	["#0000FF", "#0033FF", "#0066FF", "#0099FF", "#00CCFF", "#00FFFF", "#3300FF", "#3333FF","#3366FF", "#3399FF", "#33CCFF", "#33FFFF", "#6600FF", "#6633FF","#6666FF", "#6699FF", "#66CCFF", "#66FFFF"],

	["#990000", "#993300", "#996600", "#999900", "#99CC00", "#99FF00", "#CC0000", "#CC3300","#CC6600", "#CC9900", "#CCCC00", "#CCFF00", "#FF0000", "#FF3300","#FF6600", "#FF9900", "#FFCC00", "#FFFF00"],
	["#990033", "#993333", "#996633", "#999933", "#99CC33", "#99FF33", "#CC0033", "#CC3333","#CC6633", "#CC9933", "#CCCC33", "#CCFF33", "#FF0033", "#FF3333","#FF6633", "#FF9933", "#FFCC33", "#FFFF33"],
	["#990066", "#993366", "#996666", "#999966", "#99CC66", "#99FF66", "#CC0066", "#CC3366","#CC6666", "#CC9966", "#CCCC66", "#CCFF66", "#FF0066", "#FF3366","#FF6666", "#FF9966", "#FFCC66", "#FFFF66"],
	["#990099", "#993399", "#996699", "#999999", "#99CC99", "#99FF99", "#CC0099", "#CC3399","#CC6699", "#CC9999", "#CCCC99", "#CCFF99", "#FF0099", "#FF3399","#FF6699", "#FF9999", "#FFCC99", "#FFFF99"],
	["#9900CC", "#9933CC", "#9966CC", "#9999CC", "#99CCCC", "#99FFCC", "#CC00CC", "#CC33CC","#CC66CC", "#CC99CC", "#CCCCCC", "#CCFFCC", "#FF00CC", "#FF33CC","#FF66CC", "#FF99CC", "#FFCCCC", "#FFFFCC"],
	["#9900FF", "#9933FF", "#9966FF", "#9999FF", "#99CCFF", "#99FFFF", "#CC00FF", "#CC33FF","#CC66FF", "#CC99FF", "#CCCCFF", "#CCFFFF", "#FF00FF", "#FF33FF","#FF66FF", "#FF99FF", "#FFCCFF", "#FFFFFF"]];

	var miniColorsMap = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

	this.getColorPicker = function(){
		var output = "";

		output += '<table border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0;padding:0">'

			+ '<tr><td colspan="2">'
			+ '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:3"><tr>'
			+ '<td width="10">&nbsp;</td>'
			+ '<td width="40" align="left">'
			+ '<img id="colorBox" title="item color" style="margin-bottom:3;padding:5;background-color:' + itemColor + '" border="0" src="img/zero.gif" width="45" height="10"/></td>'
			+ '<td width="30">&nbsp;</td>'			
			+ '<td  width="16" align="left" onclick="colorPicker.selectAlphaColor()">'
			+ '<img id="alphaColor" border="0" src="img/pickers/alpha.gif" width="21" height="21" alt="alpha color" title="alpha color"/></a></td>'
			+ '<td id="popupHeaderClose" width="8%" align="right" onClick="colorPicker.closeWindow()">'
			+ '<img src="./img/pickers/close.gif"></td></tr>'
			
			+ '<tr><td width="10" id="systemFont">#</td>'
			+ '<td width="55" align="left"><input id="colorTextBox" style="width:50px;background-color:white" class="textColorPicker" type="text" size="6" maxlength="6" title="item color value" onKeyUp="colorPicker.manualSetColor(this)" value="'+itemColor+'"/></td>'
			+ '<td width="10" id="systemFont">Opasity</td>'
			+ '<td width="30" align="left"><input id="opacityTextBox" style="width:25px;background-color:white" class="textColorPicker" type="text" size="3" maxlength="3" title="opacity" onKeyUp="colorPicker.manualSetOpacity(this)" value="'+itemOpacity+'"/></td>'			
			+ '<td align="center"><input  style="width:66px;height:19;border-width:0;background-image:url(img/pickers/apply.gif)" type="button" id="insertColor" name="insert" value="" style="margin-top:1px" onclick="colorPicker.releaseColorPicker()"></td>'
			+ '</tr></table>'
			+ '</td></tr>'
			+ '<tr><td>'
			+ '<table border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0;padding:0"><tr><td>'
			+ '<table border="0" cellspacing="1" cellpadding="0" style="margin:0;padding:0" bgcolor="black">';

			for (var k=0; k<miniColorsMap.length; k++) {
				output += '<tr><td bgcolor="'+miniColorsMap[k]+'" onclick="colorPicker.selectColor(\''+miniColorsMap[k]+'\')" >'
					+ '<img border="0" src="img/zero.gif" title="'+miniColorsMap[k]+'" alt="'+miniColorsMap[k]+'" width="10" height="10"/></td></tr>';
			}

			output+= '</table>'
					+ '</td><td>'
					+ '<table border="0" cellspacing="1" cellpadding="0" align="center" bgcolor="black">';

			for (var i=0; i<colorsMap.length; i++) {
				output += '<tr>';
				for (var j=0; j<colorsMap[0].length; j++) {
					output += '<td bgcolor="'+colorsMap[i][j]+ '" onclick="colorPicker.selectColor(\''+colorsMap[i][j]+'\')">'
						+ '<img border="0" src="img/zero.gif" title="'+colorsMap[i][j]+'" alt="'+colorsMap[i][j]+'" width="10" height="10"/></a></td>';
				}
				output += '</tr>';
			}
			output	+= '</table></td></tr>'
					+ '</table></td></tr>'
					+ '</table>';

			return output;
	}
	
	this.releaseColorPicker = function(){
		this.selectColor(itemColor);
		this.setResultColor();

		applycurrentColor(itemVariable);

		closeWindowId(windowID);		
		setHandlersSet(nextEventHandler);
		if(canvas.setCapture) canvas.setCapture();
	}
	
	this.closeWindow = function(){
		closeWindowId(windowID);
	}
	
	this.getNextEventHandler = function(){
		return nextEventHandler;
	}

	this.validateColor = function(color) {
		var length = color.length;
		//if ((pos = color.indexOf('#')) != -1) {
			length = (color.length > 6) ? 6 : color.length;
			//color	= color.substring(pos+1, length);
			var reg	= /[^0-9A-F]/gi;
			color	= color.replace(reg, '0');
			while(color.length < 6){
				color+='0';
			}
			//return '#'+color;
			return color;
		//}
		//return '#ffffff';
	}
	
	this.validateOpacity = function(opacity){
		var _opacity = opacity;
		if (_opacity.length == 0){
			_opacity = '0';
		}else if(_opacity.length > 3){
			_opacity = _opacity.substring(0,2);
		}
		
		var reg	 = /[^0-9]/gi;
		_opacity = parseInt(_opacity.replace(reg, '0'));
		
		_opacity = (_opacity > 100) ? 100 : _opacity;		
		return _opacity;
	}

	this.setResultColor = function(){
		eval(itemTypeOpacity + " = '" + (itemOpacity/100) + "';");
		eval(itemVariable + " = '"+itemColor+"';");
		
		var colorCell = document.getElementById('btn'+itemVariable);
		
		var iColor = '';
		var output = '&nbsp;';

		if(itemColor != 'alpha'){
			iColor = itemColor;
			if(itemVariable == 'strokeColor'){
				output = '<table cellspacing="0" cellpadding="0" width="100%" width="21" height="21">'
					   + '<tr><td width="100%" height="6" colspan="3" bgcolor="'+iColor+'"></td></tr>'
					   + '<tr><td width="6" height="9" bgcolor="'+iColor+'"></td>'
					   + '<td width="9" height="9" bgcolor="#FFFFFF"></td>'
					   + '<td width="6" height="9" bgcolor="'+iColor+'"></td></tr>'
					   + '<tr><td width="100%" height="6" colspan="3" bgcolor="'+iColor+'"></td></tr></table>';
			}
		}else{
			iColor = '#FFFFFF';
			var imgColor = 'alpha.gif';
			if(itemVariable == 'strokeColor') imgColor = 'alpha_contur.gif';
			output = '<img border="0" src="img/pickers/'+imgColor+'" width="21" height="21" alt="alpha color" title="alpha color"/>';
		}
		
		if(itemVariable == 'strokeColor'){
		    var strkClr = document.getElementById('btnstrokeColor_td');
			if (strkClr) strkClr.innerHTML = output;
		}else{
			if(colorCell)colorCell.innerHTML = output;
			if(colorCell)colorCell.style.backgroundColor = iColor;
		}		
	}


	this.selectColor = function(valueColor) {
		this.setColor(valueColor);
		//closeWindowId(windowID);
	}

	this.selectAlphaColor = function() {
		itemColor = 'alpha';
		this.setColor(itemColor);
		//closeWindowId(windowID);
	}

	this.setColor = function(valueColor){
		// show colorsMap only
		iColorText = document.getElementById("colorTextBox");
		iColorBox  = document.getElementById("colorBox");
		valueColor = valueColor.replace(/#/gi,'');
		
		var iTextColor = '';
		var iBoxColor = '';
		
		if(valueColor != 'alpha'){
			iTextColor = iBoxColor = valueColor;
			itemColor = '#'+valueColor;
		}else{
			iBoxColor = 'FFFFFF';
			iTextColor = '';
		}
		if (iColorBox) iColorBox.style.backgroundColor = '#'+iBoxColor;
		if (iColorText) iColorText.value = iTextColor;
	}

	this.init = function(variable, ID){
		
		itemColor		= eval(variable);
		itemVariable	= variable;
		windowID		= ID;
		
		if(itemVariable.indexOf('stroke') != -1){
			itemTypeOpacity = 'strokeOpacity';
		}else{
			itemTypeOpacity = 'fillOpacity';		
		}
		itemOpacity		= eval(itemTypeOpacity)*100;		
		itemOpacity		= this.validateOpacity(itemOpacity+'');
		
		if(itemColor == 'alpha'){
			iBoxColor = '#FFFFFF';
			iTextColor = '';		
		}else{
			itemColor = itemColor.replace(/#/gi,'');
			itemColor = this.validateColor(itemColor);
			iBoxColor = itemColor;
			iTextColor = itemColor;			
		}

		var opacityTB = document.getElementById("opacityTextBox");
		if (opacityTB) opacityTB.value = itemOpacity;
		var colorTB = document.getElementById("colorTextBox");
		if (colorTB) colorTB.value = iTextColor;		
		var colorB = document.getElementById("colorBox");
		if (colorB) colorB.style.backgroundColor = iBoxColor;
		
        nextEventHandler = curEventHandler;
        if(document.releaseCapture) document.releaseCapture();
        setHandlersSet(35);
	}

	this.initPanelColor = function(){
		this._initPanelColor('strokeColor');
		this._initPanelColor('fillColor');
	}
	
	this._initPanelColor = function(itemVariable){
		var colorCell = document.getElementById('btn'+itemVariable);
		
		var iColor = '';
		var output = '&nbsp;';
		var _itemColor = eval(itemVariable);

		if(_itemColor != 'alpha'){
			iColor = _itemColor;
			if(itemVariable == 'strokeColor'){
				output = '<table cellspacing="0" cellpadding="0" width="100%" width="21" height="21">'
					   + '<tr><td width="100%" height="6" colspan="3" bgcolor="'+iColor+'"></td></tr>'
					   + '<tr><td width="6" height="9" bgcolor="'+iColor+'"></td>'
					   + '<td width="9" height="9" bgcolor="#FFFFFF"></td>'
					   + '<td width="6" height="9" bgcolor="'+iColor+'"></td></tr>'
					   + '<tr><td width="100%" height="6" colspan="3" bgcolor="'+iColor+'"></td></tr></table>';
			}
		}else{
			iColor = '#FFFFFF';
			var imgColor = 'alpha.gif';
			if(itemVariable == 'strokeColor') imgColor = 'alpha_contur.gif';
			output = '<img border="0" src="img/pickers/'+imgColor+'" width="21" height="21" alt="alpha color" title="alpha color"/>';
		}
		
		if(itemVariable == 'strokeColor'){
		    var strkClr = document.getElementById('btnstrokeColor_td');
			if (strkClr != null) strkClr.innerHTML = output;
		}else{
			if(colorCell)colorCell.innerHTML = output;
			if(colorCell)colorCell.style.backgroundColor = iColor;
		}
	}

	this.manualSetColor = function(obj){
		var color = this.validateColor(obj.value);
		document.getElementById("colorBox").style.backgroundColor = color;
		itemColor = color;
	}
	this.manualSetOpacity = function(obj){
		itemOpacity = this.validateOpacity(obj.value);
		var opacityTB = document.getElementById("opacityTextBox");
		if(itemOpacity+'' != obj.value && opacityTB) opacityTB.value = itemOpacity;
	}	
}

function showColor(){
}

function applycurrentColor(itemColor){
	// update focusedBez array
	var chFlag = 0;

	if(focusedBez.length != 0){

		if(itemColor == 'strokeColor' && (focusedBez[5][stroke][stroke_color] != eval(itemColor)
		|| focusedBez[5][stroke][stroke_opacity] != strokeOpacity)){
			focusedBez[5][stroke][stroke_color] = strokeColor;
			focusedBez[5][stroke][stroke_opacity] = strokeOpacity;			
			chFlag = 1;
		}else if (itemColor == 'fillColor' && (focusedBez[5][fill][fill_color] != eval(itemColor)
		|| focusedBez[5][fill][fill_opacity] != fillOpacity)){
			focusedBez[5][fill][fill_color] = fillColor;
			focusedBez[5][fill][fill_opacity] = fillOpacity;
			chFlag = 1;
		}
		if(chFlag){
			saveBezToUndoRedoLog("update");
			sendObject(focusedBez,"update");
		}
	}
	
	if(focusedText.length != 0 && (itemColor == 'strokeColor' && focusedText[5] && focusedText[5][text_color] != eval(itemColor))){
		focusedText[5][text_color] = strokeColor;
		sendObject(focusedText,"update");
		saveTextToUndoRedoLog("update");
	}		
	// end update
}