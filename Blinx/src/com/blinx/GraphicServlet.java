package com.blinx;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.blinx.UrlCommandExctractor;
import com.blinx.buffer.ShapeBuffer;
import com.blinx.clientobjects.RegionHistory;
import com.blinx.command.Command;
import com.blinx.jssession.JsSessionMap;
import com.blinx.processor.Javascript;
import com.blinx.processor.ProcessorDispatcher;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.DocumentHolder;

import static com.blinx.jssession.JsSessionMap.extractJsSession;
import static com.blinx.jssession.JsSessionMap.extractSessionId;

/**
 * This servlet that accepts geometry related commands and return scraps numbers.<br />
 * @author slava 
 */
public class GraphicServlet extends HttpServlet {

	private static Logger log = Logger.getLogger(GraphicServlet.class);
	
	@Override
	protected void doGet(HttpServletRequest arg0, HttpServletResponse arg1) {
		doProcess(arg0, arg1);
	}

	@Override
	protected void doPost(HttpServletRequest arg0, HttpServletResponse arg1) {
		doProcess(arg0, arg1);
	}
	
	private void doProcess(HttpServletRequest request, HttpServletResponse response) {
		DocumentHolder document = null;
		CanvasScrapHolder canvas = null;
		PrintWriter out = null;
		HttpSession session = null;						
		try {
			session = request.getSession(true);
			if (session.isNew()) {
				log.debug("http session is new");
				prepareNewHttpSession(session, request, response);
			}
			if (JsSessionMap.isNew(request)) {
				log.debug("javascript session is new");
				prepareNewJsSession(session, request, response);
			}
			response.setHeader("Cache-Control", "no-cache");
			document = (DocumentHolder) extractJsSession(request).getAttribute(ConstantsBulk.DOCUMENT_HOLDER);
			canvas = (CanvasScrapHolder) extractJsSession(request)
					.getAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
			if (document == null || canvas == null) {
				log.error("document: " + document);
				log.error("canvas: " + canvas);
				log.error("Either document or canvas is null that means that for a new session isNew() returned false. To fix that in Tomcat, please clear \"work\" directory and restart tomcat.");
				return;
			}
			//client issued a geometric command 
			response.setContentType("text/javascript");
			response.setCharacterEncoding(ConstantsBulk.UTF8);
			out = response.getWriter();
			Javascript resp = new Javascript();
			//naive effort to prevent DOS attack from single user (will not work for multiple users)
			synchronized (session) {
				UrlCommandExctractor extractor = new UrlCommandExctractor();
				Command command = extractor.extractCommand(request);
				ProcessorDispatcher processorDispatcher = new ProcessorDispatcher(request);
				resp = processorDispatcher.process(command);				 									     															
			}
			log.debug("result of processing: \n" + resp);
			//resp contains a numbers of srcapes that need to be refreshed by browser
			out.write(resp.getContent());			
		} catch (IOException e) {
			log.error("IOException -> PrintWriter does not created", e);			
		} catch (Exception e) {
			log.error("Exception -> ", e);			
		} catch (Error e) {
			log.error("Error -> ",e);
		}
	}
	
	
	private void prepareNewHttpSession(HttpSession session,
			HttpServletRequest request, HttpServletResponse response) {
		log.debug("preparing new http session");
		Integer invalidateTime = Integer.valueOf(((Properties)session.getServletContext().getAttribute(ConstantsBulk.PROPERTIES)).getProperty(ConstantsBulk.SESSION_INVALIDATE_TIME));
		session.setMaxInactiveInterval(invalidateTime);
		JsSessionMap jsSessionMap = new JsSessionMap();		
		session.setAttribute("session",jsSessionMap);		
	}
	
	private void prepareNewJsSession(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
		log.debug("preparing new javascript session");
		JsSessionMap jsSessionMap = (JsSessionMap)session.getAttribute("session");
		jsSessionMap.newSession(extractSessionId(request));					
		extractJsSession(request).setAttribute(ConstantsBulk.DOCUMENT_HOLDER, new DocumentHolder());
		extractJsSession(request).setAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER, new CanvasScrapHolder(
				ConstantsBulk.DEFAULT_SCRAPSX, ConstantsBulk.DEFAULT_SCRAPSY,
				0, 0));
		extractJsSession(request).setAttribute(ConstantsBulk.REGION_HISTORY, new RegionHistory());
		extractJsSession(request).setAttribute(ConstantsBulk.SHAPE_BUFFER, new ShapeBuffer());
	}


  
}
