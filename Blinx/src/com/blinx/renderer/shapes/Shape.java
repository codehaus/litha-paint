package com.blinx.renderer.shapes;

import org.apache.batik.dom.svg.SVGDOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.blinx.clientobjects.RegionHistoryElement;

import java.util.List;

/**
 * This interface should be implemeted by the all shapes that needs to be part of SVGDocument
 * @author VyacheslavE
 * @version Apr 15, 2006
 */
public interface Shape {
    public final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;
    public Element materialize(Document document); //all descendants except Text should implement this method. Text must leave this method empty
    public List materializeText(Document document);//only Text should implement this method, others descendants must leave this method empty
    public java.awt.Rectangle getOutscribingRect();
    public Integer getID();
    public RegionHistoryElement toRegionHistoryElement();
}
