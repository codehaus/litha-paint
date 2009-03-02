package com.blinx.renderer.shapes;

import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.StringTokenizer;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.blinx.ConstantsBulk;
import com.blinx.clientobjects.RegionHistoryElement;
import com.blinx.clientobjects.image.ImageHistoryElement;


/**
 * Image class uses transformation data to store entire position of image (even x,y coordinates of top left corner). So left and top parameters no longer affects.
 * @author slava
 */
public class Image implements Shape {

	
	private Logger log = Logger.getLogger(Image.class);
	private String base64encoded = "";
	private int left,top,width,height;
	private String imgType = ConstantsBulk.IMG_TYPE_JPG;
	private Integer id=null;
	private double[][] transform = {{1,0,0},{0,1,0},{0,0,1}};
	
	private ImageHistoryElement imageHistoryElement = null;
	
	
	/**
	 * Costruct Image from the following parameters
	 * @param base64content BASE64 encoded image data
	 * @param id id
	 * @param left x coordinate of the top-left corner
	 * @param top y coordinate of the top-left corner
	 * @param width image width
	 * @param height image height
	 * @param transform transformation data
	 * @param imgType mime-type of the image data
	 */
	public Image(String base64content, int id, int left, int top, int width, int height, double[][] transform, String imgType){		
		this.id = new Integer(id);
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;		
		this.base64encoded = base64content;		
				
		this.imgType = imgType;
		for(int i=0;i<3;i++){
			for(int j=0;j<3;j++){
				this.transform[i][j] = transform[i][j];				
			}
		}
		
		this.imageHistoryElement = new ImageHistoryElement(id,calcLeft(),calcTop(),width,height);
		
		log.debug("This image has been constructed: id = "+id+" left = "+left+" top = "+top+" width = "+width+" height = "+height+" matrix = "+transform[0][0]+" "+transform[0][1]+" "+transform[1][0]+" "+transform[1][1]+" "+transform[2][0]+" "+transform[2][1]);
		
	}
	
	/**
	 * Construct Image object from the following line:
	 * <image id="17" imgtype="image/jpeg" left="0" top="0" width="width" height="479" xlink:href="/9j/4AAQSkZJRgABAQAAAAAAAAD/2wBD......ooooAP/Z"  transform="1.0 0.0 0.0 1.0 x.0 y.0" />
	 * 
	 * @param str the line mentioned above.
	 */
	public Image(String str){
		int startIdx = -1;
        int endIdx = -1;
        
        startIdx = str.indexOf("id=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+4);
            if(endIdx!=-1){
                this.id = Integer.valueOf(str.substring(startIdx+4,endIdx));
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

        
        startIdx = str.indexOf("imgtype=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+9);
            if(endIdx!=-1){
                this.imgType = str.substring(startIdx+9,endIdx);
            }
        }
        
        startIdx = str.indexOf("xlink:href=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+12);
            if(endIdx!=-1){
                this.base64encoded = str.substring(startIdx+12,endIdx);
            }
        }

        startIdx = str.indexOf("transform=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+11);
            if(endIdx!=-1){
                String transformStr = str.substring(startIdx+11,endIdx);
                StringTokenizer tokenizer = new StringTokenizer(transformStr);                
                transform[0][0] = Double.parseDouble(tokenizer.nextToken(" "));
                transform[0][1] = Double.parseDouble(tokenizer.nextToken(" "));
                transform[1][0] = Double.parseDouble(tokenizer.nextToken(" "));
                transform[1][1] = Double.parseDouble(tokenizer.nextToken(" "));
                transform[2][0] = Double.parseDouble(tokenizer.nextToken(" "));
                transform[2][1] = Double.parseDouble(tokenizer.nextToken(" "));
            }
        }
        
        this.imageHistoryElement = new ImageHistoryElement(id,calcLeft(),calcTop(),width,height);
		log.debug("This image has been constructed: id = "+id+" left = "+left+" top = "+top+" width = "+width+" height = "+height+" matrix = "+transform[0][0]+" "+transform[0][1]+" "+transform[1][0]+" "+transform[1][1]+" "+transform[2][0]+" "+transform[2][1]);

	}

	public Element materialize(Document document) {
		log.debug("Image id="+id+" is about to materialize");
        Element image = document.createElementNS(svgNS, "image");       
        image.setAttributeNS(null, "x", String.valueOf(left));               
        image.setAttributeNS(null, "y", String.valueOf(top));        
               
        image.setAttributeNS(null, "width", String.valueOf(width));
        image.setAttributeNS(null, "height", String.valueOf(height));        
        
        image.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",String.valueOf("data:"+this.imgType+";base64,"+this.base64encoded));
                
        image.setAttributeNS(null,"transform","matrix("+transform[0][0]+" "+transform[0][1]+" "+transform[1][0]+" "+transform[1][1]+" "+transform[2][0]+" "+transform[2][1]+")");
        
        this.imageHistoryElement = new ImageHistoryElement(id,left,top,width,height);
        
        log.debug("Image materialized with parameters: x = "+left+" y = "+top+" width = "+width+" height = "+height+" matrix = "+transform[0][0]+" "+transform[0][1]+" "+transform[1][0]+" "+transform[1][1]+" "+transform[2][0]+" "+transform[2][1]);
        return image;
	}

	public List materializeText(Document document) {
		return new ArrayList();
	}

	public Rectangle getOutscribingRect() {
        int x0 = (int)Math.round(left*transform[0][0]+top*transform[1][0]+transform[2][0]);
        int y0 = (int)Math.round(left*transform[0][1]+top*transform[1][1]+transform[2][1]);
        int x1 = (int)Math.round((left+width)*transform[0][0]+(top+height)*transform[1][0]+transform[2][0]);
        int y1 = (int)Math.round((left+width)*transform[0][1]+(top+height)*transform[1][1]+transform[2][1]);
        Rectangle res = new Rectangle(x0,y0,x1-x0,y1-y0);
        log.debug("Calculated outscribing rect for image id="+id+" is rect: "+x0+" "+y0+" "+(x1-x0)+" "+(y1-y0));
        return res;	
    }

	public Integer getID() {
		return id;
	}

	public String toString(){
        String res = "";                
        res = "<image id=\""+id.toString()+"\" imgtype=\""+this.imgType+"\" left=\""+left+"\" top=\""+top+"\" width=\""+width+"\" height=\""+height+"\" xlink:href=\""+base64encoded+"\"  transform=\""+transform[0][0]+" "+transform[0][1]+" "+transform[1][0]+" "+transform[1][1]+" "+transform[2][0]+" "+transform[2][1]+"\" />";        
        return res;
    }

	private int calcTop() {
		long res = 0;
		res = (int)Math.round(left*transform[0][1]+top*transform[1][1]+transform[2][1]);
		return (int)res;
	}

	private int calcLeft() {
		long res = 0;
		res = Math.round(left*transform[0][0]+top*transform[1][0]+transform[2][0]); 
		return (int)res;
	}

	/**
	 * setter
	 * @param transform
	 */
    public void setTransform(double[][] transform) {    	
        System.arraycopy(transform,0,this.transform,0,transform.length);
        String matrix = Arrays.toString(this.transform);
        log.debug("matrix = "+matrix);
    }

    /**
     * getter
     * @return a transformation matrix
     */
    public double[][] getTransform() {
        double [][] res = new double[3][3];
        System.arraycopy(transform,0,res,0,transform.length);
        return res;
    }

    /**
     * Retrieve image binary data in Base64
     * @return Base64 encoded image binary data
     */
    public String getBase64encoded() {
        return base64encoded;
    }

    /**
     * getter
     * @return left postion of an image
     */
    public int getLeft() {
        return left;
    }

    /**
     * getter
     * @return top position
     */
    public int getTop() {
        return top;
    }

    /**
     * getter
     * @return width of a image
     */
    public int getWidth() {
        return width;
    }

    /**
     * getter
     * @return height of an image
     */
    public int getHeight() {
        return height;
    }

    /**
     * geter
     * @return image type
     */
    public String getImgType() {
        return imgType;
    }

    /**
     * setter
     * @param base64encoded Base64 encoded binary image data
     */
    public void setBase64encoded(String base64encoded) {
        this.base64encoded = base64encoded;
    }
    
    public RegionHistoryElement toRegionHistoryElement() {
    	return imageHistoryElement;
    }
}
