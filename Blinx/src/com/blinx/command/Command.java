package com.blinx.command;

import java.util.Map;

import com.blinx.renderer.shapes.Shape;

/**
 * Command has came from client 
 * @author slava
 */
public class Command {
	private CommandName commandName;
	private Map<String,String> attributes;
	private Shape shape;
	
	public Map<String, String> getAttributes() {
		return attributes;
	}
	public void setAttributes(Map<String, String> attributes) {
		this.attributes = attributes;
	}
	public CommandName getCommandName() {
		return commandName;
	}
	public void setCommandName(CommandName commandName) {
		this.commandName = commandName;
	}
	public Shape getShape() {
		return shape;
	}
	public void setShape(Shape shape) {
		this.shape = shape;
	}
		
}
