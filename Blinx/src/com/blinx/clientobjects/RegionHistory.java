package com.blinx.clientobjects;

import java.util.HashMap;

public class RegionHistory {
	
	private HashMap<Integer,RegionHistoryElement> content = new HashMap<Integer,RegionHistoryElement>();
	
	public void put(Integer id, RegionHistoryElement element) {
		content.put(id,element);
	}
	
	public RegionHistoryElement get(Integer id) {
		return content.get(id);
	}
	
	public void remove(Integer id) {
		content.remove(id);
	}
	
	public String toString() {
		StringBuffer res = new StringBuffer();
		for (RegionHistoryElement e : content.values()) {
			res.append("!region!");
			res.append(e.toString());
		}
		return res.toString();
	}
}
