package com.blinx;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.blinx.jssession.JsSessionMap;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.DocumentHolder;

/**
 * This servlet returns scrap image by its number.
 * @author slava 
 */
public class ScrapsServlet extends HttpServlet {
	private static Logger log = Logger.getLogger(ScrapsServlet.class);
	
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
		HttpSession session = null;				
		try {
			session = request.getSession(true);
			if (JsSessionMap.isNew(request)) {
				log.error("Request to the ScrapsServlet couldn't be in new session");
				return;
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

			if (request.getPathInfo() != null //client demanded scrap
					&& request.getPathInfo().indexOf(".PNG") > 0) {
				getImage(canvas, request, response);
			}
		}
		catch (Exception e) {
			log.error("Exception -> ", e);		
		}
	}
	
	private void getImage(CanvasScrapHolder canvas, HttpServletRequest request,
			HttpServletResponse response) {
		log.debug("sending " + request.getPathInfo());
		OutputStream os = null;
		byte[] scrapb64Encoded;
		try {
			response.setHeader("Cache-Control", "public"); //HTTP 1.1
			os = response.getOutputStream();
			int lastSlash = request.getPathInfo().lastIndexOf('/');
			int underlineIndex = request.getPathInfo().indexOf('_');
			int dot_png = request.getPathInfo().indexOf(".PNG");

			int x = Integer.parseInt(request.getPathInfo().substring(
					lastSlash + 1, underlineIndex));
			int y = Integer.parseInt(request.getPathInfo().substring(
					underlineIndex + 1, dot_png));

			scrapb64Encoded = canvas.getScrapData(y, x);
			response.setContentLength(scrapb64Encoded.length);

			response.setHeader("ETag", "W/\"14934-1146401672000\"");
			response.setDateHeader("Last-Modified",
					System.currentTimeMillis() - 5 * 24 * 3600000);
			os.write(scrapb64Encoded);

			canvas.removeDirtyScrap(y, x);

		} catch (IOException e) {
			log.error("IOException -> put image to response", e);
		} catch (Exception e) {
			log.error("Exception -> scrap coordinates are incorrect", e);
		} finally {
			if (os != null) {
				try {
					os.flush();
					os.close();
				} catch (IOException e) {
					log.error(e, e);
				}

			}

		}
	}	
}
