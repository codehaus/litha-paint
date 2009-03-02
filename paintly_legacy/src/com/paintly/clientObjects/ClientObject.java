package com.paintly.clientObjects;

/**
 * Ancestor for every class that represents on the server-side the client-side object such as regionHistory or undoRedoLog.
 * @author slava
 */
abstract public class ClientObject {
	/**
	 * Textual representation of the client-side object
	 */
    protected String textContent = null;

    /**
     * @return Returns the textContent.
     */
    public String getTextContent() {
        return textContent;
    }

    /**
     * @param textContent The textContent to set.
     */
    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }  
    
    abstract public String toString();
            
}
