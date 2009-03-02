package com.blinx;

import org.apache.batik.dom.svg.SVGDOMImplementation;

import com.blinx.renderer.Color;

/**
 * ConstantsBulk.  Some of the constants (like TEMP_DIR) are initialized in the Log4JInitServlet. 
 * @author slava
 *
 */
public class ConstantsBulk {
	
	/**
	 * The name of the transparent color
	 */
    public static final String ALPHA = "alpha"; 
    
    public static final Color COLOR_ALPHA = new Color("alpha");
    
    /**
     * Namespace for SVG
     */
    public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

    /**
     * Default number of columns per document
     */
    public static final int DEFAULT_SCRAPSX = 10;
    
    /**
     * Default number of rows per document
     */
    public static final int DEFAULT_SCRAPSY = 10;
    
    /**
     * Name of litha's session cookie
     */
    public static final String USERIDCOOKIE = "userid";
    
    /**
     * File separator that is used in OS litha-paint is currently running 
     */
    public static final String FILESEPARATOR = System.getProperty("file.separator");
    
    /**
     * Default width of the scrap in the pixels
     */
    public static final int SCRAPWIDTH = 200;
    
    /**
     * Default heihgjt of the scrap in the pixels
     */
    public static final int SCRAPHEIGHT = 200;
    
    /**
     * 
     */
    public static final String SESSIONCOUNT = "sessionCount";
    
    /**
     * Session's attribute name of properties being loaded by Log4JInitServlet
     */
    public static final String PROPERTIES = "properties";
    
    /**
     *  
     */
    public static final int MAXFILESEIZEINMEMORY=1024*1024*5; //5 megas
    
    /**
     * Maximum file size allowed for uploading
     */
    public static final int MAXALLOWEDFILESEIZE = 2*1024*1024; //2 mega
    
    /**
     * Suffix that would be attached to the filename being unpublished
     */
    public static final String DO_NOT_PUBLISH_SUFFIX = "HsIlBuP_ToN_Od";
    
    /**
     * Home of Litha-paint super tool.
     */
    public static final String LITHA_URL = "http://litha-paint.com";
    
	/**
	 * Mime-type
	 */
    public static final String IMG_TYPE_PNG = "image/png";
    
    /**
     * Mime-type
     */
	public static final String IMG_TYPE_JPG = "image/jpeg";
	
	/**
	 * Temp directory for debugging purposes 
	 */
	public static String TEMP_DIR; //see Log4JInitServlet

	/**
	 * Session attribute name for canvas
	 */
	public static final String CANVAS_SCRAP_HOLDER = "canvasScrapHolder";

	/**
	 * Session attribute name for document
	 */
	public static final String DOCUMENT_HOLDER = "documentHolder";
	
	/**
	 * Session attribute of regionHistory
	 */
	public static final String REGION_HISTORY = "regionHistory";
	
	/**
	 * Session attribute for shapeBuffer 
	 */
	public static final String SHAPE_BUFFER = "shapeBuffer";
	
	public static final String USERSPACE_DIR_PROPERTY = "userspace.dir";
	
	public static final String WEB_DIR_PROPERTY = "web.dir";
	
	public static final String SESSION_INVALIDATE_TIME = "invalidate_session_time";

	public static final String UTF8 = "UTF-8";
}
