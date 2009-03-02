function processColorMouseClick(evt){
	//if (evt?(evt.button==65535 || evt.button == 0):event.button==1){		
		var x1=evt?evt.clientX+f_scrollLeft():event.clientX+f_scrollLeft();
		var y1=evt?evt.clientY+f_scrollTop():event.clientY+f_scrollTop();
		
		old_tool_selected = tool_selected;
		tool_selected = 2;                
		selectRegion_imp(x1,y1);
		tool_selected = old_tool_selected;
		
		if(tool_selected == 10){
			itemColor = 'strokeColor';
		}else if(tool_selected == 11){
			itemColor = 'fillColor';
		}
		applycurrentColor(itemColor);
		setHandlersSet(37);
	//}
}

function releaseCPicker(evt){
	var keyCode = evt?evt.keyCode:event.keyCode;
	if(keyCode == 13){
		colorPicker.releaseColorPicker();
		return false;
	}
	return true;	
}

