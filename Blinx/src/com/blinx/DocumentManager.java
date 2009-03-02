package com.blinx;

import java.awt.Point;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.devlib.schmidt.imageinfo.ImageInfo;
import org.w3c.dom.Document;

import sun.misc.BASE64Encoder;

import com.blinx.clientobjects.RegionHistory;
import com.blinx.exception.BlinxOpenDocumentException;
import com.blinx.exception.LithaUploadResourceException;
import com.blinx.jssession.JsSession;
import com.blinx.processor.ImageCommandProcessor;
import com.blinx.processor.Javascript;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.ConstantsBulk;
import com.blinx.renderer.Color;
import com.blinx.renderer.DocumentFragment;
import com.blinx.renderer.DocumentHolder;
import com.blinx.renderer.Renderer;
import com.blinx.renderer.SVGDocumentTools;
import com.blinx.renderer.shapes.Bezier;
import com.blinx.renderer.shapes.Image;
import com.blinx.renderer.shapes.Text;

/**
 * This utility class is intended for open/save operation with litha's documents
 * @author slava
 *
 */
public class DocumentManager {
	
	private static Logger log = Logger.getLogger(DocumentManager.class);
	
	private static class Util {
	    static Javascript buildErrorJavascript(String callback, Integer command_id) {
	    	Javascript res = new Javascript();
	    	res.appendChars(callback).appendChars("(").appendChars(command_id).appendLine(", 1);");
	    	return res;
		}

		static BufferedReader retrieveTextDocumentFromURL(GetMethod get) {
	        HttpClient httpclient = new HttpClient();        
	        BufferedReader res = null;
	        int httpCode = 404; // "resource not" found code by default
	        
	        try {            
				httpCode = httpclient.executeMethod(get);            
				res = new BufferedReader(new InputStreamReader(get.getResponseBodyAsStream()));			
	        } catch (IOException e) {
	            log.error(e,e);
	        }
	       return (httpCode==200)?res:null;
		}
		
		
		/**
	     * Parse litha's document, render, and save documentHolder and canvasScrapHolder into session.
	     * @param session session where canvasScrapHolder and document holder would be stored
	     * @param br Buffered Reader the document would be stored in
	     * @return the javascript that would populate regionHistory object
	     * @throws IOException if something go wrong
	     * @throws BlinxOpenDocumentException if can't read buffered reader
	     */
		static Javascript parseAndRenderDocument(JsSession session, BufferedReader br, String callback, int command_id) throws IOException, BlinxOpenDocumentException {
			Javascript res = new Javascript();
			res.appendChars("var litha_tmp_opendoc = ");
			String line = "";
			int recognizedRootElements = 0;
	          DocumentHolder documentHolder = new DocumentHolder();          
	          CanvasScrapHolder canvas = null;
	          RegionHistory regionHistory = new RegionHistory();
	          while((line = br.readLine())!=null){
	              if(line.indexOf("<documentholder")!=-1){
	            	  recognizedRootElements++;
	                  DocumentFragment docFrag;
	                  documentHolder.setBackgroundColor(extractBgColor(line));
	                  while((line = br.readLine()).indexOf("</documentholder>")==-1){                      
	                      if(line.indexOf("<bezier")>-1){
	                          Bezier bezier = new Bezier(line);                         
	                          docFrag = new DocumentFragment(bezier);
	                          documentHolder.addFragment(bezier.getID(),docFrag);
	                          regionHistory.put(bezier.getID(), bezier.toRegionHistoryElement());
	                      }
	                      else if(line.indexOf("<text")>-1){
	                          Text text = new Text(line);
	                          docFrag = new DocumentFragment(text);
	                          documentHolder.addFragment(text.getID(),docFrag);
	                          regionHistory.put(text.getID(), text.toRegionHistoryElement());
	                      }
	                      else if(line.indexOf("<image")>-1){
	                    	  Image image = new Image(line);                    	  
	                    	  docFrag = new DocumentFragment(image);
	                    	  documentHolder.addFragment(image.getID(),docFrag);
	                    	  regionHistory.put(image.getID(), image.toRegionHistoryElement());
	                      }                                            
	                  }
	                  session.setAttribute(ConstantsBulk.DOCUMENT_HOLDER, documentHolder);
	                  session.setAttribute(ConstantsBulk.REGION_HISTORY, regionHistory);
	              }
	              else if(line.indexOf("<canvas")!=-1){
	            	  recognizedRootElements++;
	                  canvas = new CanvasScrapHolder(line);
	                  session.setAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER,canvas);
	                  res.appendChars("'").appendChars(escapeJS(line)).appendChars("';");
	              }
	              else{
	                res.appendChars("'").appendChars(escapeJS(line)).appendLine("'+");
	              }
	          }
	          res.appendChars("_processOpen").appendChars("(").appendChars("litha_tmp_opendoc").appendLine(");");
	          res.appendChars(callback).appendChars("(").appendChars(command_id).appendLine(", 0);");
	          Renderer renderer = new Renderer(canvas,documentHolder);          
	          renderer.renderDocument();
	        if(recognizedRootElements<2) throw new BlinxOpenDocumentException("Document is corrupted");        
			return res;
		}
		private static String escapeJS(String line) {
			String res = line;
			res = res.replaceAll("\\\\","\\\\\\\\");
			res = res.replaceAll("'","\\\\'");
			return res;
		}

		private static Color extractBgColor(String line) {
			Color res = ConstantsBulk.COLOR_ALPHA;
			int bgColorPos = -1;
			if (line != null && (bgColorPos = line.indexOf("bgcolor=\"")) > -1) {
				int quotePos = -1;
				if ((quotePos = line.indexOf("\"",bgColorPos+9)) > -1 && quotePos >= bgColorPos+9) {
					String colorStr = line.substring(bgColorPos+9,quotePos);
					if (colorStr.length() > 0 ) {
						res = new Color(colorStr);
					}
				}				
			}
			return res;
		}

		/**
		 * Can render JPEGs and PNGs
		 * @param session
		 * @param content
		 * @param ii
		 * @return javascript
		 * @throws IOException 
		 */
		static Javascript renderImage(JsSession session, byte[] content, ImageInfo ii, String callback, int command_id) throws IOException {
			log.debug(ii.getFormatName() + " file has been found in request");
			Javascript res = new Javascript();
			BASE64Encoder encoder = new BASE64Encoder();
			String encodedContent = encoder.encodeBuffer(content);
			encodedContent = encodedContent.replaceAll("\n", "");
			encodedContent = encodedContent.replaceAll("\r", "");
			double[][] transform = { { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } };
			String imgType = null;
			if ("JPEG".equals(ii.getFormatName()) || "JPG".equals(ii.getFormatName())) {
				imgType = ConstantsBulk.IMG_TYPE_JPG;
			} else if ("PNG".equals(ii.getFormatName()) || "GIF".equals(ii.getFormatName()) || "BMP".equals(ii.getFormatName())) {			
				imgType = ConstantsBulk.IMG_TYPE_PNG;		
				InputStream is = new ByteArrayInputStream(content);				
				ByteArrayOutputStream baos = new ByteArrayOutputStream();				
				ImageIO.write(ImageIO.read(is), "png", baos);
				content = baos.toByteArray();
				baos.close();
				is.close();
				
			} else {
				res = Util.buildErrorJavascript(callback, command_id);
				return res;
			}


			Image image = new Image(encodedContent, 0, 0, 0, ii.getWidth(),
					ii.getHeight(), transform, imgType);
			
			log.debug("image object has been constructed");

			CanvasScrapHolder canvas = new CanvasScrapHolder((int) Math
					.round(Math.ceil(new Double(ii.getWidth())
							.doubleValue()
							/ new Double(ConstantsBulk.SCRAPWIDTH)
									.doubleValue())), (int) Math.round(Math
					.ceil(new Double(ii.getHeight()).doubleValue()
							/ new Double(ConstantsBulk.SCRAPHEIGHT)
									.doubleValue())), ii.getWidth(), ii
					.getHeight());
			session.setAttribute("canvasScrapHolder", canvas);
			DocumentHolder document = new DocumentHolder();
			session.setAttribute("documentHolder", document);
			Renderer renderer = new Renderer(canvas, document);
			renderer.addElement(image);
			renderer.renderDocument();
			
			log.debug("The document has been rendered.");
			
			res.appendLine("_openDocumentWithImageAsBackgroundStart("+canvas.getRealWidth()+","+canvas.getRealHeight()+","+canvas.getScrapsX()+","+canvas.getScrapsY()+");");
			Map dirtyRegs = canvas.getDirtyScraps();
			Iterator it = dirtyRegs.keySet().iterator();
			while (it.hasNext()) {
				Point p = (Point) it.next();
				res.appendLine("_updateScrap(" + p.x + "," + p.y + ");");
			}
			res.appendLine("_openDocumentWithImageAsBackgroundEnd();");			
			res.appendChars(callback).appendChars("(").appendChars(command_id).appendLine(", 0);");
			
			log.debug("The javascript has been pushed");
			return res;
		}
		
		private static void writeBinary(String fullPath, byte[] data) throws IOException {
			BufferedOutputStream bos = null;
		    bos = new BufferedOutputStream(new FileOutputStream(fullPath));
		    bos.write(data);
	        bos.close();
		    log.debug(fullPath + " has been writen.");
		}

		private static void writeTextual(String fullPath, String stringDocument) throws IOException {
			BufferedWriter bw=null;			  
		    bw = new BufferedWriter(new FileWriter(fullPath));
		    bw.write(stringDocument);
		    bw.close();
		    log.debug(fullPath+" has been writen");			 			 
		}

	}
	
	
	public static enum FormatName {LITHA, LTA, JPEG, JPG, SVG, TIFF, PNG, GIF, BMP}

	/**
	 * Reads litha-formatted document from the url, parses and renders it, stores ro the user session and return back to the client the information regionHistory could be restored from
	 * @param url url to the litha-paint document to be read
	 * @param session user's session to store the documentHolder and canvasScrapHolder
	 * @return the javascript that would populate regionHistory object 
	 * @throws BlinxOpenDocumentException if given file could not be readen
	 */
    public static Javascript openDocument(String url, JsSession session, String callback, int command_id, String formatNameParam) throws BlinxOpenDocumentException {
        Javascript res = new Javascript();
        FileReader fileReader=null;
        BufferedReader br = null;
        byte[] img = null;
        GetMethod get = null;
        FormatName formatName = null;
        try {          		  
		  log .debug("retrieving litha document from the url: "+url);
		  formatName = FormatName.valueOf(formatNameParam);
		  if (formatName == FormatName.LITHA || formatName == FormatName.LTA) {
			  get = new GetMethod(url);
			  br = Util.retrieveTextDocumentFromURL(get);
			  if (br != null) {
	        	  res = Util.parseAndRenderDocument(session, br, callback, command_id);          
	          }
	          else{
	        	  log.error("document doesn't exists on the url: "+url);
	        	  res = Util.buildErrorJavascript(callback, command_id);
	          }
		  } else {
			  try {
				img = ImageCommandProcessor.readImageFromUrl(url);
				ImageInfo ii = new ImageInfo();
				ii.setInput(new ByteArrayInputStream(img));
				ii.check();
				if(ii.getFormat()>=0 && ii.getFormat()<=10){ //hey, that's really image
					if ("PNG".equals(ii.getFormatName()) || "GIF".equals(ii.getFormatName()) || "BMP".equals(ii.getFormatName()) || "JPEG".equals(ii.getFormatName()) || "JPG".equals(ii.getFormatName())) {
						res = Util.renderImage(session, img, ii, callback, command_id);
					}
					else{ //sorry, don't support this image format yet
						res = Util.buildErrorJavascript(callback, command_id);					
					}				
				}
			  } catch (LithaUploadResourceException e) {
				  log.error(e,e);
				  res = Util.buildErrorJavascript(callback, command_id);
			  }
		  }
          
        } catch (Exception e) {
          log.error(e,e);
          res = Util.buildErrorJavascript(callback, command_id);
        } 
        finally{
        	try {
				if (br != null) {
					br.close();
				}
				if (fileReader != null) {
					fileReader.close();
				}
				if (get != null) {
			        get.releaseConnection();
				}
			} catch (IOException e) {
				log.error(e,e);
			}
        }
        return res;
    }



	/**
	 * Saves a document content into file
	 * @param fileName the name of the file the document would be saved in
	 * @param saveDir the name of a dir the file would be stored in	 * 
	 * @param canvas CanvasScrapHolder
	 * @return real path to the saved document or null in case of any error
	 */
	public static String performSaveDocument(String fileName, String saveDir,
			DocumentHolder document, CanvasScrapHolder canvas, RegionHistory regionHistory, String curFigureid) {
	
		// String saveDir = (String)session.getAttribute("save");
		// CanvasScrapHolder canvas = (CanvasScrapHolder
		// )session.getAttribute("canvasScrapHolder");
		FileOutputStream fileWriter = null;
		String pathToFile = null;
		try {
			fileName +=".lta";
			pathToFile = saveDir
					+ ConstantsBulk.FILESEPARATOR + fileName;
			fileWriter = new FileOutputStream(pathToFile);
			fileWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
					.getBytes());
			fileWriter.write(("<regionhistory curfigureid=\""+curFigureid+"\">").getBytes());
			fileWriter.write(regionHistory.toString().getBytes());
			fileWriter.write("</regionhistory>\n".getBytes());
			fileWriter.write("<document>\n".getBytes());
			fileWriter.write(document.toString().getBytes());
			fileWriter.write("\n".getBytes());			
			fileWriter.write(canvas.toString().getBytes());
			fileWriter.write("</document>".getBytes());
		} catch (IOException e) {
			log.error(e, e);
			pathToFile = null;
		} finally {
			try {
				if (fileWriter != null)
					fileWriter.close();
			} catch (IOException e) {
				log.error(e, e);
			}
		}
		return fileName;
	}
	
	/**
	 * Publish document that is stored in DocumentHolder into given file name of given file type.
	 * @param fileName name of file to publish
	 * @param fileType type of file to publish
	 * @param publishDir directory to publish
	 * @param document DocumentHolder that holds document being published
	 * @param realWidth width of document in pixels
	 * @param realHeight heights of document in pixels
	 * @return realpath to the document or null in case of serialization error
	 */
	public static String serializeDocument(String fileName, FormatName fileType, String publishDir, DocumentHolder document, int realWidth, int realHeight) {
		log.debug("going to publish "+fileName+" "+fileType);
        Document svgDocument = SVGDocumentTools.assemble(document,realWidth,realHeight);
        String fullPath = null;
        try{
	        if(!"".equals(fileName) && !"".equals(fileType) && realWidth>0 && realHeight>0){            
				fullPath = publishDir+ConstantsBulk.FILESEPARATOR+fileName;
				
				if(fileType == FormatName.SVG){
	              String stringDocument = SVGDocumentTools.serialize2SVG(svgDocument);
	              if(!fileName.toLowerCase().endsWith(".svg")){
	                  fileName+=".svg";
	                  fullPath+=".svg";
	              }
	              Util.writeTextual(fullPath, stringDocument);
	            }
	
	            if(fileType == FormatName.PNG){
	                byte[] png = SVGDocumentTools.serialize2PNG(svgDocument,realWidth,realHeight);
	                if(!fileName.toLowerCase().endsWith(".png")){
	                    fileName+=".png";
	                    fullPath+=".png";
	                }
	                Util.writeBinary(fullPath, png);
	
	            }
	
	            if(fileType == FormatName.JPEG || fileType == FormatName.JPG){
	                byte[] jpg = SVGDocumentTools.serialize2JPEG(svgDocument,realWidth,realHeight);
	                if(!fileName.toLowerCase().endsWith(".jpg") && !fileName.toLowerCase().endsWith(".jpeg")){
	                    fileName+=".jpg";
	                    fullPath+=".jpg";
	                }
	                Util.writeBinary(fullPath, jpg);
	            }
	
	            if(fileType == FormatName.TIFF){
	                byte[] tif = SVGDocumentTools.serialize2TIFF(svgDocument,realWidth,realHeight);
	                if(!fileName.toLowerCase().endsWith(".tif") && !fileName.toLowerCase().endsWith(".tiff")){
	                    fileName+=".tif";
	                    fullPath+=".tif";
	                }
	                Util.writeBinary(fullPath, tif);
	            }
	
	        }
        }
        catch( Exception e) {
        	fullPath = null;
        }
        return fileName;
    }

}