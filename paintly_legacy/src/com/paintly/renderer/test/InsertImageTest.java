package com.paintly.renderer.test;

import java.awt.Point;
import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;

import org.w3c.dom.Document;

import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.Renderer;
import com.paintly.renderer.SVGDocumentTools;
import com.paintly.renderer.shapes.Shape;

/**
 * 
 * @author slava
 *
 */
public class InsertImageTest {

	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
        InsertImageTest instance = new InsertImageTest();
        long start = System.currentTimeMillis();
        instance.run();
        long end = System.currentTimeMillis();
        System.out.println("Finished in "+(end-start)+" ms.");
    }

    /*
     * Performs testing
     */
    private void run() {
        DocumentHolder document = new DocumentHolder();
        CanvasScrapHolder canvas = new CanvasScrapHolder(10,10,10,10);
        Renderer renderer = new Renderer(canvas,document);
//        Shape rect1 = createRectangle(10,10,100,100, "1");
        long startTime = System.currentTimeMillis();
//        renderer.addElement(rect1);
        long endTime = System.currentTimeMillis();
        System.out.println("Add first rect tooks "+(endTime-startTime)+" ms.");
        
        startTime = System.currentTimeMillis();
//        Shape ellipse1 = createEllipse(80,80,100,100,"2");
//        renderer.addElement(ellipse1);
        endTime = System.currentTimeMillis();
        System.out.println("Add first ellipse tooks "+(endTime-startTime)+" ms.");
        
        startTime = System.currentTimeMillis();
//        Shape rect2 = createRectangle(150,150,100,100, "3");
//        renderer.addElement(rect2);
        endTime = System.currentTimeMillis();
        System.out.println("Add second rect tooks "+(endTime-startTime)+" ms.");

//        Shape line1 = createLine(200,200,400,400,"4");
//        renderer.addElement(line1);

        startTime = System.currentTimeMillis();
        renderer.renderDirtyRegionsOfTheDocument();
        endTime = System.currentTimeMillis();
        System.out.println("First render took "+(endTime-startTime)+" ms");
        String dir = "C:\\Temp\\Paintly\\0";
        
        
        savePngScraps(canvas, dir);
        
        startTime = System.currentTimeMillis();
//        ellipse1 = createEllipse(200,200,100,100, "2");
//        renderer.updateElement(ellipse1);
        endTime = System.currentTimeMillis();
        System.out.println("Changinf first ellipse took "+(endTime-startTime)+" ms");               
        
        startTime = System.currentTimeMillis();
        renderer.renderDirtyRegionsOfTheDocument();
        endTime = System.currentTimeMillis();
        System.out.println("Second render took "+(endTime-startTime)+" ms");
        
        dir = "C:\\Temp\\Paintly\\1";        
        savePngScraps(canvas, dir);
        
        Document svgDocument = SVGDocumentTools.assemble(document,500,500);
        String stringDocument = SVGDocumentTools.serialize2SVG(svgDocument);
        
        try {
            BufferedWriter bw = new BufferedWriter(new FileWriter(dir+"\\document.svg"));
            bw.write(stringDocument);
            bw.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }   
        
        byte[] png = SVGDocumentTools.serialize2PNG(svgDocument, 500,500);           
        try {
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(dir+"\\document.png"));
            bos.write(png);
            bos.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }   

        byte[] jpeg = SVGDocumentTools.serialize2JPEG(svgDocument, 500,500);           
        try {
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(dir+"\\document.jpg"));
            bos.write(jpeg);
            bos.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }   
        
        byte[] tiff = SVGDocumentTools.serialize2TIFF(svgDocument, 500,500);           
        try {
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(dir+"\\document.tiff"));
            bos.write(tiff);
            bos.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    
    }

    /**
     * @param canvas
     * @param dir
     */
    private void savePngScraps(CanvasScrapHolder canvas, String dir) {
        HashMap dirty = canvas.getDirtyScraps();
        Iterator it = dirty.keySet().iterator();
        while(it.hasNext()){
             Point p = (Point)it.next();
                byte[] scrapb64Encoded = canvas.getScrapData(p.y,p.x);                                
                try {                   
                    FileOutputStream fos = new FileOutputStream(dir+"\\"+p.y+"_"+p.x+".png");                                       
                    fos.write(scrapb64Encoded);                    
                    fos.close();
                } catch (IOException e) {                 
                    e.printStackTrace();
                }           
        }
        //canvas.resetDirtyScraps();
    }

//    private Shape createEllipse(int x, int y, int width, int height, String id) {
//        return new Ellipse(x,y,width,height,"#00FF00","yellow", id);
//    }

//    private Shape createRectangle(int x, int y, int width, int height, String id) {
//        return new com.paintly.renderer.shapes.Rectangle(x,y,width,height,"#00FF00","blue", id);
//    }
//    
//    private Shape createLine(int x1, int y1, int x2, int y2, String id){
//        return new Line(x1,y1,x2,y2,"#00FF00","blue",id);
//    }
        
    private Shape createImage(int x1, int y1, int x2, int y2, File f){
    	return null;
    }


}
