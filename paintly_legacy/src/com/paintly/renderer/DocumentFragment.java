package com.paintly.renderer;

import java.awt.Rectangle;

import com.paintly.renderer.shapes.Shape;

/**
 * This is a document fragment. 
 * The graphic document consists of document fragments which resides in HashMap in DocumentHolder.
 * @author VyacheslavE
 * @version Apr 14, 2006
 */
public class DocumentFragment {
	
    /**
     * DOM element which represents a shape
     */
    private Shape element = null;
    
    /**
     * A picture below the shape 
     */
    private String pngSubstrate = null;
    
    /**
     * Rectangular area the shape inscribed in
     */
    private Rectangle rect = null;
    
    /**
     * Rectangular area the shape insribed in amd alligned by scraps
     */
    private Rectangle scaledRect = null;

    /**
     * Shows if element deleted or not. Applied only for images. Other elements should be deleted from the DocumentHolder phisically.
     */
    private boolean deleted = false;
    
    /**
     * @param element shape     
     */
    //TODO: take in hand stroke-width when calculating a outscribing rectangular
    public DocumentFragment(Shape element) {               
        this.element = element;        
        this.rect = Utils.rectAbs(element.getOutscribingRect());
        int x,y;
        x = rect.x/ConstantsBulk.SCRAPWIDTH*ConstantsBulk.SCRAPWIDTH;
        y = rect.y/ConstantsBulk.SCRAPHEIGHT*ConstantsBulk.SCRAPHEIGHT;
        this.scaledRect = new Rectangle(x,y,(rect.x+rect.width)/ConstantsBulk.SCRAPWIDTH*ConstantsBulk.SCRAPWIDTH+ConstantsBulk.SCRAPWIDTH-x,(rect.y+rect.height)/ConstantsBulk.SCRAPHEIGHT*ConstantsBulk.SCRAPHEIGHT+ConstantsBulk.SCRAPHEIGHT-y);
    }

    
    /**
     * getter
     * @return shape instance
     */
    public Shape getElement() {
        return element;
    }

    /**
     * setter
     * @param element
     */
    public void setElement(Shape element) {
        this.element = element;
    }

    /**
     * getter
     * @return String
     */
    public String getPngSubstrate() {
        return pngSubstrate;
    }

    /**
     * setter
     * @param pngSubstrate
     */
    public void setPngSubstrate(String pngSubstrate) {
        this.pngSubstrate = pngSubstrate;
    }

    /**
     * getter
     * @return rectangle
     */
    public Rectangle getRect() {
        return scaledRect;
    }
    
    public String toString(){        
        String res=deleted==false?element.toString():"";        
        return res;
    }


    /**
     * setter
     * @param b
     */
    public void setDeleted(boolean b) {
        this.deleted = b;
    }

    /**
     * is
     * @return boolean
     */
    public boolean isDeleted() {
        return deleted;
    }

}
