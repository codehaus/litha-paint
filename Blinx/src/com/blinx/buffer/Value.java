package com.blinx.buffer;

public class Value {
	private String content = null;
	
	public Value(String value) {
		this.content = value;
	}
	
	public String getValue() {
		return content;
	}

	@Override
	public String toString() {
		return content;
	}
	
	
}
