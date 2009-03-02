package com.blinx.clientobjects.bezier;

import java.util.List;

import com.blinx.clientobjects.RegionHistoryElement;

public class BezierHistoryElement extends RegionHistoryElement {
	private BezierInfo info;
	private List<BezierChunk> definition;
		
	public BezierHistoryElement(Integer id, Integer left, Integer top, Integer width, Integer height, BezierInfo info, List<BezierChunk> definition) {
		this.id = id;
		this.left = left;
		this.top = top;		
		this.width = width;
		this.height = height;
		this.info = info;
		this.definition = definition;
	}

	public String toString() {
		StringBuffer res = new StringBuffer();
		res.append("bezier");
		res.append(",");
		res.append(left);
		res.append(",");
		res.append(top);
		res.append(",");
		res.append(width);
		res.append(",");
		res.append(height);
		res.append(",");
		res.append(info.toString());
		for (BezierChunk chunk : definition) {
			res.append(",");
			res.append(chunk.toString());
		}
		
		return res.toString();
	}

	public List<BezierChunk> getDefinition() {
		return definition;
	}
	
	
	
}
