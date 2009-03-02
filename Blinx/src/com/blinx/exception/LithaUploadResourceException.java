/**
 * 
 */
package com.blinx.exception;

/**
 * Exception occures when unable to upload resource from (File/URL)
 * @author alex
 *
 */
public class LithaUploadResourceException  extends Exception {
	
	private String msg;
	
	/**
	 * Constructor
	 * @param msg
	 */
	public LithaUploadResourceException(String msg){
		this.msg = msg;
	}
	
	public String toString(){
		return msg;
	}
}
