package com.blinx;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.blinx.buffer.ShapeBuffer;
import com.blinx.command.Command;
import com.blinx.command.CommandName;

import com.blinx.renderer.bridge.ShapeBridge;
import com.blinx.renderer.bridge.ShapeBridgeFactory;
import com.blinx.renderer.shapes.Shape;
import com.blinx.renderer.shapes.ShapeName;

/**
 * Parses incoming commands in url format
 * @author slava
 */
public class UrlParser {

	private static Logger log = Logger.getLogger(UrlParser.class);
	
	private HttpServletRequest source = null;
	private ShapeBuffer shapeBuffer = null;
		
	/**
	 * Simple constructor
	 * @param source
	 */
	public UrlParser(HttpServletRequest source) {		
		this.source = source;
		shapeBuffer = (ShapeBuffer) extractJsSession(source).getAttribute(ConstantsBulk.SHAPE_BUFFER);
	}

	/**
	 * Parse source 
	 * @return Command of objects
	 */
	public Command parseRequest() {

		log.debug("parse: " + source.getParameterNames());

		Command res = new Command();
		Map <String, String> requestParameters = createHash(source);
		Shape shape = null;

		CommandName commandName = CommandName.valueOf(requestParameters.get("type"));
		Map <String, String> bufferizedParameters = requestParameters;
		if (commandName != CommandName.buffering) {
			bufferizedParameters = shapeBuffer.throughputShape(requestParameters.get("command_id"), requestParameters);
			shape = createObject(bufferizedParameters);
		}				
		
		res.setCommandName(commandName);
		res.setAttributes(bufferizedParameters);		
		res.setShape(shape);
		return res;
	}

	private Shape createObject(Map<String,String> hmElement) {		
        Shape res = null;
		ShapeBridge shapeBridge = null;
        String shapeName = hmElement.get("shape");
        if (shapeName != null && shapeName.length()>0) {
        	ShapeName shape = ShapeName.valueOf(shapeName);
        	shapeBridge = ShapeBridgeFactory.createBridge(shape);         
        	res = shapeBridge.getShape(hmElement);
        }
        return res;
	}

	private Map<String,String> createHash(HttpServletRequest request) {
		Map<String, String> res = new HashMap<String, String>();		
		res.put("text", "");	
		for (Object key: request.getParameterMap().keySet()) {			
			res.put((String)key, request.getParameter((String)key));
		}				
		return res;
	}

}
