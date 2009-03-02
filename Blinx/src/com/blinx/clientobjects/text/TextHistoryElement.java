package com.blinx.clientobjects.text;

import com.blinx.clientobjects.RegionHistoryElement;

public class TextHistoryElement extends RegionHistoryElement {
	
	private TextInfo textInfo;
	private String textContent;
	
	public TextHistoryElement(Integer id, Integer left, Integer top, Integer width, Integer height, TextInfo textInfo, String textContent) {		
		this.id = id;
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
		this.textInfo = textInfo;
		this.textContent = textContent;
	}
	
	public String toString() {		
		StringBuffer res = new StringBuffer();
		res.append("text");
		res.append(",");
		res.append(left);
		res.append(",");
		res.append(top);
		res.append(",");
		res.append(width);
		res.append(",");
		res.append(height);
		res.append(",");
		res.append(textInfo);
		res.append(",");
		res.append(textContent);
		return res.toString();		
	}
	
	
}
