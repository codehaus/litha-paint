package com.paintly.renderer;

import java.awt.Point;
import java.util.HashMap;

/**
 * This class manages a canvas which consists of scraps. 
 * It provides access to the particular scraps.  
 * @author VyacheslavE
 * @version Apr 14, 2006
 */
public class CanvasScrapHolder {
    
    
    
    /**
     * Square matrix of bytearrays. Each bytearray stores PNG representation of scrap.  
     */
    private byte[][][] canvasScrap;
    
    /**
     * The digest matrix for scraps. It is needed to make decision whoch scrap is dirty and which is clean.
     */
    private byte[][][] digest4Scraps;
    
    /**
     * Horizontal number of scraps 
     */
    private int scrapsX = 0;
    
    /**
     * Vertical number of scraps 
     */
    private int scrapsY = 0;
    
    /**
     * The list of scraps (Point) that needs to be updated on the client;
     */
    private HashMap dirtyScraps = null; 
    
    /**
     * Width of the document in pixels
     */
    private int realWidth=0;
    
    /**
     * Height of the document in pixels
     */
    private int realHeight=0;
    
    
    /**Constructs a CanvasScrapHolder with matrix scrapx - columns and scrapy - rows
     * @param scrapsx number of columns of the matrix
     * @param scrapsy number of rows of the matrix
     * @param realWidth width of the document in the pixels
     * @param realHeight height of the document in the pixel

     */
    public CanvasScrapHolder(int scrapsx, int scrapsy, int realWidth, int realHeight) {               
        scrapsX = scrapsx;
        scrapsY = scrapsy;
        this.realWidth = realWidth;
        this.realHeight = realHeight;
        initCanvasScrap(scrapsx,scrapsy);
    }
    
    /**
     * Constructor
     * @param str
     */
    public CanvasScrapHolder(String str){
        int startIdx =-1;
        int endIdx = -1;
        
        startIdx = str.indexOf("scrapsX=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+9);
            this.scrapsX = (int)Math.round(Math.ceil(Double.parseDouble(str.substring(startIdx+9,endIdx))/ConstantsBulk.SCRAPWIDTH));
        }
        
        startIdx = str.indexOf("scrapsY=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+9);
            this.scrapsY = (int)Math.round(Math.ceil(Double.parseDouble(str.substring(startIdx+9,endIdx))/ConstantsBulk.SCRAPHEIGHT));
        }
        
        startIdx = str.indexOf("realWidth=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+11);
            this.realWidth = Integer.parseInt(str.substring(startIdx+11,endIdx));
        }
        
        startIdx = str.indexOf("realHeight=\"");
        if(startIdx!=-1){
            endIdx = str.indexOf("\"",startIdx+12);
            this.realHeight = Integer.parseInt(str.substring(startIdx+12,endIdx));
        }
        
        
        initCanvasScrap(this.scrapsX,this.scrapsY);

    }

    /**
     * Initializes canvasScrap with given size
     * @param width of canvasScrap in number of scraps
     * @param height of canvasScrap in number of scraps
     */
    public void initCanvasScrap(int width, int height){
        canvasScrap = new byte[height][width][0];
        digest4Scraps = new byte[height][width][0];        
        dirtyScraps = new HashMap();
    }
    
    /**
     * Resets a list of dirty scraps. Client should call this method after it have got a data from matrix.     
     */
    /*public void resetDirtyScraps(){
        dirtyScraps = new HashMap();
    } */
    
    /**
     * Sets scrap data into canvasScrap.
     * @param i coord of scrap in canvas to set
     * @param j coord of scrap in canvas to set
     * @param scrapData data of the scrap in PNG format which we want to save in canvasScrap
     */
    public void setScrap(int i, int j, byte[] scrapData){
        if(scrapData.length>0){
            canvasScrap[i][j] = scrapData;
            byte[] newDigest = Utils.calculateDigest(scrapData);
            if(!Utils.digestsEquals(digest4Scraps[i][j],newDigest)){
               dirtyScraps.put(new Point(j,i), null);
               digest4Scraps[i][j] = newDigest;
            }
        }
    }
    
    /**
     * Get scrap data in PNG format from canvasScrap.
     * @param i coord of scrap in canvas to get
     * @param j coord of scrap in canvas to get
     * @return data of scrap in PNG format
     */
    public byte[] getScrapData(int i, int j){
        return canvasScrap[i][j];
    }
    
    /**
     * Removes a scrap from a dirtyScrap list.
     * @param p
     */
    public void markScrapAsClean(Point p){
        dirtyScraps.remove(p);
    }

    /**
     * getter
     * @return scrapsX
     */
    public int getScrapsX() {
        return scrapsX;
    }

    /**
     * getter
     * @return scrapsY;
     */
    public int getScrapsY() {
        return scrapsY;
    }

    /**
     * getter
     * @return dirtyscraps (that weren't tranmitted to the client yet)
     */
    public HashMap getDirtyScraps() {
        return dirtyScraps;
    }


    /**
     * Remove a scrap from the list of the dirty scraps
     * @param i
     * @param j
     */
    public void removeDirtyScrap(int i, int j) {
        dirtyScraps.remove(new Point(j,i));
    }
    
    public String toString(){
        String res = "";
        res="<canvas scrapsX=\""+scrapsX*ConstantsBulk.SCRAPWIDTH+"\" scrapsY=\""+scrapsY*ConstantsBulk.SCRAPHEIGHT+"\" realWidth=\""+String.valueOf(this.realWidth)+"\" realHeight=\""+String.valueOf(this.realHeight)+"\"/>";
        return res;
    }

    /**
     * getter
     * @return height of the document in pixels
     */
    public int getRealHeight() {
        return realHeight;
    }

    
    /**
     * getter
     * @return width of the document in pixels
     */
    public int getRealWidth() {
        return realWidth;
    }
    
}
