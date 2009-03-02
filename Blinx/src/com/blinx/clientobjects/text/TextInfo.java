package com.blinx.clientobjects.text;

public class TextInfo {
	private Integer id;
	
	private String strokeColor;
	private String fontSize;
	private String fontWeight;
	private String fontStyle;
	private String textDecoration;
	private String fontFamily;
	
	public TextInfo(Integer id, String strokeColor, String fontSize, String fontWeight, String fontStyle, String textDecoration, String fontFamily) {	
		this.id = id;
		this.strokeColor = strokeColor;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
		this.fontStyle = fontStyle;
		this.textDecoration = textDecoration;
		this.fontFamily = fontFamily;
	}
	
	public String toString() {		
		StringBuffer res = new StringBuffer();
		res.append(id);
		res.append(",");
		res.append(strokeColor);
		res.append(",");
		res.append(fontSize);
		res.append(",");
		res.append(fontWeight);
		res.append(",");
		res.append(fontStyle);
		res.append(",");
		res.append(textDecoration);
		res.append(",");
		res.append(fontFamily);
		
		return res.toString();
	}
		
}
