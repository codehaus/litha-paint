package com.blinx.buffer;

import java.util.HashMap;
import java.util.Map;

/**
 * Stores recieved GET data from browser and appends just recieved pieces of data
 * @author slava
 *
 */
public class ShapeBuffer {
	/**
	 * Map of {id , {attribute, value}}
	 */
	private Map<String, ShapeValue> buffer = new HashMap<String, ShapeValue>();
	
	private int bufferizeShapePrivate (String id, Map<Attribute, Value> shapeValue) {
		int res = 0;
		ShapeValue value = null;
		if (buffer.containsKey(id)) {			
			value = buffer.get(id);
		} else {
			value = new ShapeValue();
		}
		value.addPart(shapeValue);
		res = value.getCompositeNumber();
		buffer.put(id,value);		
		return res;
	}
	
	public int bufferizeShape (String id, Map<String, String> shapeValue) {
		Map<Attribute, Value> map = new HashMap<Attribute, Value>();
		int res = 0;

		for (String attr : shapeValue.keySet()) {
			Attribute a = new Attribute(attr);
			Value v = new Value(shapeValue.get(attr));
			map.put(a,v);
		}
		
		res = bufferizeShapePrivate(id, map);
		
		return res;

	}
	
	private Map<Attribute, Value> throughputShapePrivate(String id, Map<Attribute, Value> shapeValue) {
		Map<Attribute, Value> res = null;
		if (buffer.containsKey(id)) {
			System.out.println("conatains key");
			ShapeValue oldShapeValue = buffer.get(id);
			System.out.println(oldShapeValue.getAccumulator().size());
			oldShapeValue.addPart(shapeValue);
			System.out.println(oldShapeValue.getAccumulator().size());
			res = oldShapeValue.getAccumulator();
			buffer.remove(id);
		} else {
			res = shapeValue;
		}
		return res;
	}
	
	public Map<String, String> throughputShape(String id, Map<String, String> shapeValue) {
		Map<Attribute, Value> map = new HashMap<Attribute, Value>();
		Map<Attribute, Value> map2 = null;
		Map<String, String> res = new HashMap<String, String>();
		
		for (String attr : shapeValue.keySet()) {
			Attribute a = new Attribute(attr);
			Value v = new Value(shapeValue.get(attr));
			map.put(a,v);
		}
		
		map2 = throughputShapePrivate(id, map);
		
		for (Attribute attr : map2.keySet()) {
			String a = attr.getAttribute();
			String v = map2.get(attr).getValue();
			res.put(a,v);
		}
		
		return res;
	}
		
}
