package com.paintly;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.log4j.Logger;

import com.paintly.renderer.ConstantsBulk;

/**
 * This is a simple session counter
 * @author VyacheslavE
 * @version Jun 22, 2006
 */
public class SessionListener implements HttpSessionListener, ServletContextListener {
	/**
	 * Number of active sessions
	 */
    public static int sessionCount = 0;
    
    private Logger log = Logger.getLogger(SessionListener.class);
    
    public void sessionCreated(HttpSessionEvent event) {
        sessionCount++;
        log.debug("new session created");
        event.getSession().getServletContext().removeAttribute(ConstantsBulk.SESSIONCOUNT);
        event.getSession().getServletContext().setAttribute(ConstantsBulk.SESSIONCOUNT, new Integer(sessionCount));
    }

    public void sessionDestroyed(HttpSessionEvent event) {        
        sessionCount--;
        log.debug("session destroyed");
        event.getSession().getServletContext().removeAttribute(ConstantsBulk.SESSIONCOUNT);
        event.getSession().getServletContext().setAttribute(ConstantsBulk.SESSIONCOUNT, new Integer(sessionCount));
        
    }

    public void contextInitialized(ServletContextEvent arg0) {
        return;
        
    }

    public void contextDestroyed(ServletContextEvent arg0) {
        return;       
    }

}
