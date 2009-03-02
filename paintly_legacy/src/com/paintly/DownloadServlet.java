package com.paintly;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.paintly.renderer.ConstantsBulk;
/**
 * This servlet is intended to provide download of user private documents from server to client machine.
 * Before servlet starts download of file it should check if coookie is the same as name of direcotry it tries to download from
 * @author VyacheslavE
 * @version Jun 27, 2006
 * TODO: reported bug: the is always named export without mimetype. 
 */
public class DownloadServlet extends HttpServlet {    
    
	private static Logger log = Logger.getLogger(DownloadServlet.class);
    
    public void doGet(HttpServletRequest req, HttpServletResponse resp){
        Cookie userid = findUserCookie(req);    
        if(userid!=null){
            doDownload(req, resp,userid);
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
     *  @param userid
     *  */
    private void doDownload( HttpServletRequest req, HttpServletResponse resp, Cookie userid){      
        DataInputStream in = null;
        FileInputStream fis = null;
        ServletOutputStream op = null;
        try {
            String filename = extractFileName(req);
            if(filename.equals("")) return;
            Properties properties  = (Properties)getServletContext().getAttribute(ConstantsBulk.PROPERTIES);
            String homeDir = properties.getProperty("userspace.dir")+ConstantsBulk.FILESEPARATOR+userid.getValue()+ConstantsBulk.FILESEPARATOR+properties.getProperty("save.dir");
            File f = new File(homeDir+ConstantsBulk.FILESEPARATOR+filename); 
            int length = 0;                    
                                                 
            resp.setContentType("application/force-download");
            resp.setContentLength( (int)f.length() ); 
            resp.setHeader( "Content- Disposition", "attachement; filename=\"" + filename + "\"" );
            resp.setHeader("Content-Transfer-Encoding","binary");

            resp.setHeader ("Pragma","no-cache");
            resp.setHeader ("Expires","Mon, 26 Jul 1997 05:00:00 GMT");
            op = resp.getOutputStream();
 
            byte[] bbuf = new byte[4096];            
			fis = new FileInputStream(f);
            in = new DataInputStream(fis);            
            while ((in != null) && ((length = in.read(bbuf)) != -1)) {
                op.write(bbuf,0,length); 
            }                      
        } catch (IOException e) {
        	log.error("Download servlet: IOException -> : " + e.getMessage());
        }
        finally{
            try {
                in.close();
                fis.close();
                op.flush();
                op.close();                
            } catch (IOException e) {
                log.error("Download servlet: IOException -> : " + e.getMessage());
            } catch (Exception e) {
                log.error("Download servlet: Exception -> : " + e.getMessage());
            }
        }
      }

    private String extractFileName(HttpServletRequest req) {
        String res = "";
        String pathInfo = req.getPathInfo();        
        int index = pathInfo.lastIndexOf("/");
        if(index!=-1){
            res = pathInfo.substring(index+1);
        }        
        return res;
    }     

}

