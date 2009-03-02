package com.blinx.renderer.bridge;

import org.apache.log4j.Logger;

import com.blinx.renderer.shapes.ShapeName;

/**
 * Creates instance of a ShapeBridge depending of shape type 
 * @author slava
 *
 */
public class ShapeBridgeFactory {
	private static Logger log = Logger.getLogger(ShapeBridgeFactory.class);
	
	public static ShapeBridge createBridge(ShapeName shapeName) {
		ShapeBridge res = null;
		if (shapeName == ShapeName.bezier) {		
			res = new BezierBridge();
		} else if (shapeName == ShapeName.image) {		
			res = new ImageTransformationBridge();
		} else if (shapeName == ShapeName.text) {		
			res = new TextBridge();			
		}
		return res;
	}
}
