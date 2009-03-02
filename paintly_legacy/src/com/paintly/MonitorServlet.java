package com.paintly;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.paintly.renderer.ConstantsBulk;
/**
 * This servlet produces HTML focument that contains monitoring characteristics to be able to monitor sessions count, avaliable memory, etc. in the runtime
 * @author VyacheslavE
 * @version Jun 22, 2006
 */
public class MonitorServlet extends HttpServlet {
    private ServletContext servletContext;
    private Logger log = Logger.getLogger(MonitorServlet.class);

    /**
     * doGet
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response){
        doProcess(request,response);
    }
    
    /**
     * doPost
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response){
        doProcess(request,response);
    }

    private void doProcess(HttpServletRequest request, HttpServletResponse response) {
       System.gc();
       String html = "<HTML>";
       html += "Session Count: "+SessionListener.sessionCount+"<br />";
       html +="Total Memory: "+Runtime.getRuntime().totalMemory()+"<br />";
       html +="Avaliable Memory: "+Runtime.getRuntime().freeMemory()+"<br />";
       html += "</HTML>";
       Writer w = null;
    try {
        w = response.getWriter();
        w.write(html);        
    } catch (IOException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
    finally{
        try {
            w.close();
        } catch (IOException e) {
            log.error(e);
        }
    }
       
       
    }
    
    public void init(ServletConfig servletConfig){
       this.servletContext = servletConfig.getServletContext();
       servletContext.setAttribute(ConstantsBulk.SESSIONCOUNT,new Integer(0));
    }
}
