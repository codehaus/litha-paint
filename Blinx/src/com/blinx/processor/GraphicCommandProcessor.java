package com.blinx.processor;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.awt.Point;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.blinx.ConstantsBulk;
import com.blinx.clientobjects.RegionHistory;
import com.blinx.command.Command;
import com.blinx.command.CommandName;
import com.blinx.jssession.JsSession;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.Color;
import com.blinx.renderer.DocumentHolder;
import com.blinx.renderer.Renderer;
import com.blinx.renderer.shapes.ImageTransformation;
import com.blinx.renderer.shapes.Shape;

/**
 * Processor that knows how to process incoming graphic related commands
 * @author slava
 * 
 */
public class GraphicCommandProcessor {

	private Logger log = Logger.getLogger(GraphicCommandProcessor.class);
	private Renderer renderer = null;
	private JsSession session = null;
	private DocumentHolder document = null;
	private CanvasScrapHolder canvas = null;
	private RegionHistory regionHistory = null;
	
	
	
	/**
	 * Initialization of processor by request object
	 * 
	 * @param request
	 */
	public GraphicCommandProcessor(HttpServletRequest request) {
		session = extractJsSession(request);
		document = (DocumentHolder) session.getAttribute(ConstantsBulk.DOCUMENT_HOLDER);
		canvas = (CanvasScrapHolder) session.getAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
		regionHistory = (RegionHistory) session.getAttribute(ConstantsBulk.REGION_HISTORY);
		renderer = new Renderer(canvas, document);
		
	}

	/**
	 * Performs actions depending on command
	 * 
	 * @param command
	 *            incoming data along with the command
	 * @return result javascript that would be returned to the browser. This javascript would reread modified scraps. 
	 */
	public Javascript process(Command command) {
		CommandName processingType = command.getCommandName();
		Shape shape = command.getShape();
		Map<String,String> attributes = command.getAttributes();
		String id = attributes.get("id");
		
		if (processingType == CommandName.insert) {			
			processInsertCommand(shape);			
		}

		if (processingType == CommandName.update) {			
			processUpdateCommand(shape);			
		}		
		if (processingType == CommandName.delete) {
			
			renderer.deleteElement(id);			
			regionHistory.remove(Integer.parseInt(id));
		}
		
		if (processingType == CommandName.copy_image) {
			renderer.copyImage(new Integer(attributes.get("fromid")),(ImageTransformation) shape);
			regionHistory.put(new Integer(attributes.get("fromid")),shape.toRegionHistoryElement());
		}

		if (processingType == CommandName.bring_back) {
			renderer.bringBack(new Integer(id));
		}

		if (processingType == CommandName.bring_front) {
			renderer.bringFront(new Integer(id));
		}

		if (processingType == CommandName.bring_top) {
			renderer.bringTop(new Integer(id));
		}

		if (processingType == CommandName.bring_bottom) {
			renderer.bringBottom(new Integer(id));
		}
		
		if (processingType == CommandName.change_background) {
			Color background = new Color(attributes.get("background_color"));
			renderer.changeBackgroundColor(background);
		}
		
		renderer.renderDirtyRegionsOfTheDocument();
		
		return getScriptScraps(canvas);
		
	}

	private void processUpdateCommand(Shape shape) {
		log.info("updating "+ shape.getClass().getName());
		if (!(shape instanceof ImageTransformation)) {
			renderer.updateElement(shape);
			regionHistory.put(shape.getID(),shape.toRegionHistoryElement());
			log.debug("document updating completted successfully");
		} else if (shape instanceof ImageTransformation) {
			renderer.updateImage((ImageTransformation) shape);
			regionHistory.put(shape.getID(),shape.toRegionHistoryElement());
			log.debug("document updating with image completted successfully");
		}
	}

	private void processInsertCommand(Shape shape) {
		log.debug("inserting "+ shape.getClass().getName());
		if (!(shape instanceof ImageTransformation)) {
			renderer.addElement(shape);
			regionHistory.put(shape.getID(),shape.toRegionHistoryElement());
			log.debug("document updating completted successfully");
		} else if (shape instanceof ImageTransformation) {
			renderer.updateImage((ImageTransformation) shape);
			regionHistory.put(shape.getID(),shape.toRegionHistoryElement());
			log.debug("document updating with image completted successfully");
		}
	}
	
	/**
	 * The method retrieves numbers of dirty (not readen yet) scraps, transforms this
	 * numbers into javascript code an returns that string.
	 * 
	 * @param canvas
	 *            from number of dirty scraps being read
	 * @return numbers of dirty scraps separated by "|" and ",".
	 */
	public static Javascript getScriptScraps(CanvasScrapHolder canvas) {
		Set entries = canvas.getDirtyScraps().entrySet();
		Iterator it = entries.iterator();
		Javascript res = new Javascript();

		while (it.hasNext()) {
			Map.Entry entry = (Map.Entry) it.next();
			Point coordinate = (Point) entry.getKey();

			res.appendChars("_updateScrap(").appendChars(Math.round(coordinate.getX())).
			appendChars(",").appendChars(Math.round(coordinate.getY())).appendLine(");");					
		}
				
		return res;
	}

	
	
}
