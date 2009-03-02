package com.paintly.renderer.bridge;

import com.paintly.renderer.shapes.Shape;
import com.paintly.renderer.shapes.ImageTransformation;

import java.util.Map;

/**
 * User: VyacheslavE
 * Date: 25.08.2006
 * Time: 14:50:05
 */
public class ImageTransformationBridge implements ShapeBridge{
    public Shape getShape(Map attributes) {
        ImageTransformation res = new ImageTransformation(new Integer((String)attributes.get("id")), new Integer((String)attributes.get("x")), new Integer((String)attributes.get("y")), new Integer((String)attributes.get("width")), new Integer((String)attributes.get("height")));
        return res;
    }
}
