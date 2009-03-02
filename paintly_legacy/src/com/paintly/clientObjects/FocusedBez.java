package com.paintly.clientObjects;

import java.util.Map;

/**
 * Represents focusedBez client-side object on the server-side.
 * @author slava
 *
 */
public class FocusedBez extends ClientObject {

	/**
	 * Constructor
	 * @param map
	 */
    public FocusedBez(Map map){
        textContent = (String)map.get("text");
        if(textContent.indexOf("<focusedbez")!=-1) textContent="";
    }
    
    public String toString(){
        String res = null;
        res = "<focusedbez>";
        res+=textContent;
        res+="</focusedbez>";
        return res;
    }
}
