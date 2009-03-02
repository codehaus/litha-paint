package com.paintly;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.paintly.guidgen.RandomGUID;
import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentHolder;

/**
 * This is a base servlet
 * 
 * @author AlexanderP
 */

public class BaseServlet extends HttpServlet {

	private static Logger log = Logger.getLogger(BaseServlet.class);

	private Properties properties = null;

	private Parser parser = null;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		parser = new Parser();
		String prefix = getServletContext().getRealPath("/");
		String propertyFile = getInitParameter("paintly-init-file");
		try {
			properties = new Properties();
			properties.load(new FileInputStream(prefix + propertyFile));
			config.getServletContext().setAttribute(ConstantsBulk.PROPERTIES,
					properties);
		} catch (IOException e) {
			log.error("IOException -> Can't load propertyFile:" + propertyFile
					+ " " + e);
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		doProsess(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) {
		doProsess(request, response);
	}

	/**
	 * Processing the request
	 * 
	 * @param request
	 * @param response
	 */
	private void doProsess(HttpServletRequest request,
			HttpServletResponse response) {
		DocumentHolder document = null;
		CanvasScrapHolder canvas = null;
		PrintWriter out = null;
		HttpSession session = null;
		try {
			session = request.getSession(true);
			if (session.isNew()) {
				prepareNewSession(session, request, response);
			}
			response.setHeader("Cache-Control", "no-cache");
			document = (DocumentHolder) session.getAttribute("documentHolder");
			canvas = (CanvasScrapHolder) session
					.getAttribute("canvasScrapHolder");
			if (document == null || canvas == null) {
				log.error("document: " + document);
				log.error("canvas: " + canvas);
				log
						.error("Either document or canvas is null that means that for a new session isNew() returned false. To fix that in Tomcat, please clear \"work\" directory and restart tomcat.");
				return;
			}

			if (request.getPathInfo() != null
					&& request.getPathInfo().indexOf(".PNG") > 0) {
				getImage(canvas, request, response);
			} else {
				response.setContentType("text/xml");
				response.setCharacterEncoding("UTF-8");
				out = response.getWriter();
				String resp = "";
				// effort to prevent DOS attack from single user (will not work
				// for multiple users)
				synchronized (session) {
				CommandProcessor processor = new CommandProcessor(parser, properties);
					resp = processor.processCommand(request);
				}
				log.debug("result of processing: \n" + resp);
				// resp contains a numbers of srcapes that need to be refreshed
				// by browser
				out.write(resp);
			}

		} catch (IOException e) {
			log.error("IOException -> PrintWriter does not created", e);
			response.encodeRedirectURL("index.html");
		} catch (Exception e) {
			log.error("Exception -> ", e);
			response.encodeRedirectURL("index.html");
		}
	}

	private void prepareNewSession(HttpSession session,
			HttpServletRequest request, HttpServletResponse response) {
		log.debug("preparing new session");
		session.setMaxInactiveInterval(Integer.parseInt(properties
				.getProperty("invalidate_session_time")));
		Cookie[] cookies = request.getCookies();
		Cookie userid = null;
		if (cookies != null) {
			userid = findLithaCookie(cookies);
		}
		if (userid == null) {
			userid = prepareFirstTimeVisitor(response);
		}
		session.setAttribute(ConstantsBulk.USERIDCOOKIE, userid.getValue());
		session.setAttribute("save", properties.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR + userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("save.dir"));
		session.setAttribute("autosave", properties
				.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR
				+ userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("autosave.dir"));
		session.setAttribute("publish", properties.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR + userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("publish.dir"));
		session.setAttribute("documentHolder", new DocumentHolder());
		session.setAttribute("canvasScrapHolder", new CanvasScrapHolder(
				ConstantsBulk.DEFAULT_SCRAPSX, ConstantsBulk.DEFAULT_SCRAPSY,
				0, 0));
	}

	private Cookie prepareFirstTimeVisitor(HttpServletResponse response) {
		Cookie res = new Cookie(ConstantsBulk.USERIDCOOKIE, new RandomGUID()
				.toString());
		res.setMaxAge(60 * 60 * 24 * 365 * 10);
		createUserDirectoryStructure(res);
		response.addCookie(res);
		return res;
	}

	private Cookie findLithaCookie(Cookie[] cookie) {
		Cookie res = null;
		for (int i = 0; i < cookie.length; i++) {
			if (ConstantsBulk.USERIDCOOKIE.equals(cookie[i].getName())) {
				res = cookie[i];
			}
		}
		return res;
	}

	private void createUserDirectoryStructure(Cookie userid) {
		String save = properties.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR + userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("save.dir");
		new File(save).mkdirs();
		String autosave = properties.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR + userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("autosave.dir");
		new File(autosave).mkdirs();
		String publish = properties.getProperty("userspace.dir")
				+ ConstantsBulk.FILESEPARATOR + userid.getValue()
				+ ConstantsBulk.FILESEPARATOR
				+ properties.getProperty("publish.dir");
		new File(publish).mkdirs();
	}

	
	
	/**
	 * @param canvas
	 *            CanvasScrapHolder
	 * @param request
	 *            image name, which servlet shall be return
	 * @param response
	 */
	private void getImage(CanvasScrapHolder canvas, HttpServletRequest request,
			HttpServletResponse response) {
		log.debug("sending " + request.getPathInfo());
		OutputStream os = null;
		byte[] scrapb64Encoded;
		try {
			response.setHeader("Cache-Control", "public"); // HTTP 1.1
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