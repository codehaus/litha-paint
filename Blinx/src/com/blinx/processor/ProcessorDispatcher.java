package com.blinx.processor;

import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.blinx.command.Command;
import com.blinx.command.CommandName;
import com.blinx.exception.BlinxOpenDocumentException;

/**
 * Intended to decide which of the processor should be called for the particular command.
 * @author slava
 */
public class ProcessorDispatcher {
	
	private Logger log = Logger.getLogger(ProcessorDispatcher.class);
	
	static private Set<CommandName> graphicCommands = new HashSet<CommandName>();
	
	static private Set<CommandName> documentManagementCommands = new HashSet<CommandName>();
	
	static private Set<CommandName> imageCommands = new HashSet<CommandName>();
	
	static private Set<CommandName> bufferingCommands = new HashSet<CommandName>();
				
	static {
		graphicCommands.add(CommandName.bring_back);
		graphicCommands.add(CommandName.bring_bottom);
		graphicCommands.add(CommandName.bring_front);
		graphicCommands.add(CommandName.bring_top);
		graphicCommands.add(CommandName.copy_image);
		graphicCommands.add(CommandName.delete);
		graphicCommands.add(CommandName.insert);
		graphicCommands.add(CommandName.update);
		graphicCommands.add(CommandName.change_background);
		
		documentManagementCommands.add(CommandName.new_document);
		documentManagementCommands.add(CommandName.open_document);
		documentManagementCommands.add(CommandName.save_document);
		
		imageCommands.add(CommandName.insert_image);
		
		bufferingCommands.add(CommandName.buffering);
				
	}
		
	private HttpServletRequest request = null;
	
	public ProcessorDispatcher(HttpServletRequest request) {
		this.request = request;
	}
	
	/**
	 * Delegate processing to the correct processor
	 * @param command
	 * @return javascript result from processor.
	 * @throws BlinxOpenDocumentException
	 */
	public Javascript process(Command command) throws BlinxOpenDocumentException {
		System.out.println(command.getAttributes());
		Javascript res = null;
		CommandName processingType = command.getCommandName();
		
		if(graphicCommands.contains(processingType)){
			GraphicCommandProcessor processor = new GraphicCommandProcessor(request);
			res = processor.process(command);
		} else if (documentManagementCommands.contains(processingType)){
			DocumentCommandProcessor processor = new DocumentCommandProcessor(request);
			res = processor.process(command);
		} else if (imageCommands.contains(processingType)) {
			ImageCommandProcessor processor = new ImageCommandProcessor(request);
			res = processor.process(command);
		} else if (bufferingCommands.contains(processingType)) {
			BufferingCommandProcessor processor = new BufferingCommandProcessor(request);
			res = processor.process(command);
		}
		System.out.println(res.toString());
		return res;
	}
}
