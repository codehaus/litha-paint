package com.blinx.renderer;

import com.blinx.ConstantsBulk;

/**
 * Holder of color value
 * @author slava
 *
 */
public class Color {
	private String color = ConstantsBulk.ALPHA; //#DDFFCC for instance
	
	public Color(String color) {
		this.color=color;
	}
	
	public String toString() {
		return color;
	}
	
	public int hashCode() {
		return color.hashCode();		
	}
	
	public boolean equals(Object o) {
		boolean res = false;
		if (o instanceof String) {
			if (o.equals(color)) {
				res = true;
			}
		} else if (o instanceof Color) {
			if (o.toString().equals(color)) {
				res = true;
			}
		}
		return res;
	}

}
