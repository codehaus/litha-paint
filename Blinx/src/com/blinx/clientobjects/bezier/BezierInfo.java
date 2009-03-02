package com.blinx.clientobjects.bezier;

public class BezierInfo {
	private Integer id;
	
	private String strokeColor;
	private String strokeWidth;
	private String strokeOpacity;
	private String strokeDashArray;
	private String strokeLineCap;
	private String strokeLineJoin;
	private String strokeMiterlimit;
	
	private String fillColor;
	private String fillOpacity;
	private String fillRule;
	
	
	
	public BezierInfo(Integer id, String strokeColor, String strokeWidth, String strokeOpacity, String strokeDashArray, String strokeLineCap, String strokeLineJoin, String strokeMiterlimit, String fillColor, String fillOpacity, String fillRule) {
		super();
		// TODO Auto-generated constructor stub
		this.id = id;
		this.strokeColor = strokeColor;
		this.strokeWidth = strokeWidth;
		this.strokeOpacity = strokeOpacity;
		this.strokeDashArray = strokeDashArray;
		this.strokeLineCap = strokeLineCap;
		this.strokeLineJoin = strokeLineJoin;
		this.strokeMiterlimit = strokeMiterlimit;
		this.fillColor = fillColor;
		this.fillOpacity = fillOpacity;
		this.fillRule = fillRule;
	}



	public String toString() {
		StringBuffer res = new StringBuffer();
		res.append(id);
		res.append(",");
		res.append(strokeColor);
		res.append(",");
		res.append(strokeWidth);
		res.append(",");
		res.append(strokeOpacity);
		res.append(",");
		res.append(strokeDashArray);
		res.append(",");
		res.append(strokeLineCap);
		res.append(",");
		res.append(strokeLineJoin);
		res.append(",");
		res.append(strokeMiterlimit);
		res.append(",");
		res.append(fillColor);
		res.append(",");
		res.append(fillOpacity);
		res.append(",");
		res.append(fillRule);
		return res.toString();
	}
	
}
