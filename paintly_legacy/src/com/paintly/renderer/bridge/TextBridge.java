package com.paintly.renderer.bridge;

import java.util.Map;

import org.apache.log4j.Logger;

import com.paintly.renderer.shapes.Shape;
import com.paintly.renderer.shapes.Text;

/**
 * Created by IntelliJ IDEA.
 * User: Администратор
 * Date: 22.05.2006
 * Time: 15:19:24
 * To change this template use File | Settings | File Templates.
 */
public class TextBridge implements ShapeBridge{
      static Logger log = Logger.getLogger(TextBridge.class);

    public Shape getShape(Map attributes) {
        Text text = null;
        try {
            String points = (String) attributes.get("points");
            String strokeColor = (String) attributes.get("stroke");
            String textStr = (String) attributes.get("text");
            String id = (String) attributes.get("id");
            String left_top = (String)attributes.get("left_top");
            String width_height = (String)attributes.get("width_height");
            String size = (String)attributes.get("size");
            
            String font = (String)attributes.get("font");
            String weight = (String)attributes.get("weight");
            String text_style = (String)attributes.get("text-style");
            String text_decoration =(String)attributes.get("text-decoration");
            text = new Text(points,strokeColor,left_top, width_height, textStr,size, id,font,weight,text_style,text_decoration);
        } catch (Exception e) {
            log.error("Some parameters in Text construction doesn't exists", e);
        }
        return text;
    }
}
