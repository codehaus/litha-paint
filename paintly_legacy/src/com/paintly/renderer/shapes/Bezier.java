package com.paintly.renderer.shapes;

import org.w3c.dom.Element;
import org.w3c.dom.Document;

import com.paintly.renderer.ConstantsBulk;

import java.awt.Rectangle;
import java.util.*;

/**
 * Created by IntelliJ IDEA.
 * User: Slava
 * Date: 11.05.2006
 * Time: 15:03:30

 */
public class Bezier implements Shape{    
    private String pointsStr = null;
    private String strokeColor = "#000000";
    private String fillColor = "none";
    private double strokeOpacity = 0;
    private double fillOpacity = 0;

    private Integer id = null;
    private int left,top,width,height;
    
    private String strokeDasharray = "";
    private String strokeLinecap = "";
    private String strokeLinejoin = "";
    private int strokeMiterlimit = 4;
    private String fillRule = "";
    private int strokeWidth = 0;
    
    /**
     * The constructor of the Bezier shape
     * @param points
     * @param strokeColor
     * @param fillColor
     * @param id
     * @param left
     * @param top
     * @param width
     * @param height
     * @param fillOpacity
     * @param strokeWidth
     * @param strokeOpacity
     * @param strokeDasharray
     * @param strokeLinecap
     * @param strokeLinejoin
     * @param strokeMiterlimit
     * @param fillRule
     */
    public Bezier(String points,String strokeColor, String fillColor, String id, String left, String top, String width, String height, double fillOpacity, int strokeWidth, double strokeOpacity, String strokeDasharray, String strokeLinecap, String strokeLinejoin, int strokeMiterlimit, String fillRule){
        this.pointsStr = points;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.id = Integer.valueOf(id);
        this.left = Integer.valueOf(left).intValue();
        this.top = Integer.valueOf(top).intValue();
        this.width = Integer.valueOf(width).intValue();
        this.height = Integer.valueOf(height).intValue();
        this.strokeOpacity = strokeOpacity;
        this.fillOpacity = fillOpacity;
        
        this.strokeDasharray = strokeDasharray;
        this.strokeLinecap = strokeLinecap;
        this.strokeLinejoin = strokeLinejoin;
        this.strokeMiterlimit = strokeMiterlimit;
        this.fillRule = fillRule;
        this.strokeWidth = strokeWidth;
        this.strokeWidth = strokeWidth;
        fixBoundaries();
    }
    
    /**
     * Constructor of the bezier shape from the string
     * @param str
     */
    public Bezier (String str){
        int startIdx = -1;
        int endIdx = -1;
        
        startIdx = str.indexOf("id=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+4);
            if(endIdx!=-1){
                this.id = Integer.valueOf(str.substring(startIdx+4,endIdx));
            }
        }
        
        startIdx = str.indexOf(" d=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+4);
            if(endIdx!=-1){
                this.pointsStr = str.substring(startIdx+4,endIdx);
            }
        }
        
        startIdx = str.indexOf("stroke=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+8);
            if(endIdx!=-1){
                this.strokeColor = str.substring(startIdx+8,endIdx);               
            }
        }
        
        startIdx = str.indexOf("fill=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.fillColor = str.substring(startIdx+6,endIdx);
            }
        }

        startIdx = str.indexOf("left=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.left = Integer.valueOf(str.substring(startIdx+6,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf("top=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+5);
            if(endIdx!=-1){
                this.top = Integer.valueOf(str.substring(startIdx+5,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf("width=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+7);
            if(endIdx!=-1){
                this.width = Integer.valueOf(str.substring(startIdx+7,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf("height=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+8);
            if(endIdx!=-1){
                this.height = Integer.valueOf(str.substring(startIdx+8,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf("stroke-opacity=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+16);
            if(endIdx!=-1){
                this.strokeOpacity = Double.valueOf(str.substring(startIdx+16,endIdx)).doubleValue();
            }            
        }

        startIdx = str.indexOf("fill-opacity=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+14);
            if(endIdx!=-1){
                this.fillOpacity = Double.valueOf(str.substring(startIdx+14,endIdx)).doubleValue();                
            }
        }        
        
        startIdx = str.indexOf("stroke-dasharray=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+18);
            if(endIdx!=-1){
                this.strokeDasharray = str.substring(startIdx+18,endIdx);
            }
        }
        
        startIdx = str.indexOf("stroke-linecap=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+16);
            if(endIdx!=-1){
                this.strokeLinecap = str.substring(startIdx+16,endIdx);
            }
        }
        
        startIdx = str.indexOf("stroke-linejoin=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+17);
            if(endIdx!=-1){
                this.strokeLinejoin = str.substring(startIdx+17,endIdx);
            }
        }
        
        startIdx = str.indexOf("stroke-miterlimit=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+19);
            if(endIdx!=-1){
                this.strokeMiterlimit = Integer.parseInt(str.substring(startIdx+19,endIdx));
            }
        }

        startIdx = str.indexOf("fill-rule=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+11);
            if(endIdx!=-1){
                this.fillRule = str.substring(startIdx+11,endIdx);
            }
        }

        startIdx = str.indexOf("stroke-width=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+14);
            if(endIdx!=-1){
                this.strokeWidth = Integer.parseInt(str.substring(startIdx+14,endIdx));
            }
        }
        

    }

    private void fixBoundaries() {
        if(width<0){
            left = left+width;width=-width;
        }
        if(height<0){
            top = top+height;height=-height;
        }
    }

    public Element materialize(Document document) {
        Element path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "d", pointsStr);
        if(!ConstantsBulk.ALPHA.equals(fillColor))path.setAttributeNS(null, "fill", fillColor);
        else path.setAttributeNS(null, "fill", "none");
        if(!ConstantsBulk.ALPHA.equals(strokeColor))path.setAttributeNS(null, "style", "stroke:"+strokeColor);
        else path.setAttributeNS(null, "style", "stroke:"+"none");
        
        path.setAttributeNS(null, "stroke-opacity", String.valueOf(strokeOpacity));
        path.setAttributeNS(null, "fill-opacity", String.valueOf(fillOpacity));        
        
        path.setAttributeNS(null,"stroke-width",String.valueOf(strokeWidth));
        
        if(!"".equals(strokeDasharray)) path.setAttributeNS(null,"stroke-dasharray",strokeDasharray);
        if(!"".equals(strokeLinecap)) path.setAttributeNS(null,"stroke-linecap",strokeLinecap);
        if(!"".equals(strokeLinejoin)) path.setAttributeNS(null,"stroke-linejoin",strokeLinejoin);
        path.setAttributeNS(null,"stroke-miterlimit",String.valueOf(strokeMiterlimit));
        if(!"".equals(this.fillRule)) path.setAttributeNS(null,"fill-rule",this.fillRule);
               
        return path;

    }

    public java.awt.Rectangle getOutscribingRect() {
        Rectangle res = new Rectangle(left-strokeWidth,top-strokeWidth,width+2*strokeWidth,height+2*strokeWidth);
        return res;
    }

    public Integer getID() {
        return id;
    }

    public java.util.List materializeText(Document doc){
        return new ArrayList();
    }
    
    public String toString(){
        String res = "";
        res = "<bezier id=\""+id.toString()+"\" d=\""+pointsStr+"\" stroke=\""+strokeColor+"\" fill=\""+fillColor+"\" left=\""+left+"\" top=\""+top+"\" width=\""+width+"\" height=\""+height+"\" stroke-opacity=\""+strokeOpacity+"\" fill-opacity=\""+fillOpacity+"\" stroke-dasharray=\""+strokeDasharray+"\" stroke-linecap=\""+strokeLinecap+"\" stroke-linejoin=\""+strokeLinejoin+"\" stroke-miterlimit=\""+strokeMiterlimit+"\" fill-rule=\""+fillRule+"\" stroke-width=\""+strokeWidth+"\"/>";
        return res;
    }
    
}
