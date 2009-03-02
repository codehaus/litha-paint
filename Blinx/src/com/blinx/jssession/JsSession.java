package com.blinx.jssession;

import java.util.HashMap;
import java.util.Map;

public class JsSession {
	private Map<Object,Object> container = new HashMap<Object, Object>();
	
	JsSession() {
		super();
	}
	
	public Object getAttribute(Object attributeName) {
		return container.get(attributeName);
	}
	
	public void setAttribute(Object attributeName, Object attribute) {
		container.put(attributeName, attribute);
	}
	
	public void removeAttribute(Object attributeName) {
		container.remove(attributeName);
	}
}
