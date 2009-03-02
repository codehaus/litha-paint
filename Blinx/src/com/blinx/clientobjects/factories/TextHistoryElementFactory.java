package com.blinx.clientobjects.factories;

import java.awt.Point;
import java.util.ArrayList;

import com.blinx.clientobjects.bezier.BezierChunk;
import com.blinx.clientobjects.bezier.BezierHistoryElement;
import com.blinx.clientobjects.bezier.BezierInfo;
import com.blinx.clientobjects.bezier.TerminalControlProperty;
import com.blinx.clientobjects.text.TextHistoryElement;
import com.blinx.clientobjects.text.TextInfo;
import com.blinx.renderer.shapes.Bezier;
import com.blinx.renderer.shapes.Text;

public class TextHistoryElementFactory {
	
	public static TextHistoryElement createTextHistoryElement(Text t) {
		  TextHistoryElement res = null; 
	      TextInfo textInfo = new TextInfo(t.getID(), t.getStrokeColor(), t.getTextSize(), t.getWeight(), t.getText_style(), t.getText_decoration(), t.getFont());
	      	      
		  res = new TextHistoryElement(t.getID(), t.getLeft(), t.getTop(), t.getWidth(), t.getHeight(), textInfo, rollbackText(t.getText()));
		  return res;		  
	}

	
	private static String rollbackText(String text) {
		String res = text.replaceAll("!!!BR!!!","<BR>");
		return res;
	}

	
	
}
