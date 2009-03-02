package com.paintly.exception;

/**
 * Exception occures when unable to open Litha document
 * @author slava
 *
 */
public class LithaOpenDocumentException extends Exception {
	private String msg;
	
	/**
	 * Constructor
	 * @param msg
	 */
	public LithaOpenDocumentException(String msg){
		this.msg = msg;
	}
	
	public String toString(){
		return msg;
	}
}
