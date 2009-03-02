package com.paintly.performancetest;

import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


import org.apache.batik.bridge.BridgeContext;
import org.apache.batik.bridge.GVTBuilder;
import org.apache.batik.bridge.UserAgentAdapter;
import org.apache.batik.dom.svg.SAXSVGDocumentFactory;
import org.apache.batik.gvt.GraphicsNode;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.util.XMLResourceDescriptor;
import org.w3c.dom.svg.SVGDocument;

/**
 * Tester of PNG transcoding transformation
 * @author slava
 *
 */
public class PNGTranscoderPerfTest {

    /**
     * @param args
     * @throws IOException 
     */
    public static void main(String[] args) throws IOException {
       long startTime = System.currentTimeMillis();
       System.out.println("loading file");
       SVGDocument document = loadSVG(args[0]);
       long endTime = System.currentTimeMillis();
       System.out.println("loading SVG document: "+(endTime-startTime));
       
       //startTime = System.currentTimeMillis();       
       //BufferedImage bim = getImageFromSvg(document,new Dimension(10,10));
       //endTime = System.currentTimeMillis();
       //System.out.println("BUfferedImage from SVG: "+(endTime-startTime));
//       
       ByteArrayOutputStream baos = new ByteArrayOutputStream();
       //ImageIO.write(bim,"PNG",new File("0.png"));
       startTime = System.currentTimeMillis();
       //ImageIO.write(bim,"PNG",baos);
       endTime = System.currentTimeMillis();
       //System.out.println(endTime-startTime);
//
       //-------------------------
//       baos = new ByteArrayOutputStream();
//       com.objectplanet.image.PngEncoder encoder = new com.objectplanet.image.PngEncoder();
//       startTime = System.currentTimeMillis();       
//       encoder.encode(bim,baos);
//       endTime = System.currentTimeMillis();
//       System.out.println(endTime-startTime);
//       FileOutputStream fos= new FileOutputStream(new File("C:\\Temp\\1.png"));
//       fos.write(baos.toByteArray());
//       fos.close();
//       
       //------------------------
//       baos = new ByteArrayOutputStream();
//       byte[] b = null;
//       boolean encodeAlpha = true;
//       com.keypoint.PngEncoder png =  new com.keypoint.PngEncoder( bim,
//               (encodeAlpha) ? com.keypoint.PngEncoder.ENCODE_ALPHA : com.keypoint.PngEncoder.NO_ALPHA);
//       png.setCompressionLevel(PngEncoder.FILTER_NONE);
//       startTime = System.currentTimeMillis();
//       b = png.pngEncode();
//       endTime = System.currentTimeMillis();
////       System.out.println(endTime-startTime);
//       FileOutputStream fos= new FileOutputStream(new File("C:\\Temp\\1.png"));
//       //fos.write(baos.toByteArray());
//       fos.write(b);
//       fos.close();
                    
       //--------------------------------------
       baos = new ByteArrayOutputStream();
       PNGTranscoder pngtr = new PNGTranscoder();
       pngtr.addTranscodingHint(PNGTranscoder.KEY_AOI,new Rectangle(0,0,10,10));
       //pngtr.addTranscodingHint(PNGTranscoder.KEY_MAX_HEIGHT,new Float(50.0));
       //pngtr.addTranscodingHint(PNGTranscoder.KEY_MAX_WIDTH,new Float(50.0));               
       pngtr.addTranscodingHint(PNGTranscoder.KEY_HEIGHT,new Float(10));
       pngtr.addTranscodingHint(PNGTranscoder.KEY_WIDTH,new Float(10));
       try {
    	System.out.println("start transcode");
        startTime = System.currentTimeMillis();        
        pngtr.transcode(new TranscoderInput(document),new TranscoderOutput(baos));                
        endTime = System.currentTimeMillis();
        } catch (TranscoderException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("end transcode");
        FileOutputStream fos= new FileOutputStream(new File("1.png"));
        fos.write(baos.toByteArray());
        fos.close();
        System.out.println("PNG from SVG: "+(endTime-startTime));
        

       //-------------------------------------
       long sum=0;
       for(int i=0;i<10;i++){
           for(int j=0;j<10;j++){
               baos = new ByteArrayOutputStream();
               pngtr = new PNGTranscoder();
               pngtr.addTranscodingHint(PNGTranscoder.KEY_AOI,new Rectangle(j*50,i*50,50,50));
               //pngtr.addTranscodingHint(PNGTranscoder.KEY_MAX_HEIGHT,new Float(50.0));
               //pngtr.addTranscodingHint(PNGTranscoder.KEY_MAX_WIDTH,new Float(50.0));               
               pngtr.addTranscodingHint(PNGTranscoder.KEY_HEIGHT,new Float(50.0));
               pngtr.addTranscodingHint(PNGTranscoder.KEY_WIDTH,new Float(50.0));
               try {
                startTime = System.currentTimeMillis();
                pngtr.transcode(new TranscoderInput(document),new TranscoderOutput(baos));                
                endTime = System.currentTimeMillis();
                } catch (TranscoderException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                System.out.println("write to file: "+i+"_"+j+".png");
                fos= new FileOutputStream(new File(i+"_"+j+".png"));
                fos.write(baos.toByteArray());
                fos.close();
                System.out.println(endTime-startTime);
                sum+=(endTime-startTime);
           }
       }
       System.out.println("total time: "+sum);
    }
    
    /**
     * Loads a svg resource from a URL, renders and returns the image.    
     * @param dimension desired size
     * @param document DocumentHolder
     * @return image of the rendered svg    
     */
    public static BufferedImage getImageFromSvg(SVGDocument document, Dimension dimension){
        // Load SVG resource into a document
        

        // Build the tree and get the document dimensions
        UserAgentAdapter userAgentAdapter = new UserAgentAdapter();
        BridgeContext bridgeContext = new BridgeContext(userAgentAdapter);
        GVTBuilder builder = new GVTBuilder();
        GraphicsNode graphicsNode = builder.build(bridgeContext,document);

        // Paint svg into image buffer
        BufferedImage bufferedImage = new BufferedImage(dimension.width,dimension.height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = (Graphics2D) bufferedImage.getGraphics();
        graphicsNode.paint(g2d);

        // Cleanup and return image
        g2d.dispose();
        return bufferedImage;
    }

    /**
     * @param uri
     * @return SVGDocument
     * @throws IOException
     */
    private static SVGDocument loadSVG(String uri) throws IOException {
        String parser = XMLResourceDescriptor.getXMLParserClassName();
        SAXSVGDocumentFactory f = new SAXSVGDocumentFactory(parser);
        SVGDocument document = (SVGDocument)f.createDocument(uri);
        return document;
    }


}
