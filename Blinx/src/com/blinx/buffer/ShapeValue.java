package com.blinx.buffer;

import java.util.HashMap;
import java.util.Map;

public class ShapeValue {
	
	private Map<Attribute, Value> accumulator = new HashMap<Attribute, Value>();
	
	private int compositeNumber = 0;
	
	/**
	 * Adds part to accumulator
	 * @param part
	 */
	public void addPart(Map<Attribute, Value> part) {		
		for (Attribute a : part.keySet()) {			
			if (accumulator.containsKey(a)) {
				String val1 = accumulator.get(a).getValue();
				if (!"command_id".equals(a.getAttribute()) && !"type".equals(a.getAttribute())) {
				  val1 += part.get(a).getValue();
				} else {					
				  val1 = part.get(a).getValue();					
				}
				Value val2 = new Value(val1);				
				accumulator.put(a,val2);				
			} else {
				accumulator.put(a,part.get(a));
			}
		}
		if (part.keySet().size() > 0) {
			compositeNumber++;
		}
	}
	
	public Map<Attribute, Value> getAccumulator() {
		return accumulator;
	}
	
	public int getCompositeNumber() {
		return compositeNumber;
	}
}
