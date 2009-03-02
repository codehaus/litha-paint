package com.paintly;

import java.awt.Point;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.xmlpull.v1.XmlPullParserException;

import com.paintly.clientObjects.ClientObject;
import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.Renderer;
import com.paintly.renderer.shapes.ImageTransformation;
import com.paintly.renderer.shapes.Shape;

/**
 * command processor
 * @author slava
 *
 */
public class CommandProcessor {
	

	private Logger log = Logger.getLogger(CommandProcessor.class);
	
	private Parser parser = null;
	
	private Properties properties = null;

	private Renderer renderer = null;

	private HttpSession session = null;

	private String publishAttribute = null;

	private String saveAttribute = null;

	private String cookieAttribute = null;

	private DocumentHolder document = null;

	private CanvasScrapHolder canvas = null;

	
	/**
	 * Constructor
	 * @param parser
	 * @param props
	 */
	
	public CommandProcessor(Parser parser, Properties props) {		
		this.parser = parser;
		this.properties = props;
	}



	/**
	 * @param request
	 *            svg command from request parameter 'object'
	 * @return string
	 */
	public String processCommand(HttpServletRequest request){
		List svgObjectList  = new ArrayList();
		// processing input data
		try{
			svgObjectList = prepareProcessing(request);

			if (svgObjectList.size() < 1)
				throw new XmlPullParserException(
						"Document is non-well formated.");


			String processingType = (String) ((HashMap) svgObjectList.get(0))
					.get("type");
	
			if (processingType.equals("insert")) {
				for (int i = 1; i < svgObjectList.size(); i++) {
					log.debug("inserting "
							+ svgObjectList.get(i).getClass().getName());
					if (svgObjectList.get(i) instanceof Shape
							&& !(svgObjectList.get(i) instanceof ImageTransformation)) {
						renderer.addElement((Shape) svgObjectList.get(i));
						log.debug("document updating completted successfully");
					} else if (svgObjectList.get(i) instanceof ImageTransformation) {
						renderer
								.updateImage((ImageTransformation) svgObjectList
										.get(i));
						log
								.debug("document updating with image completted successfully");
					}
				}
			}
	
			if (processingType.equals("update")) {
				for (int i = 1; i < svgObjectList.size(); i++) {
					log.info("updating "
							+ svgObjectList.get(i).getClass().getName());
					if (svgObjectList.get(i) instanceof Shape
							&& !(svgObjectList.get(i) instanceof ImageTransformation)) {
						renderer.updateElement((Shape) svgObjectList.get(i));
						log.debug("document updating completted successfully");
					} else if (svgObjectList.get(i) instanceof ImageTransformation) {
						renderer
								.updateImage((ImageTransformation) svgObjectList
										.get(i));
						log
								.debug("document updating with image completted successfully");
					}
				}
			}
	
			if (processingType.equals("delete")) {
	
				renderer
						.deleteElement((String) ((HashMap) svgObjectList.get(0))
								.get("id"));
			}
	
			if (processingType.equals("new_document")) {
	
				document = new DocumentHolder();
	
				int scrapWidth = ConstantsBulk.SCRAPWIDTH;
				int scrapHeight = ConstantsBulk.SCRAPHEIGHT;
	
				// width of document in pixels
				String documentWidth = (String) ((HashMap) svgObjectList.get(0))
						.get("document_width");
				// height of document in pixels
				String documentHeight = (String) ((HashMap) svgObjectList
						.get(0)).get("document_height");
	
				canvas = new CanvasScrapHolder((int) Math.ceil(Double.valueOf(
						documentWidth).doubleValue()
						/ Double.valueOf(String.valueOf(scrapWidth))
								.doubleValue()), (int) Math.ceil(Double
						.valueOf(documentHeight).doubleValue()
						/ Double.valueOf(String.valueOf(scrapHeight))
								.doubleValue()), Integer
						.parseInt(documentWidth), Integer
						.parseInt(documentHeight));
	
				session.removeAttribute("documentHolder");
				session.removeAttribute("canvasScrapHolder");
				session.setAttribute("documentHolder", document);
				session.setAttribute("canvasScrapHolder", canvas);
	
			}
	
			if (processingType.equals("save_workstate")) {
				List textContents = new ArrayList();
				for (int i = 1; i < svgObjectList.size(); i++) {
					textContents.add(((ClientObject) svgObjectList.get(i))
							.toString()
							+ "\n");
				}
				textContents.add(document.toString());
	
				DocumentManager.performSaveWorkspace(textContents, session);
			}
				
			if (processingType.equals("open_workstate")) {
				return DocumentManager.openWorkstate(cookieAttribute,
						(String) session.getAttribute("autosave"), session);
			}
				
			if (processingType.equals("save_document")) {
	
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				String saveDir = saveAttribute;
				List textContents = new ArrayList();
				for (int i = 1; i < svgObjectList.size(); i++) {
					textContents.add(((ClientObject) svgObjectList.get(i))
							.toString()
							+ "\n");
				}
	
				textContents.add(document.toString());
	
				DocumentManager.performSaveDocument(fileName, saveDir, textContents, canvas);
			}
	
			if (processingType.equals("open_document")) {
				log.debug("Got command 'open_document'");
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				log.debug("Trying to open '" + fileName + "'");
				return DocumentManager.openDocument(fileName, saveAttribute, session);
			}
	
			if (processingType.equals("exception")) {
				String dirName = properties.getProperty("clientexception.dir");
				String text = (String) ((HashMap) svgObjectList.get(0))
						.get("text");
				BufferedWriter bw = new BufferedWriter(new FileWriter(dirName
						+ ConstantsBulk.FILESEPARATOR + "exceptions.xml", true));
				bw.write("<exception date=\"" + new Date() + "\" >\n");
				bw.write(text + "\n");
				bw.write("</exception>");
				bw.close();
			}
	
			if (processingType.equals("list")) {
				return DocumentManager.listFiles(saveAttribute);
			}
	
			if (processingType.equals("iffileexists")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				return DocumentManager.ifFileExists(cookieAttribute, fileName,
						saveAttribute, session);
			}
	
			if (processingType.equals("delete_document")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				if (!fileName.equals(""))
					DocumentManager.deleteDocument(cookieAttribute,
							fileName, saveAttribute,
							session);
				return "";
			}
	
			
			if (processingType.equals("publish_document")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				String fileType = (String) ((HashMap) svgObjectList.get(0))
						.get("filetype"); // svg, png, jpg or tif
				log.debug("got publish command for " + fileName + "."
						+ fileType);
				return "<resp>"
						+ DocumentManager
								.publishDocument(
										fileName,
										fileType,
										publishAttribute,
										document,
										canvas.getRealWidth(),
										canvas.getRealHeight(),
										cookieAttribute)
						+ "</resp>";
			}
	
			if (processingType.equals("unpublish_document")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				DocumentManager.unpublishDocument(fileName, publishAttribute);
			}
	
			if (processingType.equals("republish_document")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				DocumentManager.republishDocument(fileName, publishAttribute);
			}
	
			if (processingType.equals("delete_published_document")) {
				String fileName = (String) ((HashMap) svgObjectList.get(0))
						.get("filename");
				if (!fileName.equals(""))
					DocumentManager.deletePublishedDocument(fileName, publishAttribute);
			}
	
			if (processingType.equals("list_published_documents")) {
				return DocumentManager.listPublishedFiles(cookieAttribute,
						publishAttribute, session);
			}
	
			if (processingType.equals("copy_image")) {
				renderer.copyImage(
						new Integer((String) ((HashMap) svgObjectList.get(0))
								.get("fromid")),
						(ImageTransformation) svgObjectList.get(1));
			}
	
			if (processingType.equals("bring_back")) {
				renderer.bringBack(new Integer(
						(String) ((HashMap) svgObjectList.get(0)).get("id")));
			}
	
			if (processingType.equals("bring_front")) {
				renderer.bringFront(new Integer(
						(String) ((HashMap) svgObjectList.get(0)).get("id")));
			}
	
			if (processingType.equals("bring_top")) {
				renderer.bringTop(new Integer((String) ((HashMap) svgObjectList
						.get(0)).get("id")));
			}
	
			if (processingType.equals("bring_bottom")) {
				renderer.bringBottom(new Integer(
						(String) ((HashMap) svgObjectList.get(0)).get("id")));
			}
	
			renderer.renderDirtyRegionsOfTheDocument();
			return getXmlScraps(canvas);
	
		} catch (IOException e) {
			log.error("IOException -> Input stream processing exception", e);
		} catch (Exception e) {
			log.error("Exception -> " + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * The method retrieves numbers of dirty (not readen yet) scraps, joins its
	 * numbers into text strings an returns that string.
	 * 
	 * @param canvas
	 *            from number of dirty scraps being read
	 * @return numbers of dirty scraps separated by "|" and ",".
	 */
	private String getXmlScraps(CanvasScrapHolder canvas) {
		Set entries = canvas.getDirtyScraps().entrySet();
		Iterator it = entries.iterator();
		StringBuffer scrapeOutXML = new StringBuffer("<response>");

		while (it.hasNext()) {
			Map.Entry entry = (Map.Entry) it.next();
			Point coordinate = (Point) entry.getKey();

			scrapeOutXML.append(Math.round(coordinate.getX()) + ","
					+ Math.round(coordinate.getY()) + "|");

		}

		scrapeOutXML.append("</response>\n");
		return scrapeOutXML.toString();
	}
	
	private List prepareProcessing(HttpServletRequest request){
		log.debug("processing command");
		StringBuffer sBuff = new StringBuffer();		
		initFields(request);
		List res = new ArrayList();
			
		try {
			if (!StringUtils.isEmpty(request.getParameter("object"))) {
				
					sBuff.append(URLDecoder.decode(request.getParameter("object"),
							"UTF-8"));
					
			} else {
	
				BufferedReader br = new BufferedReader(new InputStreamReader(
						request.getInputStream()));
				sBuff.append(br.readLine());
	
			}
	
			if (sBuff == null || sBuff.length() == 0 || "null".equals(sBuff)) {
				log.error("InputStream is empty");
				return res;
			}
	
			res = parser.parseRequest(sBuff);
	
		} catch (UnsupportedEncodingException e) {
			log.error(e,e);		
		} catch (IOException e) {
			log.error(e,e);
		}
		return res;

	}



	private void initFields(HttpServletRequest request) {
		session = request.getSession();
		publishAttribute = (String)session.getAttribute("publish");
		saveAttribute = (String) session.getAttribute("save");
		cookieAttribute = (String) session.getAttribute(ConstantsBulk.USERIDCOOKIE);
		document = (DocumentHolder) session
				.getAttribute("documentHolder");
		canvas = (CanvasScrapHolder) session
				.getAttribute("canvasScrapHolder");
		renderer = new Renderer(canvas, document);
	}



}
