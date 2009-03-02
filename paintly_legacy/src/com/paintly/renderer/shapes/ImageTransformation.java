package com.paintly.renderer.shapes;

import org.w3c.dom.Element;
import org.w3c.dom.Document;

import java.util.List;
import java.awt.Rectangle;


/**
 * User: VyacheslavE
 * Date: 25.08.2006
 * Time: 14:42:29
 * This is a holder of image related data passed by client. Id and transformation matrix are only data that client knows about image.<br>
 * Image data, type and size are stored on the server side and is described by Image class instead.
 */
public class ImageTransformation implements Shape{

    private Integer x, y, width, height;
    private Integer id = null;

    public ImageTransformation( Integer id, Integer x, Integer y, Integer width, Integer height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
    }

    public Element materialize(Document document)
    {
        throw new IllegalStateException("use Image.materialize() instead");
    }

    public List materializeText(Document document)
    {
        throw new IllegalStateException("use Image.materializeText() instead");
    }

    public java.awt.Rectangle getOutscribingRect() {
        return new Rectangle(x.intValue(),y.intValue(),width.intValue(),height.intValue());
    }

    public Integer getID() {
        return id;
    }

    public Integer getX() {
        return x;
    }

    public Integer getY() {
        return y;
    }

    public Integer getWidth() {
        return width;
    }

    public Integer getHeight() {
        return height;
    }
    
}