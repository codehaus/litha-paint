package com.blinx.renderer.bridge;

import java.util.Map;

import com.blinx.renderer.shapes.Shape;

/**
 * This interface should be implemeted by the all bridge shapes that needs to be part of 
 * transport from HashMap elements to Shapes
 * @author AlexanderP
 * @version 
 */

public interface ShapeBridge{
	
	/**
	 * Factory method for Shape
	 * @param attributes
	 * @return shape
	 */
	public Shape getShape(Map<String, String> attributes);	
	
}