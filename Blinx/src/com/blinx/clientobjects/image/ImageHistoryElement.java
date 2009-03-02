package com.blinx.clientobjects.image;

import com.blinx.clientobjects.RegionHistoryElement;

public class ImageHistoryElement extends RegionHistoryElement {

	public ImageHistoryElement(Integer id, Integer left, Integer top, Integer width, Integer height) {
		this.id = id;
		this.left = left;
		this.top = top;		
		this.width = width;
		this.height = height;
	}
	
	public String toString() {
		StringBuffer res = new StringBuffer();		
		res.append("image");
		res.append(",");
		res.append(left);
		res.append(",");
		res.append(top);
		res.append(",");
		res.append(width);
		res.append(",");
		res.append(height);
		res.append(",");
		res.append(id);
		return res.toString();
	}
}
