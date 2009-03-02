package com.paintly.renderer.bridge;

import java.util.Map;

import com.paintly.renderer.shapes.Shape;

/**
 * This interface should be implemeted by the all bridge shapes that needs to be part of 
 * transport from HashMap elements to Shapes
 * @author AlexanderP
 * @version 
 */

public interface ShapeBridge{
	
	Shape getShape(Map attributes);	
	
}