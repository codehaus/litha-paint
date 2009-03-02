package com.blinx.processor;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.awt.Point;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.devlib.schmidt.imageinfo.ImageInfo;

import sun.misc.BASE64Encoder;

import com.blinx.ConstantsBulk;
import com.blinx.clientobjects.RegionHistory;
import com.blinx.command.Command;
import com.blinx.command.CommandName;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.DocumentHolder;
import com.blinx.renderer.Renderer;
import com.blinx.exception.LithaUploadResourceException;
import com.blinx.jssession.JsSession;
import com.blinx.renderer.shapes.Image;

/**
 * Handles insert_image command.
 * @author slava
 *
 */
public class ImageCommandProcessor {
	
	private static class ImageInsertingResult {
		public int width = 0;
		public int height = 0;
		public int errorCode = 1;//0 - ok, 1 - error
		
		public ImageInsertingResult(int width, int height, int errorCode) {
			this.width = width;
			this.height = height;
			this.errorCode = errorCode;
		}
		
		public String toString(){
			return "{width:"+width+", height:"+height+", errorCode:"+errorCode+"}";
		}
	}
	
	private Logger log = Logger.getLogger(GraphicCommandProcessor.class);
	private Renderer renderer = null;
	private JsSession session = null;
	private DocumentHolder document = null;
	private CanvasScrapHolder canvas = null;
	private RegionHistory regionHistory = null;
	private String callbackJavascriptFunction = null;

	
	public ImageCommandProcessor(HttpServletRequest request) {
		session = extractJsSession(request);
		document = (DocumentHolder) session.getAttribute(ConstantsBulk.DOCUMENT_HOLDER);
		canvas = (CanvasScrapHolder) session.getAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
		regionHistory = (RegionHistory) session.getAttribute(ConstantsBulk.REGION_HISTORY);
		renderer = new Renderer(canvas, document);
	}

	/**
	 * Performs actions depending on command
	 * @param command
	 * @return javascript
	 */
	public Javascript process(Command command) {
		CommandName processingType = command.getCommandName();		
		Map<String,String> attributes = command.getAttributes();
		ImageInsertingResult insertingResult = null;
		int id = 0;
		int command_id = 0;
		if (processingType == CommandName.insert_image) {			
			id = Integer.parseInt(attributes.get("id"));
			command_id = Integer.parseInt(attributes.get("command_id"));
			callbackJavascriptFunction = attributes.get("callback");			
			String url = null;
			try {
				url = java.net.URLDecoder.decode(attributes.get("url"),ConstantsBulk.UTF8);
			} catch (UnsupportedEncodingException e) {
				url = "not_existant_url"; //performInsertImageCommand would fail with such url a bit later and creates a errorhandling javascript
			}
			insertingResult = performInsertImageCommand(id, url);			
		}

		return buildJavascript(id, command_id, insertingResult);
	}

	private Javascript buildJavascript(int id, int command_id, ImageInsertingResult result) {
		Javascript res = null;		
		if (result.errorCode == 0) {
			res = buildSuccessJavascript(id, command_id, result);
		} else if (result.errorCode == 1) {
			res = buildErrorJavascript(id, command_id, result);
		}
		
		return res;
	}

	private Javascript buildErrorJavascript(int id, int command_id, ImageInsertingResult result) {
		Javascript res = new Javascript();
		if (callbackJavascriptFunction != null) {
			res.appendLine(callbackJavascriptFunction+"("+command_id+", 1);");
		}
		return res;
	}

	private Javascript buildSuccessJavascript(int id, int command_id, ImageInsertingResult result) {
		Javascript res = new Javascript();
		Map dirtyRegs = canvas.getDirtyScraps();

		Iterator it = dirtyRegs.keySet().iterator();
		res.appendLine("_setFocusedImage(new Array('image', 0, 0,"+ result.width + ", " + result.height + ", " + id + "));");		
		while (it.hasNext()) {
			Point p = (Point) it.next();
			res.appendLine("_updateScrap(" + p.x + "," + p.y + ");");
		}		
		res.appendLine("_saveImageToUndoRedoLog(\"delete\");");
		res.appendLine("_drawFocusedImage();");
		if (callbackJavascriptFunction != null){
			res.appendLine(callbackJavascriptFunction+"("+command_id+", 0);");
		}
		return res;
	}

	private ImageInsertingResult performInsertImageCommand(Integer id, String url) {
		ImageInsertingResult res = new ImageInsertingResult(0,0,1);
		ImageInfo imageInfo = null;
		byte[] pngImage;
		try {
			pngImage = readImageFromUrl(url);
			imageInfo = buildImageInfo(pngImage);
			BASE64Encoder encoder = new BASE64Encoder();
			String encodedContent = encoder.encodeBuffer(pngImage);
			encodedContent = encodedContent.replaceAll("\n", "");
			encodedContent = encodedContent.replaceAll("\r", "");
			double[][] transform = { { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } };
			Image image = new Image(encodedContent, id, 0, 0, imageInfo.getWidth(), imageInfo
					.getHeight(), transform, ConstantsBulk.IMG_TYPE_PNG);
			renderer.addElement(image);
			renderer.renderDirtyRegionsOfTheDocument();
			regionHistory.put(id,image.toRegionHistoryElement());
			res = new ImageInsertingResult(imageInfo.getWidth(), imageInfo.getHeight(), 0);
		} catch (LithaUploadResourceException e) {
			log.error(e,e);
		} catch (IOException e) {
			log.error(e,e);
		}		
		
		return res;		
		
	}
	
	public static byte[] readImageFromUrl(String url) throws LithaUploadResourceException {
		byte [] res = null;		
		URL resourceUrl;
		try {
			resourceUrl = new URL(url);				
			InputStream is = resourceUrl.openStream();				
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			
			ImageIO.write(ImageIO.read(is), "png", baos);
			res = baos.toByteArray();
			baos.close();
			is.close();		
			if (res.length == 0) {
				throw new LithaUploadResourceException("Resource wasn't uploaded.");
			} else if(res.length > ConstantsBulk.MAXALLOWEDFILESEIZE) {
				throw new LithaUploadResourceException("Resource wasn't uploaded. Maximum file size is 2M.");
			}					
		} catch (MalformedURLException e) {
			throw new LithaUploadResourceException(e.toString());
		} catch (Exception e) { 
			throw new LithaUploadResourceException(e.toString());
		}

		return res;	
	}
	
	private ImageInfo buildImageInfo(byte[] content) throws IOException {

		ImageInfo ii = new ImageInfo();
		InputStream is = new ByteArrayInputStream(content);
		ii.setInput(is);
		ii.check();
		is.close();
		return ii;
	}


}
