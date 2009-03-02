package com.blinx.renderer.shapes;

import org.w3c.dom.Element;
import org.w3c.dom.Document;

import com.blinx.clientobjects.RegionHistoryElement;
import com.blinx.clientobjects.bezier.BezierChunk;
import com.blinx.clientobjects.bezier.BezierHistoryElement;
import com.blinx.clientobjects.factories.BezierHistoryElementFactory;
import com.blinx.ConstantsBulk;

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
    private String nastyPointsStr = null;
    private String strokeColor = "#000000";
    private String fillColor = "none";
    private double strokeOpacity = 0;
    private double fillOpacity = 0;

    private Integer id = null;
    private int left,top,width,height;
    
    private String strokeDasharray = "";
    private String strokeLinecap = "";
    private String strokeLinejoin = "";
    private double strokeMiterlimit = 4;
    private String fillRule = "";
    private int strokeWidth = 0;
    
    private BezierHistoryElement bezierHistoryElement = null;
    
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
    public Bezier(String points,String strokeColor, String fillColor, String id, String left, String top, String width, String height, double fillOpacity, int strokeWidth, double strokeOpacity, String strokeDasharray, String strokeLinecap, String strokeLinejoin, double strokeMiterlimit, String fillRule){
        this.nastyPointsStr = points;
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
        bezierHistoryElement = BezierHistoryElementFactory.createBezierHistoryElement(this);
        this.pointsStr = generateD();
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
                this.nastyPointsStr = str.substring(startIdx+4,endIdx);
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
                this.strokeMiterlimit = Double.parseDouble(str.substring(startIdx+19,endIdx));
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
                        
        bezierHistoryElement = BezierHistoryElementFactory.createBezierHistoryElement(this);
        
        this.pointsStr = generateD();

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
        if(!ConstantsBulk.ALPHA.equals(fillColor)) {
        	path.setAttributeNS(null, "fill", fillColor);        	
        }
        else {
        	path.setAttributeNS(null, "fill", "none");        	
        }
        if(!ConstantsBulk.ALPHA.equals(strokeColor)) {
        	path.setAttributeNS(null, "style", "stroke:"+strokeColor);        	
        }
        else {
        	path.setAttributeNS(null, "style", "stroke:"+"none");        	
        }
        
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

    public java.util.List materializeText(Document doc){
        return new ArrayList();
    }
    
    
    
    public String getFillColor() {
		return fillColor;
	}


	public double getFillOpacity() {
		return fillOpacity;
	}


	public String getFillRule() {
		return fillRule;
	}


	public int getHeight() {
		return height;
	}


	public Integer getID() {
		return id;
	}


	public int getLeft() {
		return left;
	}


	public String getNastyPointsStr() {
		return nastyPointsStr;
	}


	public String getStrokeColor() {
		return strokeColor;
	}


	public String getStrokeDasharray() {
		return strokeDasharray;
	}


	public String getStrokeLinecap() {
		return strokeLinecap;
	}


	public String getStrokeLinejoin() {
		return strokeLinejoin;
	}


	public double getStrokeMiterlimit() {
		return strokeMiterlimit;
	}


	public double getStrokeOpacity() {
		return strokeOpacity;
	}


	public int getStrokeWidth() {
		return strokeWidth;
	}


	public int getTop() {
		return top;
	}


	public int getWidth() {
		return width;
	}


	public void setFillColor(String fillColor) {
		this.fillColor = fillColor;
	}


	public void setFillOpacity(double fillOpacity) {
		this.fillOpacity = fillOpacity;
	}


	public void setFillRule(String fillRule) {
		this.fillRule = fillRule;
	}


	public void setHeight(int height) {
		this.height = height;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public void setLeft(int left) {
		this.left = left;
	}


	public void setNastyPointsStr(String nastyPointsStr) {
		this.nastyPointsStr = nastyPointsStr;
	}


	public void setStrokeColor(String strokeColor) {
		this.strokeColor = strokeColor;
	}


	public void setStrokeDasharray(String strokeDasharray) {
		this.strokeDasharray = strokeDasharray;
	}


	public void setStrokeLinecap(String strokeLinecap) {
		this.strokeLinecap = strokeLinecap;
	}


	public void setStrokeLinejoin(String strokeLinejoin) {
		this.strokeLinejoin = strokeLinejoin;
	}


	public void setStrokeMiterlimit(int strokeMiterlimit) {
		this.strokeMiterlimit = strokeMiterlimit;
	}


	public void setStrokeOpacity(double strokeOpacity) {
		this.strokeOpacity = strokeOpacity;
	}


	public void setStrokeWidth(int strokeWidth) {
		this.strokeWidth = strokeWidth;
	}


	public void setTop(int top) {
		this.top = top;
	}


	public void setWidth(int width) {
		this.width = width;
	}


	public String toString(){
        String res = "";
        res = "<bezier id=\""+id.toString()+"\" d=\""+nastyPointsStr+"\" stroke=\""+strokeColor+"\" fill=\""+fillColor+"\" left=\""+left+"\" top=\""+top+"\" width=\""+width+"\" height=\""+height+"\" stroke-opacity=\""+strokeOpacity+"\" fill-opacity=\""+fillOpacity+"\" stroke-dasharray=\""+strokeDasharray+"\" stroke-linecap=\""+strokeLinecap+"\" stroke-linejoin=\""+strokeLinejoin+"\" stroke-miterlimit=\""+strokeMiterlimit+"\" fill-rule=\""+fillRule+"\" stroke-width=\""+strokeWidth+"\"/>";
        return res;
    }
    
    
    public RegionHistoryElement toRegionHistoryElement() {
    	return bezierHistoryElement;    	
    }
    
	private String generateD() {
		BezierChunk[] chunks = bezierHistoryElement.getDefinition().toArray(new BezierChunk[1]);		
		String res = "M"+String.valueOf(chunks[0].getControlPoint().x)+","+String.valueOf(chunks[0].getControlPoint().y);
		for (int i=1; i< chunks.length; i++) {
			res += " ";
			res += "C"+String.valueOf(chunks[i-1].getFirstCompanion().x)+","+String.valueOf(chunks[i-1].getFirstCompanion().y)+" "+String.valueOf(chunks[i].getSecondCompanion().x)+","+String.valueOf(chunks[i].getSecondCompanion().y)+" "+String.valueOf(chunks[i].getControlPoint().x)+","+String.valueOf(chunks[i].getControlPoint().y);
		}
		if (chunks.length>0 && "1".equals(chunks[chunks.length-1].terminalPropertyToString())) {
			res += " C"+String.valueOf(chunks[chunks.length-1].getFirstCompanion().x)+","+String.valueOf(chunks[chunks.length-1].getFirstCompanion().y)+" "+String.valueOf(chunks[0].getSecondCompanion().x)+","+String.valueOf(chunks[0].getSecondCompanion().y)+" "+String.valueOf(chunks[0].getControlPoint().x)+","+String.valueOf(chunks[0].getControlPoint().y)+"Z";
		}
		return res;
	}

    
    
    
}
