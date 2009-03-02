package com.paintly;

import java.awt.Point;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.io.FilenameUtils;

import org.apache.log4j.Logger;
import org.devlib.schmidt.imageinfo.ImageInfo;

import sun.misc.BASE64Encoder;

import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.Utils;
import com.paintly.renderer.Renderer;
import com.paintly.renderer.shapes.Image;

/**
 * Servlet that handels uploading of the documents.
 *  
 * @author slava 
 */
public class UploadServlet extends javax.servlet.http.HttpServlet {
	
	private Logger log = Logger.getLogger(UploadServlet.class);

	public void doPost(HttpServletRequest req, HttpServletResponse res) {
		doProcess(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) {
		doProcess(req, res);
	}

	private void doProcess(HttpServletRequest req, HttpServletResponse res) {
		Cookie userid = findUseridAmoungCoockies(req);

		ServletFileUpload upload = setupUpload();

		res.setContentType("text/html");
		
		String clientObjects = generateClientObject(req, res, userid, upload);

		putJavascript1(req, res, clientObjects);
	}

	private String generateClientObject(HttpServletRequest req,
			HttpServletResponse resp, Cookie userid, ServletFileUpload upload) {
		String res = "";
		try {
			List items = upload.parseRequest(req);
			res = processUploadedItems(items, userid, req, resp);
		} catch (FileUploadException e) {
			log.error(e, e);
			putJavaScript2(req, resp);
		} catch (Exception e) {
			log.error(e, e);
			putJavaScript3(req, resp);
		}
		return res;
	}

	private ServletFileUpload setupUpload() {
		DiskFileItemFactory factory = new DiskFileItemFactory();

		factory.setSizeThreshold(ConstantsBulk.MAXFILESEIZEINMEMORY);

		ServletFileUpload upload = new ServletFileUpload(factory);

		upload.setSizeMax(ConstantsBulk.MAXALLOWEDFILESEIZE);
		return upload;
	}

	private Cookie findUseridAmoungCoockies(HttpServletRequest req) {
		Cookie[] cookies = req.getCookies();
		Cookie userid = null;
		for (int i = 0; i < cookies.length; i++) {
			if (ConstantsBulk.USERIDCOOKIE.equals(cookies[i].getName())) {
				userid = cookies[i];
			}
		}
		log.debug("found userid amoung coockies: " + userid);
		return userid;
	}

	private void putJavaScript3(HttpServletRequest req, HttpServletResponse res) {
		OutputStream os = null;
		PrintWriter pw = null;
		try {
			os = res.getOutputStream();
			pw = new PrintWriter(os);
			pw.print("<SCRIPT>\n");
			pw
					.write("alert('Error uploading file. You can upload JPEG, PNG or LiTha-Paint documents.')");
			pw.print("</SCRIPT>\n");
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		} finally {
			pw.close();
			try {
				os.close();
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}

	}

	private void putJavaScript2(HttpServletRequest req, HttpServletResponse res) {
		OutputStream os = null;
		PrintWriter pw = null;
		try {
			os = res.getOutputStream();
			pw = new PrintWriter(os);
			pw.print("<SCRIPT>\n");
			pw.write("alert('Error uploading file. Maximum file size is 2M.')");
			pw.print("</SCRIPT>\n");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(), e);
		} finally {
			pw.close();
			try {
				os.close();
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}

	}

	private void putJavascript1(HttpServletRequest req,
			HttpServletResponse res, String clientObjects) {
		try {
			OutputStream os = res.getOutputStream();
			PrintWriter pw = new PrintWriter(os);
			pw.print("<SCRIPT>\n");
			if (clientObjects.length() > 0) {
				pw.print("var str = '" + Utils.removeCRs(clientObjects) + "';");
				pw.print("parent.processOpen(str);");
			}
			pw.print("</SCRIPT>\n");
			pw.close();
			os.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e, e);
		}

	}

	private void putJavascript2(HttpServletRequest req,
			HttpServletResponse res, CanvasScrapHolder canvas) {
		if (canvas == null)
			return;
		OutputStream os = null;
		PrintWriter pw = null;
		try {
			os = res.getOutputStream();
			pw = new PrintWriter(os);
			Map dirtyRegs = canvas.getDirtyScraps();

			Iterator it = dirtyRegs.keySet().iterator();
			pw.print("<SCRIPT>\n");
			pw.write("parent.clearWorkSpace();\n");
			pw.write("parent.curFigureId = 1;\n");
			pw.write("parent.undoRedoLog = new Array();\n");
			pw.write("parent.undoRedoPtr = -1;\n");
			pw.write("parent.focusedBez = new Array();\n");
			pw.write("parent.focusedText = new Array();\n");
			pw.write("parent.regionHistory = new Array();\n");
			pw.print("parent.projectWidth = " + canvas.getRealWidth() + ";\n");
			pw
					.print("parent.projectHeight = " + canvas.getRealHeight()
							+ ";\n");
			pw.print("parent.scrapCountX = " + canvas.getScrapsX() + ";\n");
			pw.print("parent.scrapCountY = " + canvas.getScrapsY() + ";\n");
			pw
					.write("parent.scrapCount = parent.scrapCountX*parent.scrapCountY;\n");
			pw.write("parent.clearr();\n");
			pw.print("parent.initWorkSpace();\n");
			pw
					.print("parent.canvas.style.width = Math.min(parent.clientWidth-parent.canvas_x,parent.projectWidth);\n");
			pw
					.print("parent.canvas.style.height = Math.min(parent.clientHeight-parent.canvas_y,parent.projectHeight);\n");
			pw
					.print("parent.jg = new parent.jsGraphics('canvas',Math.min(parent.clientWidth-parent.canvas_x,parent.projectWidth),Math.min(parent.clientHeight-parent.canvas_y,parent.projectHeight));\n");
			while (it.hasNext()) {
				Point p = (Point) it.next();
				pw.print("parent.updateScrap(" + p.x + "," + p.y + ");\n");
			}

			pw.print("parent.canvas.style.display='block';\n");
			pw.print("parent.switchArrow();\n");

			pw.print("</SCRIPT>\n");

		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e, e);
		} finally {
			pw.close();
			try {
				os.close();
				res.flushBuffer();
			} catch (IOException e) {
				log.error(e,e);
			}
		}

	}

	
	private String processUploadedItems(List list, Cookie userid,
			HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String res = "";
		if (userid == null)
			return res;
		Iterator it = list.iterator();
		while (it.hasNext()) {
			FileItem item = (FileItem) it.next();
			log.debug("found uploaditem: " + item.getFieldName() + " "
					+ item.getName());
			String fileName = item.getName();
			if (fileName != null) {
				fileName = FilenameUtils.getName(fileName);
			}

			byte[] content = readFileItem(item);

			log.debug(fileName + " has been successfully readen");

			ImageInfo ii = new ImageInfo();
			ii.setInput(new ByteArrayInputStream(content));
			ii.check();

			HttpSession session = req.getSession();
			if(ii.getFormat()>=0 && ii.getFormat()<=10){ //hey, that's really image
				if ("PNG".equals(ii.getFormatName())
					|| "JPEG".equals(ii.getFormatName())) {
					renderImage(req, resp, content, ii, session);
				}
				else{ //sorry, don't support this image format yet
					putJavaScript3(req, resp);
				}
			} else { // this is not an image, assume that this is litha-paint document
				log.debug("uploaded item is not a image, so assume that this is a litha-paint document");
				InputStream is = item.getInputStream();
				InputStreamReader ir = new InputStreamReader(is);
				BufferedReader br = new BufferedReader(ir);				
				res = DocumentManager.parseAndRenderDocument(session, br);
				log.debug("litha-paint document has been successfully readed");
				if (br != null)
					br.close();
				if (ir != null)
					ir.close();
			}
		}
		return res;
	}

	private void renderImage(HttpServletRequest req, HttpServletResponse resp, byte[] content, ImageInfo ii, HttpSession session) {
		log.debug(ii.getFormatName() + " file has been found in request");
		BASE64Encoder encoder = new BASE64Encoder();
		String encodedContent = encoder.encodeBuffer(content);
		encodedContent = encodedContent.replaceAll("\n", "");
		encodedContent = encodedContent.replaceAll("\r", "");
		double[][] transform = { { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } };
		String imgType = ConstantsBulk.IMG_TYPE_JPG;
		if ("PNG".equals(ii.getFormatName())) {
			imgType = ConstantsBulk.IMG_TYPE_PNG;
		}

		Image image = new Image(encodedContent, 0, 0, 0, ii.getWidth(),
				ii.getHeight(), transform, imgType);
		
		log.debug("image object has been constructed");

		CanvasScrapHolder canvas = new CanvasScrapHolder((int) Math
				.round(Math.ceil(new Double(ii.getWidth())
						.doubleValue()
						/ new Double(ConstantsBulk.SCRAPWIDTH)
								.doubleValue())), (int) Math.round(Math
				.ceil(new Double(ii.getHeight()).doubleValue()
						/ new Double(ConstantsBulk.SCRAPHEIGHT)
								.doubleValue())), ii.getWidth(), ii
				.getHeight());
		session.setAttribute("canvasScrapHolder", canvas);
		DocumentHolder document = new DocumentHolder();
		session.setAttribute("documentHolder", document);
		Renderer renderer = new Renderer(canvas, document);
		renderer.addElement(image);
		renderer.renderDocument();
		
		log.debug("The document has been rendered.");
		
		putJavascript2(req, resp, canvas);
		
		log.debug("The javascript has been pushed");
	}

	private byte[] readFileItem(FileItem item) throws IOException {
		InputStream is = null;
		try {
			is = item.getInputStream();
			if (is.available() != 0) {
				byte[] content = new byte[is.available()];
				is.read(content);
				if (content.length != 0) {
					return content;
				}
			}
		} finally {
			if (is != null) {
				is.close();
			}
		}
		return new byte[0];
	}

}
