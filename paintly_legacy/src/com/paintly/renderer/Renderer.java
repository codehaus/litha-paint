package com.paintly.renderer;

import java.awt.Rectangle;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

import org.apache.batik.dom.svg.SVGDOMImplementation;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.log4j.Logger;
import org.w3c.dom.DOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.paintly.renderer.shapes.Shape;
import com.paintly.renderer.shapes.Text;
import com.paintly.renderer.shapes.ImageTransformation;
import com.paintly.renderer.shapes.Image;


/**
 * This class performs rendering of document based on content of DocumentHolder and updates scraps in CanvasScrapHolder
 * @author VyacheslavE
 * @version Apr 14, 2006
 */
public class Renderer {

    private static Logger log = Logger.getLogger(Renderer.class);

    private CanvasScrapHolder canvas = null;
    private DocumentHolder document = null;

    private Set interest = new HashSet();


    /**
     * Constructs a Renderer for canvas and document 
     * @param canvas CanvasScrapHolder
     * @param document DocumentHolder
     */
    public Renderer(CanvasScrapHolder canvas, DocumentHolder document) {
        this.canvas = canvas;
        this.document = document;
    }


    /**
     * Adds new element with given id and occupied region to the DocumentHolder and renders a canvas 
     * @param element element to add
     */
    public void addElement(Shape element){

        DocumentFragment fragment = new DocumentFragment(element);
        interest.add(fragment.getRect());
        document.addFragment(element.getID(),fragment);
    }

    /**
     * Updates existing element with new one
     * @param element new element wish to update to
     */
    public void updateElement(Shape element){
        DocumentFragment oldDocumentFragment = document.retrieveFragment(element.getID());
        DocumentFragment newDocumentFragment = new DocumentFragment(element);
        if(oldDocumentFragment!=null){interest.add(oldDocumentFragment.getRect());}
        interest.add(newDocumentFragment.getRect());
        document.updateFragment(element.getID(),newDocumentFragment);
    }

    /**
     * Removes the element with given id from the document
     * @param id given id
     */
    public void deleteElement(String id){
        DocumentFragment documentFragment = document.retrieveFragment(Integer.valueOf(id));
        interest.add(documentFragment.getRect());
        document.deleteFragment(Integer.valueOf(id));
    }

    /**
     * Renders only that parts of the documents that is really changed with the changes of the element and updates svgDocument with new element with correct substarte
     */
    public void renderDirtyRegionsOfTheDocument(){
        if(interest!=null && interest.size()>0){
          Document svgDocument = getSvgDocument4AllElements(interest);
          generateScraps(svgDocument,interest);
          interest = new HashSet();
        }
    }


    /**
     * Renders entire document from DocumentHolder.     
     */
    public void renderDocument(){


        Document svgDocument = getSvgDocument4AllElements(null);
        generateScraps(svgDocument, null);
        interest = new HashSet();

    }

    /**Puts scraps into canvas (CanvasScrapHolder).
     * @param svgDocument which we want to renders on the scraps
     * @param interest the Set consists of Rectangles for which we need to generate scraps. If Set is empty then entire document generated.
     */
    private void generateScraps(Document svgDocument, Set interest) {
        TranscoderInput transcoderInput = new TranscoderInput(svgDocument);
        PNGTranscoder pngtr = new PNGTranscoder();
        int width = ConstantsBulk.SCRAPWIDTH;
        int height = ConstantsBulk.SCRAPHEIGHT;
        for(int i=0;i<canvas.getScrapsY();i++){
            for(int j=0;j<canvas.getScrapsX();j++){
                if(interest == null || interest.size()==0){
                    createScrap(transcoderInput, pngtr, width, height, i, j);
                }
                else{
                    Iterator it = interest.iterator();
                    boolean fit = false;
                    while(it.hasNext()){
                        Rectangle rect = (Rectangle)it.next();
                        if(rect.intersects(j*width,i*height,width,height)){
                            fit = true;
                            break;
                        }
                    }
                    if(fit){
                        createScrap(transcoderInput, pngtr, width, height, i, j);
                    }
                }
            }
        }
    }

    /** Create a scrap with width and height and coords (j,i) and puts it to the canvas 
     * @param transcoderInput input for a Transcoder
     * @param pngtr Transcoder itself
     * @param width width of scrap
     * @param height height of scrap
     * @param i number of line of a scrap in a matrix
     * @param j number of column of a scrap in the matrix
     */
    private void createScrap(TranscoderInput transcoderInput, PNGTranscoder pngtr, int width, int height, int i, int j) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        //Base64EncoderStream b64Encoder = new Base64EncoderStream(baos);
        pngtr.addTranscodingHint(PNGTranscoder.KEY_AOI,new Rectangle(j*width,i*height,width,height));
        pngtr.addTranscodingHint(PNGTranscoder.KEY_HEIGHT,new Float(height));
        pngtr.addTranscodingHint(PNGTranscoder.KEY_WIDTH,new Float(width));
        try {
            pngtr.transcode(transcoderInput,new TranscoderOutput(baos));
        }
        catch (TranscoderException e) {
             e.printStackTrace();
        }
        canvas.setScrap(i,j,baos.toByteArray());
        /*
        if(log.isDebugEnabled()){ //debug generated scrap to the disk
        	FileOutputStream fos = null;
			try {
				fos = new FileOutputStream(ConstantsBulk.TEMP_DIR+ConstantsBulk.FILESEPARATOR+i+"_"+j+".png");
				fos.write(baos.toByteArray());
			} catch (FileNotFoundException e) {
				log.debug("Can't create"+ConstantsBulk.TEMP_DIR+ConstantsBulk.FILESEPARATOR+i+"_"+j+".png");
			} catch (IOException e) {
				log.debug("Can't create"+ConstantsBulk.TEMP_DIR+ConstantsBulk.FILESEPARATOR+i+"_"+j+".png");			
        	}
        	finally{
        		if(fos != null)
					try {
						fos.close();
					} catch (IOException e) {
						log.debug("Can't close"+ConstantsBulk.TEMP_DIR+ConstantsBulk.FILESEPARATOR+i+"_"+j+".png");
					}
        	}
        } */       	        	     
    }

    /**
     * Creates SVG Document that contains all of the document's fragments.
     * @param interest set of Rectangles that hit elements we need for Document.
     * @return Document
     */
    private Document getSvgDocument4AllElements(Set interest) {        
        DOMImplementation impl = SVGDOMImplementation.getDOMImplementation();
        Document res = impl.createDocument(SVGDOMImplementation.SVG_NAMESPACE_URI, "svg", null);
        Element svgRoot = res.getDocumentElement();

//      set the width and height attribute on the root svg element
        svgRoot.setAttributeNS(null, "width", String.valueOf(canvas.getScrapsX()*ConstantsBulk.SCRAPWIDTH));
        svgRoot.setAttributeNS(null, "height", String.valueOf(canvas.getScrapsY()*ConstantsBulk.SCRAPHEIGHT));
            LinkedHashMap elements;
            if(interest == null || interest.size()==0){
                elements = document.retrieveFragmentsAll();
            }
            else{
                elements = document.retrieveFragmentsIntersectedWithRegions(interest);
            }
            Iterator it = elements.keySet().iterator();
            while(it.hasNext()){
                Integer identifier = (Integer)it.next();
                DocumentFragment fragment = (DocumentFragment)elements.get(identifier);
                if(!(fragment.getElement() instanceof Text)){
                    svgRoot.appendChild(fragment.getElement().materialize(res));
                }
                else{
                    List elems = fragment.getElement().materializeText(res);
                    Iterator i = elems.iterator();
                    while(i.hasNext()){
                        Element e = (Element)i.next();
                        svgRoot.appendChild(e);
                    }
                }                
            }
        return res;
    }







    /**
     * Update an image with a given imageTransformation 
     * @param imageTranformation transformation that will be applied to the image
     */
    public void updateImage(ImageTransformation imageTranformation) {
        DocumentFragment oldDocumentFragment = document.retrieveFragment(imageTranformation.getID());
        if(oldDocumentFragment!=null){
            interest.add(oldDocumentFragment.getRect());
            Image image = (Image)oldDocumentFragment.getElement();
            double[][] oldTransform = image.getTransform();
            double[][] newTransform = Utils.calculateTransform(image.getOutscribingRect(),imageTranformation.getOutscribingRect(),oldTransform);
            image.setTransform(newTransform);
            DocumentFragment newDocumentFragment = new DocumentFragment(image);
            interest.add(newDocumentFragment.getRect());
            document.updateFragment(image.getID(),newDocumentFragment);
        }
                
    }

    /**
     * Copy given image with a little shift (copy/paste operation).
     * @param id_prototype id of image to copy
     * @param image
     */
    public void copyImage(Integer id_prototype, ImageTransformation image){
        DocumentFragment prototypeDocumentFragment = document.retrieveFragment(id_prototype);
        if(prototypeDocumentFragment!=null){
            Image prototypeImage = (Image)prototypeDocumentFragment.getElement();
            double[][] oldTransform = prototypeImage.getTransform();
            double[][] newTransform = Utils.calculateTransform(prototypeImage.getOutscribingRect(),image.getOutscribingRect(),oldTransform);
            Image newImage = new Image(prototypeImage.getBase64encoded(),image.getID(),prototypeImage.getLeft(),prototypeImage.getTop(),prototypeImage.getWidth(),prototypeImage.getHeight(),newTransform,prototypeImage.getImgType());
            DocumentFragment newDocumentFragment = new DocumentFragment(newImage);
            interest.add(newDocumentFragment.getRect());
            document.addFragment(image.getID(),newDocumentFragment);
        }
    }

    /**
     * Bring given shape one layer back.
     * @param id
     */
    public void bringBack(Integer id){
        ArrayList interested = document.bringBack(id);
        Iterator i = interested.iterator();
        while(i.hasNext()){
            interest.add(((DocumentFragment)i.next()).getRect());
        }
    }

    /**
     * Bring given image one layer front.
     * @param id
     */
    public void bringFront(Integer id){
        ArrayList interested = document.bringFront(id);
        Iterator i = interested.iterator();
        while(i.hasNext()){
            interest.add(((DocumentFragment)i.next()).getRect());
        }
    }

    /**
     * Bring given element to the top layer.
     * @param id
     */
    public void bringTop(Integer id){
        ArrayList interested = document.bringTop(id);
        Iterator i = interested.iterator();
        while(i.hasNext()){
            interest.add(((DocumentFragment)i.next()).getRect());
        }
    }

    /**
     * Bring given image to the bottom layer.
     * @param id
     */
    public void bringBottom(Integer id){
        ArrayList interested = document.bringBottom(id);
        Iterator i = interested.iterator();
        while(i.hasNext()){
            interest.add(((DocumentFragment)i.next()).getRect());
        }
    }

}
