package com.blinx.processor;

/**
 * Holder of javascript code that would be transmitted to the client browser
 * @author slava
 */
public class Javascript {
	private StringBuffer content;
	
	public Javascript() {
		content = new StringBuffer();
	}
	
	public Javascript appendLine(String line) {
		content.append(line);
		content.append("\n");
		return this;
	}
	
	public Javascript appendLine(long line) {
		content.append(String.valueOf(line));
		content.append("\n");
		return this;
	}
	
	public Javascript appendChars(String chars) {
		content.append(chars);
		return this;
	}
	
	public Javascript appendChars(int number) {
		content.append(String.valueOf(number));
		return this;
	}

	
	public Javascript appendChars(Long llong) {
		content.append(String.valueOf(llong));
		return this;
	}
	
	public Javascript newLine() {
		content.append("\n");
		return this;
	}
	
	public String getContent() {
		return content.toString();
	}
	
	public String toString() {
		return content.toString();
	}
	
}
