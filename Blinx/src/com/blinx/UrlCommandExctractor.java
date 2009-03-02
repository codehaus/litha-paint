package com.blinx;

import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;
import com.blinx.command.Command;

/**
 * Command processor for url data transmittion mode.
 * 
 * @author slava
 * 
 */
public class UrlCommandExctractor{
	
	private Logger log = Logger.getLogger(UrlCommandExctractor.class);
	
	/**
	 * @param request
	 *            svg command from request parameter 'object'
	 * @return string
	 */
	public Command extractCommand(HttpServletRequest request) {
		log.debug("processing command");						
		Command res = null;		
		UrlParser parser = new UrlParser(request);		
		res = parser.parseRequest();						
		return res;
	}

	
}
