package com.paintly;

import java.awt.Point;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.devlib.schmidt.imageinfo.ImageInfo;

import sun.misc.BASE64Encoder;

import com.paintly.exception.LithaUploadResourceException;
import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.Renderer;
import com.paintly.renderer.shapes.Image;

/**
 * This servlet used for importing thirdparty Image into document
 * 
 * @author slava
 */
public class InsertImgServlet extends javax.servlet.http.HttpServlet {

	private class ProcessResult {
		/**
		 * Session canvasScrap Holder
		 */
		public CanvasScrapHolder canvas = null;

		/**
		 * Id of the imported Image in the document
		 */
		public int idd = 0;

		/**
		 * Width of the imported image
		 */
		public int width = 0;

		/**
		 * Height of the imported image
		 */
		public int height = 0;

		/**
		 * Constructor
		 * 
		 * @param canvas
		 * @param idd
		 * @param width
		 * @param height
		 */
		public ProcessResult(CanvasScrapHolder canvas, int idd, int width,
				int height) {
			this.canvas = canvas;
			this.idd = idd;
			this.width = width;
			this.height = height;
		}
	}

	private Logger log = Logger.getLogger(InsertImgServlet.class);

	public void doPost(HttpServletRequest req, HttpServletResponse res) {
		doProcess(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) {
		doProcess(req, res);
	}

	private void doProcess(HttpServletRequest req, HttpServletResponse res) {
		Cookie[] cookies = req.getCookies();
		Cookie userid = null;
		for (int i = 0; i < cookies.length; i++) {
			if (ConstantsBulk.USERIDCOOKIE.equals(cookies[i].getName())) {
				userid = cookies[i];
			}
		}

		// Create a factory for disk-based file items
		DiskFileItemFactory factory = new DiskFileItemFactory();

		// Set factory constraints
		factory.setSizeThreshold(ConstantsBulk.MAXFILESEIZEINMEMORY);

		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);

		// Set overall request size constraint
		upload.setSizeMax(ConstantsBulk.MAXALLOWEDFILESEIZE);

		// Parse the request
		ProcessResult result = null;
		
		res.setContentType("text/html");

		try {
			List items = upload.parseRequest(req);
			result = processUploadedItems(req, items, userid);
			
			if (result != null) {
				putAutoCloseJavascript(res, result.canvas, result.width,
						result.height, result.idd);
			} else {
				throw new LithaUploadResourceException("Resource wasn't uploaded.");
			}
			
		} catch (LithaUploadResourceException e) {
			log.error(e, e);			
			putAlertJavaScript(req, res, e.getMessage());
		} catch (Exception e) {
			log.error(e, e);
			putAlertJavaScript(req, res, "Resource wasn't uploaded. Maximum file size is 2M.");
		}
	}

	private void putAlertJavaScript(HttpServletRequest req,
			HttpServletResponse res, String message) {
		OutputStream os = null;
		PrintWriter pw = null;
		try {
			
			os = res.getOutputStream();
			pw = new PrintWriter(os);
			pw.print("<SCRIPT>\n");
			pw.write("alert(\"" + message + "\");");
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

	private void putAutoCloseJavascript(HttpServletResponse res,
			CanvasScrapHolder canvas, int width, int height, int idd) {
		log.debug("trying send javascript that closes upload window");
		if (canvas == null)
			return;
		OutputStream os = null;
		PrintWriter pw = null;
		try {
			os = res.getOutputStream();
			pw = new PrintWriter(os);
			Map dirtyRegs = canvas.getDirtyScraps();

			Iterator it = dirtyRegs.keySet().iterator();
			//pw.print("<HTML>\n");
			//pw.print("<BODY>\n");
			pw.print("<SCRIPT>\n");
			pw.print("parent.focusedImage = new Array('image',parent.canvas_x-parent.scrollVectorX ,parent.canvas_y-parent.scrollVectorY,"
							+ width + ", " + height + ", " + idd + ");\n");
			pw.print("parent.idd = " + idd + "\n");
			while (it.hasNext()) {
				Point p = (Point) it.next();
				pw.print("parent.updateScrap(" + p.x + "," + p.y + ");\n");
			}
			pw.print("parent.saveImageToUndoRedoLog(\"delete\");");
			pw.print("parent.drawFocusedImage();\n");
			pw.print("</SCRIPT>");
			res.setContentType("text/html");
			//pw.print("</BODY>");
			//pw.print("</HTML>");

		} catch (IOException e) {
			log.error(e, e);
		} finally {
			pw.close();
			try {
				os.close();
				res.flushBuffer();
			} catch (IOException e) {
				log.error(e, e);
			}
		}

	}

	private ProcessResult processUploadedItems(HttpServletRequest req,
			List list, Cookie userid) throws Exception {
		if (userid == null)
			return null;
		byte[] content = null;
		int d = 0;
		String str_d = "";
		boolean openFromUrl = false;

		Iterator it = list.iterator();
		while (it.hasNext()) {
			FileItem item = (FileItem) it.next();

			if (StringUtils.equalsIgnoreCase(item.getFieldName(), "curid")) {
				str_d = item.getString();
				log.debug("current ID = " + str_d);
			}

			if (StringUtils.equalsIgnoreCase(item.getFieldName(), "from_url")
					&& StringUtils.equalsIgnoreCase(item.getString(), "true")) {
				log.debug("open from URL");
				openFromUrl = true;
			}
		}

		int i = 0;
		while (i < str_d.length()) {
			int d1 = Integer.valueOf(str_d.charAt(i)) - 48;
			d += (d1) * Math.exp((str_d.length() - i - 1) * Math.log(10));
			i += 1;
		}

		if (openFromUrl) {
			content = uploadUrl(list, "url_imgname");
		} else {
			content = uploadFile(list, "imgname");
		}

		log.debug("Uploading item with id: " + d);

		if (content.length == 0) {
			throw new LithaUploadResourceException("Resource wasn't uploaded.");
		}

		ImageInfo ii = checkImage(content);

		String imgType = null;
		log.debug("got " + ii.getFormatName());

		if ("JPEG".equals(ii.getFormatName())) {
			imgType = ConstantsBulk.IMG_TYPE_JPG;
		} else if ("PNG".equals(ii.getFormatName())) {
			imgType = ConstantsBulk.IMG_TYPE_PNG;
		} else if ("GIF".equals(ii.getFormatName())
				|| "BMP".equals(ii.getFormatName())) {
			imgType = ConstantsBulk.IMG_TYPE_PNG;
			
			InputStream is = new ByteArrayInputStream(content);				
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			
			ImageIO.write(ImageIO.read(is), "png", baos);
			content = baos.toByteArray();
			baos.close();
			is.close();
			
		} else {
			log.error("Unsupported image format: " + ii.getFormatName());
			throw new LithaUploadResourceException(
					"Attemting to upload unsupported image format");
		}

		BASE64Encoder encoder = new BASE64Encoder();
		String encodedContent = encoder.encodeBuffer(content);
		encodedContent = encodedContent.replaceAll("\n", "");
		encodedContent = encodedContent.replaceAll("\r", "");
		double[][] transform = { { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } };

		Image image = new Image(encodedContent, d, 0, 0, ii.getWidth(), ii
				.getHeight(), transform, imgType);
		HttpSession session = req.getSession();
		CanvasScrapHolder canvas = (CanvasScrapHolder) session
				.getAttribute("canvasScrapHolder");
		DocumentHolder document = (DocumentHolder) session
				.getAttribute("documentHolder");
		Renderer renderer = new Renderer(canvas, document);
		renderer.addElement(image);
		renderer.renderDirtyRegionsOfTheDocument();
		return new ProcessResult(canvas, d, ii.getWidth(), ii.getHeight());

	}

	private ImageInfo checkImage(byte[] content) throws IOException {

		ImageInfo ii = new ImageInfo();
		InputStream is = new ByteArrayInputStream(content);
		ii.setInput(is);
		ii.check();
		is.close();
		return ii;
	}

	/**
	 * @param list
	 * @param fieldName
	 * @return byte[]
	 * @throws Exception 
	 */
	protected byte[] uploadUrl(List list, String fieldName) throws Exception{
		Iterator it = list.iterator();
		byte[] content = null;

		while (it.hasNext()) {
			FileItem item = (FileItem) it.next();

			if (StringUtils.equalsIgnoreCase(item.getFieldName(), fieldName)) {
				log.debug("resource opening from URL = " + item.getString());

				URL resourceUrl = new URL(item.getString());
				InputStream is = resourceUrl.openStream();				
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				
				ImageIO.write(ImageIO.read(is), "png", baos);
				content = baos.toByteArray();
				baos.close();
				is.close();
				
				if (content.length == 0) {
					throw new LithaUploadResourceException("Resource wasn't uploaded.");
				} else if(content.length > ConstantsBulk.MAXALLOWEDFILESEIZE) {
					throw new LithaUploadResourceException("Resource wasn't uploaded. Maximum file size is 2M.");
				}					

				return content;
			}
		}
		return null;
	}

	/**
	 * @param list
	 * @param fieldName
	 * @return byte[]
	 * @throws IOException
	 */
	protected byte[] uploadFile(List list, String fieldName) throws IOException {
		Iterator it = list.iterator();
		byte[] content = null;

		while (it.hasNext()) {
			FileItem item = (FileItem) it.next();

			if (StringUtils.equalsIgnoreCase(item.getFieldName(), fieldName)) {
				String fileName = FilenameUtils.getName(item.getFieldName());
				log.debug("Found " + fileName + " being uploaded");
				InputStream is = item.getInputStream();

				log.debug("trying to read " + fileName);
				content = new byte[is.available()];
				is.read(content);
				is.close();

				return content;
			}
		}
		return null;
	}

}
