package com.paintly;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStreamWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.SVGDocumentTools;

/**
 * @author AlexanderP
 * @version July 17, 2006
 */

public class ExportServlet extends HttpServlet {
	
	private static Logger log = Logger.getLogger(ExportServlet.class);
    
    public void doGet(HttpServletRequest req, HttpServletResponse resp){
        Cookie userid = findUserCookie(req);    
        if(userid!=null){
            doExport(req, resp,userid);
        }
    }
    
    private Cookie findUserCookie(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        for(int i=0;i<cookies.length;i++){            
            if(ConstantsBulk.USERIDCOOKIE.equals(cookies[i].getName())){
                return cookies[i];                 
            }            
        }
        return null;
    }
    
    
    /** 
     * Sends a file to the ServletResponse output stream. 
     * Typically you want the browser to receive a different name than the 
     * name the file has been saved in your local database, since 
     * your local names need to be unique. 
     *  @param req The request 
     *  @param resp The response
     *  @param userid cookie 
     */ 
    private void doExport( HttpServletRequest req, HttpServletResponse resp, Cookie userid){                   
        ServletOutputStream op = null;        
        HttpSession session = null;
        
        String fileName = "";
        String fileType = "";        
        try {
        	session = req.getSession();
        	
        	fileName = req.getParameter("filename");        	
        	if(fileName != null && fileName.length() > 20) fileName = fileName.substring(0,20);        	
        	
        	fileType = req.getParameter("filetype");        	
        	
        	
        	if(fileType != null && fileName != null){
        		String fullFileName = fileName + "." + fileType;        		
        		
        		CanvasScrapHolder canvas = (CanvasScrapHolder)session.getAttribute("canvasScrapHolder");
        		DocumentHolder document = (DocumentHolder)session.getAttribute("documentHolder");
        		ByteArrayOutputStream bos = exportDocument(fileName, fileType,(String)session.getAttribute("publish"),document,canvas.getRealWidth(),canvas.getRealHeight());
        		                
                resp.setContentType("application/force-download");
                resp.setContentLength(bos.size()); 
                resp.setHeader("Content- Disposition", "attachement; filename=\"" + fullFileName + "\"" );
                resp.setHeader("Content-Transfer-Encoding","binary");
                resp.setHeader("Pragma","no-cache");
                resp.setHeader("Expires","Mon, 26 Jul 1997 05:00:00 GMT");                
                
                log.debug("finish sets headers");
                op = resp.getOutputStream();
                
                //Stream to the requester.
                op.write(bos.toByteArray());                
                log.debug("writing to output stream finished without exceptions");
        	}
        } catch (IOException e) {
        	log.error(e.getMessage(),e);
        }
        finally{
            try {     
                if(op!=null)op.flush();
                if(op!=null)op.close();                
            } catch (IOException e) {
                log.error(e.getMessage(),e);
            } catch (Exception e) {
                log.error(e.getMessage(),e);
            }            
        }
      }
    
    private ByteArrayOutputStream exportDocument(String fileName, String fileType, String publishDir, DocumentHolder document, int realWidth, int realHeight){
    	ByteArrayOutputStream bos = new ByteArrayOutputStream();
    	BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(bos));
        Document svgDocument = SVGDocumentTools.assemble(document,realWidth,realHeight);        
        if(!"".equals(fileName) && !"".equals(fileType) && realWidth>0 && realHeight>0){
            if("svg".equals(fileType)){
              String stringDocument = SVGDocumentTools.serialize2SVG(svgDocument);
              if(!fileName.toLowerCase().endsWith(".svg")){
                  fileName+=".svg";
              }
              try {                
                bw.write(stringDocument);                
              } catch (IOException e) {
                log.error(e,e);
              }
              finally{
            	  try {
					bw.close();	
					bos.close();
				} catch (IOException e) {				
					log.error(e,e);
				}
              }
            }
        
            if("png".equals(fileType)){
                byte[] png = SVGDocumentTools.serialize2PNG(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".png")){
                    fileName+=".png";
                }
                try {                    
                    bos.write(png);                    
                } catch (FileNotFoundException e) {
                    log.error(e,e);
                } catch(IOException e){
                    log.error(e,e);
                }
                finally{
                	try {
						bos.close();
					} catch (IOException e) {
						log.error(e,e);
					}
                }
                
            }
            
            if("jpg".equals(fileType)){
                byte[] jpg = SVGDocumentTools.serialize2JPEG(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".jpg") && !fileName.toLowerCase().endsWith(".jpeg")){
                    fileName+=".jpg";
                }
                try {                    
                    bos.write(jpg);                    
                } catch (FileNotFoundException e) {
                    log.error(e,e);
                } catch(IOException e){
                    log.error(e,e);
                }
                finally{
                    try {
						bos.close();
					} catch (IOException e) {
						log.error(e,e);
					}
                }
            }
            
            if("tif".equals(fileType)){
                byte[] tif = SVGDocumentTools.serialize2TIFF(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".tif") && !fileName.toLowerCase().endsWith(".tiff")){
                    fileName+=".tiff";
                }
                try {                    
                    bos.write(tif);                    
                } catch (FileNotFoundException e) {
                    log.error(e,e);
                } catch(IOException e){
                    log.error(e,e);
                }
                finally{
                	try {
						bos.close();
					} catch (IOException e) {
						log.error(e,e);
					}
                }
            }
            
        }
        return bos;
    }
        
    
}

