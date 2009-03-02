package com.blinx.renderer;

import java.awt.Rectangle;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.batik.dom.svg.SVGDOMImplementation;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.transcoder.image.TIFFTranscoder;
import org.apache.xml.serialize.XMLSerializer;
import org.w3c.dom.DOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.blinx.ConstantsBulk;
import com.blinx.renderer.shapes.Shape;
import com.blinx.renderer.shapes.Text;



/**
 * This class is intended to create SVGDocument on basis of DocumentHolder
 * {@link com.blinx.renderer.DocumentHolder}
 * 
 * @author VyacheslavE
 * @version Apr 15, 2006
 */
public class SVGDocumentTools {
       
    private static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;
    
    
    /**
     * On the basis of content of DocumentHolder it creates DOM Document of SVG
     * document.
     * 
     * @param document
     *            DocumentHolder
     * @param width
     *            width of DOM svgDocument
     * @param height
     *            height of DOM svgDocument
     * @return DOM svgDocument
     */
    public static Document assemble(DocumentHolder document, int width, int height){
        DOMImplementation impl = SVGDOMImplementation.getDOMImplementation();        
        Document res = impl.createDocument(svgNS, "svg", null);        
        Element svgRoot = res.getDocumentElement();

// set the width and height attribute on the root svg element
        svgRoot.setAttributeNS(null, "width", String.valueOf(width));
        svgRoot.setAttributeNS(null, "height", String.valueOf(height));
        Element back = createBackgroundElement(res,document,width,height);
        if (back != null) {
        	svgRoot.appendChild(back);
        }
        LinkedHashMap elements = document.retrieveFragmentsAll();
        Iterator it = elements.keySet().iterator();
        while(it.hasNext()){
            Integer identifier = (Integer)it.next();
            DocumentFragment fragment = (DocumentFragment)elements.get(identifier);
            Shape shape = fragment.getElement();
            if(shape instanceof Text){
            	List e = shape.materializeText(res);
            	Iterator i = e.iterator();
            	while(i.hasNext()){
            		Element el = (Element)i.next();
            		svgRoot.appendChild(el);
            	}
            }
            else{
              svgRoot.appendChild(shape.materialize(res));
            }
        }                            
        return res;
    }
    
    /**
     * Serializes Docu,ment into SVG format
     * @param document
     * @return string of SVG representation
     */
    public static String serialize2SVG(Document document){
        StringWriter res = new StringWriter();
        try{                    
           XMLSerializer serializer = new XMLSerializer (res, null);           
           serializer.setNamespaces(true);           
           serializer.serialize (document);
        }
        catch (Exception ex){
           ex.printStackTrace ();
        }
        return res.toString();
    }
    
    /**
     * Serializes a document into PNG data
     * @param document
     * @param width
     * @param height
     * @return PNG binary data
     */
    public static byte[] serialize2PNG(Document document, int width, int height){        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PNGTranscoder pngtr = new PNGTranscoder();
        pngtr.addTranscodingHint(PNGTranscoder.KEY_AOI,new Rectangle(0,0,width,height));
        pngtr.addTranscodingHint(PNGTranscoder.KEY_HEIGHT,new Float(height));
        pngtr.addTranscodingHint(PNGTranscoder.KEY_WIDTH,new Float(width));
        
        try {
            pngtr.transcode(new TranscoderInput(document),new TranscoderOutput(baos));
        } catch (TranscoderException e) {        
            e.printStackTrace();
        }       
        return baos.toByteArray();
    }
    
    /**
     * Serializes a document into JPEG
     * @param document
     * @param width
     * @param height
     * @return JPEG binary data of the document
     */
    public static byte[] serialize2JPEG(Document document, int width, int height){        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        JPEGTranscoder jpegtr = new JPEGTranscoder();
        jpegtr.addTranscodingHint(JPEGTranscoder.KEY_AOI,new Rectangle(0,0,width,height));
        jpegtr.addTranscodingHint(JPEGTranscoder.KEY_HEIGHT,new Float(height));
        jpegtr.addTranscodingHint(JPEGTranscoder.KEY_WIDTH,new Float(width));
        jpegtr.addTranscodingHint(JPEGTranscoder.KEY_QUALITY, new Float(1));
        
        try {
            jpegtr.transcode(new TranscoderInput(document),new TranscoderOutput(baos));
        } catch (TranscoderException e) {        
            e.printStackTrace();
        }       
        return baos.toByteArray();
    }
    

    /**
     * Serializes a document into TIFF
     * @param document
     * @param width
     * @param height
     * @return TIFF binary data
     */
    public static byte[] serialize2TIFF(Document document, int width, int height){        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();        
        TIFFTranscoder tifftr = new TIFFTranscoder();
        tifftr.addTranscodingHint(TIFFTranscoder.KEY_AOI,new Rectangle(0,0,width,height));
        tifftr.addTranscodingHint(TIFFTranscoder.KEY_HEIGHT,new Float(height));
        tifftr.addTranscodingHint(TIFFTranscoder.KEY_WIDTH,new Float(width));
        tifftr.addTranscodingHint(TIFFTranscoder.KEY_FORCE_TRANSPARENT_WHITE,new Boolean(true));
        
        
        try {
            tifftr.transcode(new TranscoderInput(document),new TranscoderOutput(baos));
        } catch (TranscoderException e) {        
            e.printStackTrace();
        }       
        return baos.toByteArray();
    }
    
    /**
     * Creates a rectangle that would cover all document dimension and serves as background color
     * @param document would be used for rect creation
     * @return rect
     */
    public static Element createBackgroundElement(Document document, DocumentHolder documentHolder, int width, int height) {
        Element background = document.createElementNS(SVGDOMImplementation.SVG_NAMESPACE_URI, "rect");
        background.setAttributeNS(null, "x", "0");
        background.setAttributeNS(null, "y", "0");
        background.setAttributeNS(null, "width", String.valueOf(width));
        background.setAttributeNS(null, "height", String.valueOf(height));
        Color backgroundColor = documentHolder.getBackgroundColor();        
        if(!ConstantsBulk.ALPHA.equals(backgroundColor.toString())) {
        	background.setAttributeNS(null, "fill", backgroundColor.toString());
        	background.setAttributeNS(null, "style", "stroke:"+backgroundColor);        	
        } else {
        	background = null;        
        }
        
        return background;
	
    }


}
