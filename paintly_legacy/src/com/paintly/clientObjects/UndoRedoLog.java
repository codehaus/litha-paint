package com.paintly.clientObjects;

import java.util.Map;

/**
 * Represents undoRedoLog client-side object on the server-side
 * @author slava
 *
 */
public class UndoRedoLog extends ClientObject {

	/**
	 * Current pointer in undoRedoLog
	 */
    String undoRedoLogPtr;
    
    /**
     * Constructor
     * @param map
     */
    public UndoRedoLog(Map map){
        textContent = (String)map.get("text");
        undoRedoLogPtr = (String)map.get("undoredoptr");
        if(textContent.indexOf("<undoredolog")!=-1) textContent="";
    }
    
    public String toString(){
        String res;
        res="<undoredolog undoredoptr=\""+undoRedoLogPtr+"\">";
        res+=textContent;
        res+="</undoredolog>";
        return res;
    }
}
