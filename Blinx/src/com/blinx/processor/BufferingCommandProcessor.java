package com.blinx.processor;

import static com.blinx.jssession.JsSessionMap.extractJsSession;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.blinx.ConstantsBulk;
import com.blinx.buffer.Attribute;
import com.blinx.buffer.ShapeBuffer;
import com.blinx.buffer.Value;
import com.blinx.clientobjects.RegionHistory;
import com.blinx.command.Command;
import com.blinx.command.CommandName;
import com.blinx.jssession.JsSession;
import com.blinx.renderer.CanvasScrapHolder;
import com.blinx.renderer.DocumentHolder;

/**
 * This processor allows packet-oriented data transmitting from browser to server (remember limitation of url length for GET request).
 * First, second and following packets should have: command="buffering", command_id="XXX", data.
 * Last packet should have: command_id="XXX", command="real_command" and remaining data. command_id attribute should be the same among all command packets.. 
 * @author slava
 *
 */
public class BufferingCommandProcessor {
	private Logger log = Logger.getLogger(BufferingCommandProcessor.class);
	private JsSession session = null;
	private DocumentHolder document = null;
	private CanvasScrapHolder canvas = null;
	private RegionHistory regionHistory = null;
	private ShapeBuffer shapeBuffer = null;
	
	public BufferingCommandProcessor(HttpServletRequest request) {
		session = extractJsSession(request);
		document = (DocumentHolder) session.getAttribute(ConstantsBulk.DOCUMENT_HOLDER);
		canvas = (CanvasScrapHolder) session.getAttribute(ConstantsBulk.CANVAS_SCRAP_HOLDER);
		regionHistory = (RegionHistory) session.getAttribute(ConstantsBulk.REGION_HISTORY);
		shapeBuffer = (ShapeBuffer) session.getAttribute(ConstantsBulk.SHAPE_BUFFER);
	}
	
	public Javascript process(Command command) {
		Javascript res = null;
		CommandName processingType = command.getCommandName();		
		Map<String,String> attributes = command.getAttributes();
		
		if (processingType == CommandName.buffering) {			
			String id = attributes.get("command_id");
			int nextChunkNumber = shapeBuffer.bufferizeShape(id, attributes);
			res = buildJavascript(id, nextChunkNumber);
		}
		
		return res;
		
	}

	private Javascript buildJavascript(String id, int nextChunkNumber) {
		Javascript res = new Javascript();
		res.appendLine("_sendPacket("+id+","+nextChunkNumber+");");
		return res;		
	}

}
