package com.paintly.renderer.bridge;

import com.paintly.renderer.shapes.Shape;
import com.paintly.renderer.shapes.Bezier;

import java.util.Map;

import org.apache.log4j.Logger;

/**
 * Created by IntelliJ IDEA.
 * User: Slava
 * Date: 11.05.2006
 * Time: 15:00:12
 */
public class BezierBridge implements ShapeBridge{
    private static Logger log = Logger.getLogger(BezierBridge.class);
    
    public Shape getShape(Map attributes) {
        Bezier bezier = null;
        try {
            String points = (String) attributes.get("points");
            String strokeColor = (String) attributes.get("stroke");
            String strokeWidth = (String) attributes.get("stroke-width");
            String strokeOpacity = (String)attributes.get("stroke-opacity");
            String strokeDasharray = (String)attributes.get("stroke-dasharray");
            String strokeLinecap = (String)attributes.get("stroke-linecap");
            String strokeLinejoin = (String)attributes.get("stroke-linejoin");
            String strokeMiterlimit = (String)attributes.get("stroke-miterlimit");
            
            String fillColor = (String) attributes.get("fill");
            String fillOpacity = (String)attributes.get("fill-opacity");
            String fillRule = (String)attributes.get("fill-rule");
            
            String id = (String) attributes.get("id");
            String left = (String) attributes.get("left");
            String top = (String) attributes.get("top");
            String width = (String) attributes.get("width");
            String height = (String) attributes.get("height");
            
                        
            bezier = new Bezier(points, strokeColor, fillColor, id,left,top,width,height, Double.parseDouble(fillOpacity), Integer.parseInt(strokeWidth), Double.parseDouble(strokeOpacity), strokeDasharray, strokeLinecap, strokeLinejoin, Integer.parseInt(strokeMiterlimit), fillRule);
        } catch (Exception e) {
            log.error("Some parameters in Bezier construction doesn't exists", e);
        }
        return bezier;

    }
}
