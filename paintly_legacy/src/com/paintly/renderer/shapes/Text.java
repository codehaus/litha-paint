package com.paintly.renderer.shapes;

import org.w3c.dom.Element;
import org.w3c.dom.Document;

import com.paintly.renderer.ConstantsBulk;

import java.util.List;
import java.util.ArrayList;
import java.awt.Rectangle;

public class Text implements Shape{

    private ArrayList points = null;
    private String pointsStr = null;

    private Integer id = null;

    private String strokeColor = "#000000";
    private String left_top = null;
    private String width_height = null;
    private String text="";
    private String[] lines = null;
    private String textSize=null;


    private int left,top,width,height = 0;
    
    private String font = null;
    private String weight = null;
    private String text_style = null;
    private String text_decoration = null;

    public Text( String points,  String stroke, String left_top, String width_height, String text, String textSize, String id, String font, String weight, String text_style, String text_decoration) {

        this.id = Integer.valueOf(id);
        this.points = extractPoints(points);
        this.pointsStr = points;
        this.strokeColor = stroke;
        this.left_top = left_top;
        this.width_height = width_height;
        this.text = text;
        this.lines = extractLines();
        this.textSize = textSize;
        
        this.font = font;
        this.weight = weight;
        this.text_style = text_style;
        this.text_decoration = text_decoration;
        calcBoundaries();
    }
    
    public Text (String str){
        int startIdx = -1;
        int endIdx = -1;
        
        startIdx = str.indexOf("id=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+4);
            if(endIdx!=-1){
                this.id = Integer.valueOf(str.substring(startIdx+4,endIdx));
            }
        }
        
        startIdx = str.indexOf("points=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+8);
            if(endIdx!=-1){
                this.pointsStr = str.substring(startIdx+8,endIdx);
                this.points = extractPoints(this.pointsStr);
            }
        }
        
        startIdx = str.indexOf("text=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.text = str.substring(startIdx+6,endIdx);
                this.lines = extractLines();
            }
        }
        
        startIdx = str.indexOf("left_top=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+10);
            if(endIdx!=-1){
                this.left_top = str.substring(startIdx+10,endIdx);                
            }
        }

        startIdx = str.indexOf("width_height=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+14);
            if(endIdx!=-1){
                this.width_height = str.substring(startIdx+14,endIdx);                
            }
        }

        startIdx = str.indexOf("stroke=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+8);
            if(endIdx!=-1){
                this.strokeColor = str.substring(startIdx+8,endIdx);
                
            }
        }
        
        startIdx = str.indexOf("size=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.textSize = str.substring(startIdx+6,endIdx);
                
            }
        }

        startIdx = str.indexOf("font=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.font = str.substring(startIdx+6,endIdx);
                
            }
        }

        startIdx = str.indexOf("weight=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+8);
            if(endIdx!=-1){
                this.weight = str.substring(startIdx+8,endIdx);
                
            }
        }

        startIdx = str.indexOf("text-style=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+12);
            if(endIdx!=-1){
                this.text_style = str.substring(startIdx+12,endIdx);
                
            }
        }

        startIdx = str.indexOf("text-decoration=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+17);
            if(endIdx!=-1){
                this.text_decoration = str.substring(startIdx+17,endIdx);
                
            }
        }
        
        startIdx = str.indexOf("left=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.left = Integer.valueOf(str.substring(startIdx+6,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf(" top=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+6);
            if(endIdx!=-1){
                this.top = Integer.valueOf(str.substring(startIdx+6,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf("width=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+7);
            if(endIdx!=-1){
                this.width = Integer.valueOf(str.substring(startIdx+7,endIdx)).intValue();
            }
        }

        startIdx = str.indexOf(" height=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+9);
            if(endIdx!=-1){
                this.height = Integer.valueOf(str.substring(startIdx+9,endIdx)).intValue();
            }
        }

        

    }


    private String[] extractLines() {
        String[] res = text.split("!!!BR!!!");
        return res;
    }

    private void calcBoundaries() {
        String[] left_top = this.left_top.split(",");
        String[] width_height = this.width_height.split(",");
        left = Integer.parseInt(left_top[0]);
        top = Integer.parseInt(left_top[1]);
        width = Integer.parseInt(width_height[0]);
        height = Integer.parseInt(width_height[1]);
    }

    private ArrayList extractPoints(String points) {
        ArrayList res = new ArrayList();
        if(points!=null && points.length()>0){
            String[] point = points.split("\\s");
            for(int i=0;i<point.length;i++){
                String[] coords = point[i].split(",");
                res.add(new PointStr(coords[0],coords[1]));
            }
        }
        return res;
    }


    public Element materialize(Document document) //all descendants except Text should implement this method. Text must leave this method empty
    {
        return null;
    }

    public List materializeText(Document document)//only Text should implement this method, others descendants must leave this method empty
    {
        ArrayList res = new ArrayList();
        for(int i=0;i<lines.length;i++){
            Element text = document.createElementNS(svgNS, "text");
            text.setAttributeNS(null, "x", ((PointStr)points.get(i)).getX());
            text.setAttributeNS(null, "y", ((PointStr)points.get(i)).getY());
            text.setAttributeNS(null, "font-size", textSize);
            if(!ConstantsBulk.ALPHA.equals(strokeColor))text.setAttributeNS(null, "stroke", strokeColor);
            if(!ConstantsBulk.ALPHA.equals(strokeColor))text.setAttributeNS(null, "fill", strokeColor);
            if(this.font!=null) text.setAttributeNS(null, "font-family", this.font);
            if(this.weight!=null) text.setAttributeNS(null,"font-weight", this.weight);
            if(this.text_style!=null) text.setAttributeNS(null,"font-style", this.text_style);
            if(this.text_decoration!=null) text.setAttributeNS(null, "text-decoration", this.text_decoration);
            text.appendChild(document.createTextNode(lines[i]));
            //text.setNodeValue(lines[i]);
            res.add(text);
        }
        return res;
    }

    public java.awt.Rectangle getOutscribingRect() {
        Rectangle res = new Rectangle(left,top,width,height);
        return res;
    }

    public Integer getID() {
        return id;
    }
    
    public String toString(){
        String res = "<text id=\""+this.id+"\" points=\""+this.pointsStr+"\" text=\""+this.text+"\" left_top=\""+this.left_top+"\" width_height=\""+this.width_height+"\" stroke=\""+this.strokeColor+"\" size=\""+this.textSize+"\" font=\""+this.font+"\" weight=\""+this.weight+"\" text-style=\""+this.text_style+"\" text-decoration=\""+this.text_decoration+"\" left=\""+left+"\" top=\""+top+"\" width=\""+width+"\" height=\""+height+"\"/>";
        return res;
    }
}
