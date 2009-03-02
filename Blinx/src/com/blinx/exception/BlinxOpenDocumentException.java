package com.blinx.exception;

/**
 * Exception occures when unable to open Litha document
 * @author slava
 *
 */
public class BlinxOpenDocumentException extends Exception {
	
	public BlinxOpenDocumentException(Throwable e){
		super(e);
	}
	
	public BlinxOpenDocumentException(String message) {
		super(message);
	}
	
	
		
}
