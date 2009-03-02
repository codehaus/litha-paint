package com.paintly.clientObjects;

import java.util.Map;

import com.paintly.clientObjects.ClientObject;

/**
 * Represents focusedText client-side object on the server side.
 * @author slava
 *
 */
public class FocusedText extends ClientObject {

	/**
	 * Constructor
	 * @param map
	 */
    public FocusedText(Map map){
        textContent = (String)map.get("text");
        if(textContent.indexOf("<focusedtext")!=-1) textContent="";
    }
    
    public String toString() {
        String res = null;
        res = "<focusedtext>";
        res+=textContent;
        res+="</focusedtext>";
        return res;    
    }

}
