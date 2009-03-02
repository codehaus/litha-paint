package com.blinx.jssession;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.blinx.GraphicServlet;

/**
 * There are several javascript sessions possible in bounds of one http session. 
 * This class stores javascript sessions by sessionId key.
 * @author slava
 *
 */
public class JsSessionMap {
	private static Logger log = Logger.getLogger(JsSessionMap.class);
	
	private Map<String,JsSession> sessions = new HashMap<String,JsSession>();
	
	public static String extractSessionId(HttpServletRequest request) {
		return request.getParameter("session_id");
	}
	
	public static JsSession extractJsSession(HttpServletRequest request) {
		return ((JsSessionMap) request.getSession().getAttribute("session")).getSession(request.getParameter("session_id"));
	}
	
	public JsSession getSession(String sessionId) {
		return sessions.get(sessionId);
	}
	
	public void newSession(String sessionId) {
		sessions.put(sessionId,new JsSession());
	}

	public static boolean isNew(HttpServletRequest request) {
		boolean new1 = request.getSession().isNew();
		boolean new2 = request.getSession().getAttribute("session") == null;
		boolean new3 = request.getParameter("session_id") == null;
		JsSessionMap session = (JsSessionMap)request.getSession().getAttribute("session");
		boolean new4 = (session == null);
				
		boolean new5 = ((session != null && session.getSession(request.getParameter("session_id")) == null));
		log.debug(new1+" "+new2+" "+new3+" "+new4+" "+new5);
			
		return (new1 || new2 || new3 || new4 || new5);

	}

}
