function windowManager(){
// popup window manager

	var windowList = new Array();
	var windowNameList = new Array();
	var nextEventHandler = -1;

	var dialogWindowList = [['new_document_div',	'document_form_cancel'],
							['u_open_document_div',	'u_open_doc_form_cancel'],
							['u_save_document_div',	'u_savefilecancel'],
							['menu_document_dialog','menu_doc_dialog_cancel'],
                     ['report_document_div', 'reportCancel'],
                     ['insert_image_div',	'closeInsertDiv']];

	var currWindow;
	
	this.addWindow = function (x, y, w, h, id, func, caption, arrayParams, cfunc){
		if(!windowList[id]){
			currWindow = new cWindow();		
			currWindow.createWindow(x,y,w,h,id,func,caption,arrayParams,cfunc);			
			windowList.length ++;
			windowList[id] = currWindow;
			windowNameList.length ++;
			windowNameList[windowNameList.length-1] = id;
			document.body.appendChild(windowList[id].getElement());
			this.closeWindow('', id);
		}else{
			alert("Window with ID='" + id + "' already exists");
		}//if
		//document.body.appendChild(windowList[id].getElement());
	}// method
	
	this.displayWindow = function (parent,id,caption){
		// Node append
		if(parent == '' && windowList[id] != null){			
			windowList[id].getElement().style.visibility = 'visible';

			// insert window constructor !!!
		}//if		
	}// method
	
	this.setNextEventHandler = function(eventHandler){
		nextEventHandler = eventHandler;
	}
	
	this.closeWindow = function (parent, id){
		if(parent == '' && windowList[id] != null && 
			windowList[id].getElement().parentNode != null && windowList[id].getElement().style.visibility != 'hidden'){
			// insert window destructor !!!
			windowList[id].getElement().style.visibility = 'hidden';
			tool_selected = old_tool_selected;
			if(nextEventHandler != -1){
				setHandlersSet(nextEventHandler);
			}
			if(canvas.setCapture) canvas.setCapture();
		}//if
	}// method

	this.closeAllWindows = function (){
		// Node remove
		for(var i = 0; i < windowNameList.length; i++){
			this.closeWindow('', windowNameList[i]);
		}

		for(var i = 0; i < dialogWindowList.length; i++){
			if(document.getElementById(dialogWindowList[i][0]) != null) eval(dialogWindowList[i][1]+'();');
		}
	}// method

	
	this.removeWindow = function (id){
		// delete object		
		windowList[id] = null;		
	}// method
}// class windowManager

function closeWindowId(id){
	if(mgn != null) mgn.closeWindow('', id);	
}

function cWindow(){
	// custom window
	var x = 0, y = 0, w = 100, h = 100, id = 'cWindow', func = '', caption = 'cWindow', cfunc = '';
	var width = 500;
	var height = 500;
	var parentNode = 'body';
	var active = 1;
	var element;
	var bgColor = 'gray';
	var arrayParams;
	
	this.isActive = function(){
		return active;
	}// method
	
	this.getId = function(){
		return id;
	}// method
	
	this.getElement = function(){
		return element;
	}// method
	
	this.createWindow = function (_x, _y, _w, _h, _id, func, _caption, _arrayParams, _cfunc){
		if(_x>=0 && _y>=0 && _x+_w<=width && _y+_h<=height){
			x = (_x >= 0 && _x+_w<=width) ? _x : x;
			y = (_y >= 0 && _y+_h<=height) ? _y : y;
			w = (_x+_w<=width) ? _w : w;
			h = (_y+_h<=height) ? _h : h;
			id = (_id != '') ? _id : id;
			caption = (_caption != '') ? _caption : caption;
			arrayParams = _arrayParams;
			stringFunc = 'arguments[5](\'' + id + '\'';
			if(arrayParams.length != 0){
				stringFunc += ',';
				for(var i=0; i<arrayParams.length; i++){
					stringFunc += ('\'' +arrayParams[i] + '\'');
					if(i != arrayParams.length-1)
						stringFunc += ',';
				}
			}
			stringFunc += ');';
			
			cfunc = _cfunc;
		
			element = document.createElement("div");
			element.setAttribute("id", id);
			element.setAttribute("class", "pDIV");
			element.style.position = 'absolute';
			element.style.left = x+'px';
			element.style.top = y+'px';
			element.style.width = w+'px';
			/*element.style.backgroundColor = bgColor;*/
			element.style.clip = 'rect(0,'+w+'px,'+h+'px,0)';
			element.style.overflow = 'hidden';
			element.style.zIndex = 1000;
			var body = '<table class="systemColor" style="padding-bottom:3;border-width:1;border-color:\'#25820A\';" '
					+ 'bgcolor="white" cellspacing="0" cellpadding="0" border="0" width="99%" align="center"><tr><td align="center">'
					+ eval(stringFunc)			
					+ '</td></tr></table>';
			element.innerHTML = body;						
		}else{
			alert('Incorrect popup size OR coordinates');
			active = 0;
		}//if
	}// method	
	
	this.constructorWindow = function (){
			stringFunc = 'cfunc(';
			if(arrayParams.length != 0){
				for(var i=0; i<arrayParams.length; i++){
					stringFunc += arrayParams[i];
					if(i != arrayParams.length-1)
						stringFunc += ',';
				}
			}
			stringFunc += ')';
			eval(stringFunc);
	}// method	
	
}// class cWindow