package com.blinx.processor;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.blinx.DocumentManager;
import com.blinx.clientobjects.RegionHistory;
import com.blinx.command.Command;
import com.blinx.command.CommandName;
import com.blinx.exception.BlinxOpenDocumentException;
import com.blinx.guidgen.RandomGUID;
import com.blinx.jssession.JsSession;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.Color;
import com.blinx.ConstantsBulk;
import com.blinx.renderer.DocumentHolder;
import com.blinx.renderer.Renderer;

/**
 * Processor of document management related command, such as open_document and save_document
 * @author slava
 *
 */
public class DocumentCommandProcessor {
	
	private Logger log = Logger.getLogger(DocumentCommandProcessor.class);
	private JsSession session = null;
	private DocumentHolder document = null;
	private CanvasScrapHolder canvas = null;
	private RegionHistory regionHistory = null;
	private Properties properties = null;
		
	/**
	 * Initialization of processor by request object
	 * 
	 * @param request
	 */
	public DocumentCommandProcessor(HttpServletRequest request) {
		session = extractJsSession(request);
		document = (DocumentHolder) session.getAttribute(ConstantsBulk.DOCUMENT_HOLDER);
		canvas = (CanvasScrapHolder) session.getAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
		regionHistory = (RegionHistory) session.getAttribute(ConstantsBulk.REGION_HISTORY);
		properties = (Properties)request.getSession().getServletContext().getAttribute(ConstantsBulk.PROPERTIES);
	}
	
	/**
	 * Performs actions depending on command
	 * 
	 * @param command
	 *            incoming data along with the command
	 * @return processing result or null (depending on command) 
	 * @throws BlinxOpenDocumentException if unable to open document
	 */
	public Javascript process(Command command) throws BlinxOpenDocumentException{
		Javascript res = null;
		CommandName processingType = command.getCommandName();		
		Map<String,String> attributes = command.getAttributes();

		if (processingType == CommandName.new_document) {
			document = new DocumentHolder();
			if(attributes.containsKey("background_color")) {
				String backgroundColorStr = attributes.get("background_color");				
				document.setBackgroundColor(new Color(backgroundColorStr));				
			}
			
			int scrapWidth = ConstantsBulk.SCRAPWIDTH;
			int scrapHeight = ConstantsBulk.SCRAPHEIGHT;

			// in pixels
			String documentWidth = attributes.get("document_width");
			double doubleDocumentWidth = Double.valueOf(documentWidth).doubleValue();
			if (doubleDocumentWidth > 2000) {
				doubleDocumentWidth = 2000;
			}
			// in pixels
			String documentHeight = attributes.get("document_height");
			double doubleDocumentHeight = Double.valueOf(documentHeight).doubleValue();
			if (doubleDocumentHeight > 2000) {
				doubleDocumentHeight = 2000;
			}

			canvas = new CanvasScrapHolder(
					(int) Math.ceil(doubleDocumentWidth
							/ Double.valueOf(String.valueOf(scrapWidth))
									.doubleValue()), (int) Math.ceil(doubleDocumentHeight
							/ Double.valueOf(String.valueOf(scrapHeight))
									.doubleValue()), (int)Math.round(doubleDocumentWidth), (int)Math.round(doubleDocumentHeight));
			
			regionHistory = new RegionHistory();

			session.removeAttribute(ConstantsBulk.DOCUMENT_HOLDER);
			session.removeAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
			session.removeAttribute(ConstantsBulk.REGION_HISTORY);
			session.setAttribute(ConstantsBulk.DOCUMENT_HOLDER, document);
			session.setAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER, canvas);
			session.setAttribute(ConstantsBulk.REGION_HISTORY, regionHistory);
			Renderer r = new Renderer(canvas,document);			
			r.renderDocument();
			res = GraphicCommandProcessor.getScriptScraps(canvas);
			
		}

		if (processingType == CommandName.open_document) {			
			log.debug("Begin processing command 'open_document'");
			String fileName = null;
			try{ 
				fileName = java.net.URLDecoder.decode(attributes.get("fileurl"),ConstantsBulk.UTF8);
			} catch (Exception e){
				fileName = "not_existant_url"; //DocumentManager.openDocument would fail with such url a bit later and creates a errorhandling javascript
			}			
			Integer command_id = Integer.parseInt(attributes.get("command_id"));
			String callbackFunction = attributes.get("callback");			
			log.debug("Trying to open '" + fileName + "'");
			res = DocumentManager.openDocument(fileName, session, callbackFunction, command_id, attributes.get("format_name"));
		}
		
		if (processingType == CommandName.save_document) {
			log.debug("Begin processing command 'save_document'");
			String fileName = new RandomGUID().toString();
			log.debug("trying to save");
			String curFigureId = attributes.get("curfigureid");
			String callbackMethodName = attributes.get("callback");
			Integer command_id = Integer.parseInt(attributes.get("command_id"));
			DocumentManager.FormatName formatName = DocumentManager.FormatName.valueOf(attributes.get("format_name"));			
			String userSpaceFolder = properties.getProperty(ConstantsBulk.USERSPACE_DIR_PROPERTY);
			String webPath = properties.getProperty(ConstantsBulk.WEB_DIR_PROPERTY); 
			String pathToFile = null;
			if (formatName == DocumentManager.FormatName.LITHA || formatName == DocumentManager.FormatName.LTA) {
			  pathToFile = DocumentManager.performSaveDocument(fileName,userSpaceFolder,document,canvas,regionHistory,curFigureId);
			} else {
		      pathToFile = DocumentManager.serializeDocument(fileName,formatName,userSpaceFolder,document, canvas.getRealWidth(), canvas.getRealHeight());
			}
			res = new Javascript();
			if (pathToFile != null) {
				res.appendLine(callbackMethodName+"("+command_id+", 0, '"+webPath+"/"+pathToFile+"');");
			} else {
				res.appendLine(callbackMethodName+"("+command_id+",1, null);");
			}
			
			
		}

		return res;
	}

}
