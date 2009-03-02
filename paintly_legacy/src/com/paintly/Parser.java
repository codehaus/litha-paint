package com.paintly;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import com.paintly.clientObjects.ClientObject;
import com.paintly.clientObjects.FocusedBez;
import com.paintly.clientObjects.FocusedText;
import com.paintly.clientObjects.RegionHistory;
import com.paintly.clientObjects.UndoRedoLog;
import com.paintly.renderer.bridge.*;

/**
 * Parses incoming commands
 * @author slava 
 */
public class Parser {

    private static XmlPullParserFactory factory = null;

    private static Logger log = Logger.getLogger(Parser.class);

    static {
        try {
            factory = XmlPullParserFactory.newInstance(System
                    .getProperty(XmlPullParserFactory.PROPERTY_NAME), null);
            factory.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, true);

        } catch (XmlPullParserException e) {
            log.error("Exception on initializing XmlPullParserFactory", e);
        }
    }

    /**
     * Parses input xml and return a strange list of objects
     * @param xmlString
     * @return a really strange list of objects: for every xml element - a object in this list. The object could be a HasMap of attributes (not shape xml element) or instance of subclass of Shape.
     * So the most common case: 0-th element a hasmap of attributes of <command> element and than instances of Shape subclasses.
     */
    public List parseRequest(StringBuffer xmlString) {

        log.debug("parse: "+xmlString);
        XmlPullParser xpp = null;

        List objectList = null;

        boolean rootFlag = false;

        String tagName = "";

        try {
            objectList = new ArrayList(); //first element is a always hashmap that represents a command element with its attributes, then in could be instances of Shape or ClientObject classes
            xpp = factory.newPullParser();
            xpp.setInput(new StringReader(xmlString.toString()));
            int eventType = xpp.getEventType();
            while (eventType != XmlPullParser.END_DOCUMENT) {
                if (eventType == XmlPullParser.START_TAG) {

                    tagName = xpp.getName().toString().toLowerCase();

                    if(tagName.equals("command") && rootFlag == false){//apply for non delete command
                        rootFlag  = true;
                        
                    } else {
                        if(!rootFlag || (tagName.equals("command") && rootFlag == true)){
                            throw new XmlPullParserException("Document is non-well formated.");
                        }
                    }
                    objectList.add(processStartTag(xpp));
                }
                if(eventType == XmlPullParser.TEXT){ //only client objects elements can have text section
                   ((ClientObject)objectList.get(objectList.size()-1)).setTextContent(xpp.getText()); 
                }
                eventType = xpp.next();
            }
            return objectList;
        } catch (XmlPullParserException e) {
            log.error(xpp.getName(), e);
        } catch (IOException e) {
            log.error(xpp.getName(), e);
        }
        return null;
    }

    
    /**
     * Returns a Map of attributes if the current xml element doesn't represent any valid shape or instance of Shape object in other case.
     * @param xpp xpp instance
     * @return returning object could be an HashMap or an inctance of a Shape
     */
    private Object processStartTag(XmlPullParser xpp){

        HashMap hmElement = new HashMap();
        String tagName = xpp.getName().toString().toLowerCase();

        hmElement.put("instance", tagName);
        hmElement.put("text", xpp.getText());

        for (int i = 0; i < xpp.getAttributeCount(); i++) {
            hmElement.put(xpp.getAttributeName(i), xpp.getAttributeValue(i));
        }

        if(!tagName.equals("command")){

            ShapeBridge shapeBridge = null;

            if(tagName.equals("bezier")){
              shapeBridge = new BezierBridge();
            }else if(tagName.equals("text")){
              shapeBridge = new TextBridge();            
            }else if(tagName.equals("image")){
              shapeBridge = new ImageTransformationBridge();
            }
            //return shape if it has been it
            if(shapeBridge!=null) return shapeBridge.getShape(hmElement);
            if(tagName.equals("regionhistory")){
              return new RegionHistory(hmElement);  
            }
            if(tagName.equals("undoredolog")){
                return new UndoRedoLog(hmElement);
            }
            if(tagName.equals("focusedbez")){
                return new FocusedBez(hmElement);
            }
            if(tagName.equals("focusedtext")){
                return new FocusedText(hmElement);
            }
            
        }
        return hmElement;
    }
    
    /**
     * getter
     * @return XPPFactory
     */
    public static XmlPullParserFactory getFactory() {
        return factory;
    }
}