/*
var strokeWidth			= 10;
var strokeDasharray		= '2 1';
var strokeLinecap		= 'round'; //default
var strokeLinejoin		= 'bevel';//default
var strokeMiterlimit	= 4;//default
*/

function LinePicker(){
	var _strokeWidth = 1;
	var _strokeMiterlimit = 4;
	var maxStrokeWidth	= 20;
	var maxDashArray	= 20;
	var strokeLinejoinArray		= ['miter',	'bevel',	'round'];
	var strokeLinecapArray		= ['butt',	'round',	'square'];
	var _strokeDashInternalArray	= new Array();
	var windowID;
	var nextEventHandler;

	this.init = function(id){
		if(focusedBez.length>6){
			_strokeWidth = focusedBez[5][stroke][stroke_width];
			_strokeDasharray = focusedBez[5][stroke][stroke_dasharray]+'';
			_strokeLinecap = focusedBez[5][stroke][stroke_linecap];
			_strokeLinejoin = focusedBez[5][stroke][stroke_linejoin];
			_strokeMiterlimit = focusedBez[5][stroke][stroke_miterlimit];
		}else{
			_strokeWidth = strokeWidth;
			_strokeMiterlimit = strokeMiterlimit;
			_strokeDasharray = strokeDasharray+'';
			_strokeLinejoin = strokeLinejoin;
			_strokeLinecap = strokeLinecap;
		}
		
		if((obj = document.getElementById('sLineWidth')) != null){
			obj.value = _strokeWidth;
		}
		
		this.redrawLine();
		if(_strokeDasharray != ''){
			tempArray = _strokeDasharray.split(' ');
			var j = 0; dotPoint = 1;
			for(var i=0; i<tempArray.length; i++){
				while(tempArray[i]>0){
					if(_strokeDashInternalArray.length < j) _strokeDashInternalArray.length++;
					_strokeDashInternalArray[j] = dotPoint;
					j++; tempArray[i]--;
				}
				dotPoint = 1 - dotPoint;
			}
		}
		this.renderDashArray();
		this.redrawLine();
		
		for(var i=0; i < strokeLinejoinArray.length; i++){
			obj = document.getElementById('corners'+i);			
			if((obj = document.getElementById('corners'+i)) != null && strokeLinejoinArray[i] == _strokeLinejoin){
				obj.checked = true;
				break;
			}
		}
		
		for(var i=0; i < strokeLinecapArray.length; i++){
			obj = document.getElementById('caps'+i);
			if((obj = document.getElementById('caps'+i)) != null && strokeLinecapArray[i] == _strokeLinecap){
				obj.checked = true;
				break;
			}
		}
		//miterLimit
		this.setMiterLimit(_strokeLinejoin);
		
        nextEventHandler = curEventHandler;
        if(document.releaseCapture) document.releaseCapture();
        setHandlersSet(36);
	}
	
	this.getNextEventHandler = function(){
		return nextEventHandler;
	}
	
	this.setMiterDisable= function(status){
		if((obj = document.getElementById('miterLimit'))){
			obj.disabled = status;
		}
	}

	this.releaseLinePicker = function(){	
		for(var i=0; i < strokeLinejoinArray.length; i++){
			if(document.getElementById('corners'+i).checked == true){
				strokeLinejoin = strokeLinejoinArray[i];
				break;				
			}
		}
		
		for(var i=0; i < strokeLinecapArray.length; i++){
			if(document.getElementById('caps'+i).checked == true){
				strokeLinecap = strokeLinecapArray[i];
				break;
			}
		}
		strokeDasharray = this.assembleDashArray();
		strokeWidth = _strokeWidth;
		strokeMiterlimit = _strokeMiterlimit;

		if(focusedBez.length >6 &&(
			strokeWidth		!= focusedBez[5][stroke][stroke_width]	||
			strokeDasharray	!= focusedBez[5][stroke][stroke_dasharray]||
			strokeLinecap	!= focusedBez[5][stroke][stroke_linecap]	||
			strokeLinejoin	!= focusedBez[5][stroke][stroke_linejoin] ||
			strokeMiterlimit	!= focusedBez[5][stroke][stroke_miterlimit])){
				focusedBez[5][stroke][stroke_width]		= strokeWidth;
				focusedBez[5][stroke][stroke_dasharray]	= strokeDasharray;
				focusedBez[5][stroke][stroke_linecap]	= strokeLinecap;
				focusedBez[5][stroke][stroke_linejoin]	= strokeLinejoin;
				focusedBez[5][stroke][stroke_miterlimit]	= strokeMiterlimit;

				saveBezToUndoRedoLog("update");
				sendObject(focusedBez,"update"); 
		}

		closeWindowId(windowID);
		
		setHandlersSet(nextEventHandler);
		if(canvas.setCapture) canvas.setCapture();
	}
	
	this.closeWindow = function(){
		closeWindowId(windowID);
	}
	
	this.assembleDashArray = function(){
		var strokeDasharray = '';
		if(_strokeDashInternalArray.length != 0){
			var i = 0;
			var dotPoint = _strokeDashInternalArray[0];
			var dotLength = 0;
			
			while(i < _strokeDashInternalArray.length){
				if(_strokeDashInternalArray[i] == dotPoint){
					dotLength ++;
				}else{
					if(strokeDasharray != ''){
						strokeDasharray += (' '+dotLength);
					}else{
						strokeDasharray = dotLength;
					}
					dotLength = 1;
					dotPoint = 1-dotPoint;
				}
				i++;
			}
			if(strokeDasharray != ''){
				strokeDasharray += (' '+dotLength);
			}else{
				strokeDasharray = dotLength;
			}			
		}
		return strokeDasharray;
	}

	this.renderDashArray = function(){
		var htmlOut = '';
		if(_strokeDashInternalArray.length != 0){
			htmlOut = '<table border="0" cellspacing="1"><tr>';
			for(var i=0; i<_strokeDashInternalArray.length; i++){
				if(_strokeDashInternalArray[i]) img = "img/pickers/dash_1.gif";
				else img = "img/pickers/dash_0.gif";
				htmlOut += '<td border="1" bgcolor="white" id="dashID_'+i+'" onclick="linePicker.changeDashArray('+i+')" style="border-width:1;border-color:#25820A">'
				+ '<img border="0" src="'+img+'" width="7" height="7" title="'+_strokeDashInternalArray[i]+'" alt="'+_strokeDashInternalArray[i]+'"/>'
				+ '</td>';
			}//for
			htmlOut += '</tr></table>';
		}
		if((obj = document.getElementById('dashArray')) != null){
			obj.innerHTML = htmlOut;
		}		
	}

	this.changeDashArray = function(i){
		if(_strokeDashInternalArray.length > i && i != 0){
			_strokeDashInternalArray[i] = 1 - _strokeDashInternalArray[i];
			this.renderDashArray();
		}
	}

	this.upperDashArray = function(){
		if(_strokeDashInternalArray.length < maxDashArray){
			_strokeDashInternalArray.length++;
			
			if(_strokeDashInternalArray.length == 1) _strokeDashInternalArray[_strokeDashInternalArray.length-1] = 1;
			else _strokeDashInternalArray[_strokeDashInternalArray.length-1] = 0;
			
			this.renderDashArray();
		}
	}
	
	this.lowerDashArray = function(){
		if(_strokeDashInternalArray.length > 0){
			_strokeDashInternalArray.length--;
			this.renderDashArray();
		}
	}	

	this.upperWidth = function(){
		if(_strokeWidth < maxStrokeWidth){
			_strokeWidth++;
			if(document.getElementById('sLineWidth') != null) 			
				document.getElementById('sLineWidth').value = _strokeWidth;
			this.redrawLine();
		}
	}
	
	this.lowerWidth = function(){
		if(_strokeWidth > 1){
			_strokeWidth--;
			if(document.getElementById('sLineWidth') != null) 
				document.getElementById('sLineWidth').value = _strokeWidth;
			this.redrawLine();
		}
	}
	
	this.manualWidth = function(){		
		if((obj=document.getElementById('sLineWidth')) != null){
			var _width = obj.value;
			var reg = /[^0-9]/gi;
			_width = _width.replace(reg, '');
			_width = (_width == '') ? '1' : _width;
			_width = parseInt(_width);
			_width = (_width > 20) ? 20 : _width;
			if(obj.value != _width) obj.value = _width;
			_strokeWidth = obj.value;
			this.redrawLine();
		}		
	}
	
	this.manualMiter = function(obj){		
		var _miter = obj.value;
		if (_miter.length == 0){
			_miter = '1';
		}else if(_miter.length > 2){
			_miter = _miter.substring(0,2);
		}
		
		var reg	 = /[^0-9]/gi;
		_miter = parseInt(_miter.replace(reg, '4'));
		
		_miter = (_miter > 99) ? 99 : _miter;
		_miter = (_miter < 1) ? 1 : _miter;
		
		obj.value = _miter;
		_strokeMiterlimit = _miter;
		return true;
	}
	
	this.setMiterLimit = function(value){
		if(value != 'miter'){
			this.setMiterDisable(true);
		}else{
			this.setMiterDisable(false);
		}
		if((obj = document.getElementById('miterLimit')) != null){
			obj.value = _strokeMiterlimit;
		}
	}
	
	this.redrawLine = function(){		
		if((obj = document.getElementById('gLineWidth')) != null){
			obj.style.borderWidth = '0px 0px '+_strokeWidth+' 0px';
//			setElementParam(obj,'borderWidth','border-bottom-width',_strokeWidth, '0px 0px '+_strokeWidth+' 0px');
		}
	}

	this.getLinePicker = function(id){
	
	var baseOffsetStyle = '';
	if(browser.indexOf('Firefox') != -1) baseOffsetStyle = 'position:relative;top:-10;left:3;height:15';
	
	windowID = id;
	var htmlOut = '<table class="winPickerBG" border="0" cellpadding="0" cellspacing="0" width="100%">'
				+ '<tr>'
			+ '<td colspan="2" width="70%"><fieldset style="offsetHeight:17px;margin:3"><legend>Stroke width</legend>'
			+ '<table align="center" border="0" style="height:20"><tr><td align="center" width="70%" valign="middle">'
			+ '<table id="gLineWidth" width="80%" border="1" style="border-top-width:0;border-left-width:0;border-right-width:0;border-color:black;border-bottom-width:'+_strokeWidth+'px;">'
			+ '<tr><td height="0"></td></tr></table>'
			+ '</td><td align="center" style="height:20" valign="middle">'
			+ '<table border="0" cellpadding="0" cellspacing="0" height="15"><tr>'
			+ '<td align="center" valign="middle" rowspan="2" width="55%"><input type="text" id="sLineWidth" size="2" maxlength="2" onkeyup="linePicker.manualWidth()" value="'+_strokeWidth+'">&nbsp;</td><td><img border="0" style="margin-bottom:1" alt="+" src="img/pickers/plus.gif" value="+" onclick="linePicker.upperWidth()"></td></tr>'
			+ '<tr><td ><img style="margin-top:1" alt="-" border="0" src="img/pickers/minus.gif" type="button" value="-" onclick="linePicker.lowerWidth()"></td></tr></table>'
			+ '</td></tr></table>'				
			+ '</fieldset></td>'
			+ '<td><table cellpadding="0" cellspacing="3" width="100%" border="0"><tr>'
			+ '<td id="popupHeaderClose" valign="top" style="padding:5" align="right" onClick="linePicker.closeWindow()">'
			+ '<img src="./img/pickers/close.gif"></td></tr>'
			+ '</tr><td id="popupApply" align="right" valign="bottom">'
			+ '<input style="width:66px;height:19;border-width:0;background-image:url(img/pickers/apply.gif)" type="button" id="insertColor" name="insert" value="" style="margin-top:1px" onclick="linePicker.releaseLinePicker()">'
			+ '</td></tr></table></td></tr>'
			
				+ '<tr><td colspan="3"><fieldset style="margin:3"><legend>Dashed array</legend>'
				+ '<table border="0" cellcpacing="0" cellpadding="0">'
				+ '<tr><td>'
				+ '<table border="0" cellpadding="0" cellspacing="2" ><tr>'
				+ '<td><img border="0" style="padding:1" alt="+" src="img/pickers/plus.gif" value="+" onclick="linePicker.upperDashArray()"></td></tr>'
				+ '<tr><td ><img style="padding:1" alt="-" border="0" src="img/pickers/minus.gif" type="button" value="-" onclick="linePicker.lowerDashArray()"></td></tr></table></td><td id="dashArray"></td></tr></table>'
				+ '</fieldset></td>'
				+ '</tr>'
				+ '<tr valign="top" ><td colspan="3"><table border="0" width="100%"><tr><td width="33%">'
				+ '<fieldset height="60" style="height:60"><legend>Corners</legend>';

	var selected = '';
	for(var i=0; i < strokeLinejoinArray.length; i++){
		selected = '';
		htmlOut += '<input id="corners'+i+'" name="corners" '+selected+' type="radio" value="'+strokeLinejoinArray[i]+'" onclick="linePicker.setMiterLimit(\''+strokeLinejoinArray[i]+'\')"><img src="./img/pickers/linejoin_'+strokeLinejoinArray[i]+'.gif" alt="'+strokeLinejoinArray[i]+'" title="'+strokeLinejoinArray[i]+'" width="36" height="18">';
		if(i != strokeLinejoinArray.length-1) htmlOut += '<br>';
		else if(browser.indexOf('Firefox') != -1) htmlOut += '<br>';		
	}
	
	htmlOut += '<br></fieldset></td>'
			+ '<td valign="top" width="33%"><fieldset height="60" style="height:60"><legend>Line caps</legend>';

	for(var i=0; i < strokeLinecapArray.length; i++){
		selected = '';
		htmlOut += '<input id="caps'+i+'" name="caps" '+selected+' type="radio" value="'+strokeLinecapArray[i]+'"><img src="./img/pickers/linecap_'+strokeLinecapArray[i]+'.gif" alt="'+strokeLinecapArray[i]+'" title="'+strokeLinecapArray[i]+'"width="34" height="14">';
		if(i != strokeLinecapArray.length-1) htmlOut += '<br>';
		else if(browser.indexOf('Firefox') != -1) htmlOut += '<br>';
	}

	htmlOut += '<br></fieldset></td>'
				+ '<td valign="top"><fieldset style="height:60;margin:0"><legend>Miter level</legend>'
				+ '<input align="center" valign="middle" type="text" id="miterLimit" onkeyup="linePicker.manualMiter(this)" size="2" maxlength="2" value="'+_strokeMiterlimit+'" ></fieldset>'
				+ '</td></tr></table>'
			+ '</td></tr></table>';

		return htmlOut;
	}
}

function showLinePicker(id){
	//
}

function releaseLPicker(evt){
	var keyCode = evt?evt.keyCode:event.keyCode;
	if(keyCode == 13){
		linePicker.releaseLinePicker();
		return false;
	}
	return true;	
}