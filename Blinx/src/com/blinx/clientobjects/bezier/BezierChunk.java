package com.blinx.clientobjects.bezier;

import java.awt.Point;


public class BezierChunk {

	private Point controlPoint;
	private Point firstCompanion;
	private Point secondCompanion;
	private boolean smooth;
	private TerminalControlProperty terminalProperty;
	private boolean line;
	
	
	
	public BezierChunk(Point controlPoint, Point firstCompanion, Point secondCompanion, boolean smooth, TerminalControlProperty terminalProperty, boolean line) {
		super();
		// TODO Auto-generated constructor stub
		this.controlPoint = controlPoint;
		this.firstCompanion = firstCompanion;
		this.secondCompanion = secondCompanion;
		this.smooth = smooth;
		this.terminalProperty = terminalProperty;
		this.line = line;
	}

	public String toString() {
		StringBuffer res = new StringBuffer();
		res.append(controlPoint.x);
		res.append(",");
		res.append(controlPoint.y);
		res.append(",");
		res.append(firstCompanion.x);
		res.append(",");
		res.append(firstCompanion.y);
		res.append(",");
		res.append(secondCompanion.x);
		res.append(",");
		res.append(secondCompanion.y);
		res.append(",");
		res.append(smoothToString());
		res.append(",");
		res.append(terminalPropertyToString());
		res.append(",");
		res.append(lineToString());
		return res.toString();		
	}

	private String lineToString() {
		String res = null;
		if (line) {
			res = "1";
		} else {
			res = "0";
		}
		return res;
	}

	public String terminalPropertyToString() {
		String res = null;
		if (terminalProperty == TerminalControlProperty.no) {
			res = "0";
		} else if (terminalProperty == TerminalControlProperty.merged) {
			res = "1";
		} else if (terminalProperty == TerminalControlProperty.closed) {
			res = "2";
		}
		return res;
	}

	private String smoothToString() {
		String res = null;
		if (smooth) {
			res = "1";
		} else {
			res = "0";
		}
		return res;
	}

	public Point getControlPoint() {
		return controlPoint;
	}

	public Point getFirstCompanion() {
		return firstCompanion;
	}

	public Point getSecondCompanion() {
		return secondCompanion;
	}
	
	
}
