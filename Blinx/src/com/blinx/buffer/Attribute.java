package com.blinx.buffer;

public class Attribute {
	private String content = null;
	
	public Attribute(String attribute) {
		this.content = attribute;
	}
	
	public String getAttribute() {
		return content;
	}

	@Override
	public boolean equals(Object obj) {
		boolean res = false;
		if (obj.getClass() == Attribute.class) {
			res = ((Attribute)obj).content.equals(this.content);
		}		
		return res;
	}

	@Override
	public int hashCode() {
		return content.hashCode();
	}

	@Override
	public String toString() {	
		return content;
	}
	
	
	
	
}
