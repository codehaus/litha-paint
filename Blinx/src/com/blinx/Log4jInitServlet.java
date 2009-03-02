package com.blinx;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;


import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

/**
 * Initializer for Log4J
 * @author slava
 *
 */
public class Log4jInitServlet extends HttpServlet {

	private Logger log = Logger.getLogger(Log4jInitServlet.class);
	public void init(ServletConfig config) throws ServletException{		
        super.init(config);        
	    PropertyConfigurator.configure(Thread.currentThread().getContextClassLoader().getResource("log4j.properties"));		
		Properties properties  = new Properties();		
		try {
			properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("litha.properties"));
			config.getServletContext().setAttribute(ConstantsBulk.PROPERTIES, properties);
		} catch (IOException e) {
			log.error(e,e);
		}
			
	}
	
}