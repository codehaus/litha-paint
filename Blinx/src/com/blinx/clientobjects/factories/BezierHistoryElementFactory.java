package com.blinx.clientobjects.factories;

import java.awt.Point;
import java.util.ArrayList;

import com.blinx.clientobjects.bezier.BezierChunk;
import com.blinx.clientobjects.bezier.BezierHistoryElement;
import com.blinx.clientobjects.bezier.BezierInfo;
import com.blinx.clientobjects.bezier.TerminalControlProperty;
import com.blinx.renderer.shapes.Bezier;

/**
 * Takes Bezier object and return BezierHistoryElement object that would be store in RegionHistory object for document serialization purposes. 
 * Remeber that we don't pass regionHistory javascript object anymore (because of GET method restriction). Thats why we need synchronize and store RehionHistory on the server side.
 * @author slava
 *
 */
public class BezierHistoryElementFactory {

	public static BezierHistoryElement createBezierHistoryElement(Bezier b) {
		  BezierHistoryElement res = null; 
	      
		  ArrayList<BezierChunk> chunks = createChunkList(b.getNastyPointsStr());
		  BezierInfo bezInfo = createBezierInfo(b);
		  
	      
		  res = new BezierHistoryElement(b.getID(), b.getLeft(), b.getTop(), b.getWidth(), b.getHeight(), bezInfo, chunks);
		
		  return res;
	}

	
	private static ArrayList<BezierChunk> createChunkList(String nastyPoints) {
		ArrayList<BezierChunk> res = new ArrayList<BezierChunk>();
		String[] chunks = nastyPoints.split("NECH");
		for (String chunk : chunks) {
			String[] ce = chunk.split(",");
			
			BezierChunk bezierChunk = new BezierChunk(new Point(toi(ce[0]),toi(ce[1])), new Point(toi(ce[2]),toi(ce[3])), new Point(toi(ce[4]),toi(ce[5])), tob(ce[6]), totcp(ce[7]), tob(ce[8]));
			res.add(bezierChunk);
		}
		return res;
	}
	
	
	private static BezierInfo createBezierInfo(Bezier b) {
		BezierInfo res = new BezierInfo(b.getID(), b.getStrokeColor(), String.valueOf(b.getStrokeWidth()), String.valueOf(b.getStrokeOpacity()), b.getStrokeDasharray(), b.getStrokeLinecap(), b.getStrokeLinejoin(), String.valueOf(b.getStrokeMiterlimit()), b.getFillColor(), String.valueOf(b.getFillOpacity()), b.getFillRule());
		return res;
	}

	private static TerminalControlProperty totcp(String string) {
		int i = toi(string);
		TerminalControlProperty res = null;
		switch (i) {
			case 0 : res = TerminalControlProperty.no;break;
			case 1 : res = TerminalControlProperty.merged;break;
			case 2 : res = TerminalControlProperty.closed;break;
		}
		
		return res;
	}

	private static int toi(String s) {
		return Integer.parseInt(s);
	}
	
	private static boolean tob(String s) {
		return new Boolean(s).booleanValue();
	}

}
