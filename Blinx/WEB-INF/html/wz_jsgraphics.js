/* This notice must be untouched at all times.

wz_jsgraphics.js    v. 2.33
The latest version is available at
http://www.walterzorn.com
or http://www.devira.com
or http://www.walterzorn.de

Copyright (c) 2002-2004 Walter Zorn. All rights reserved.
Created 3. 11. 2002 by Walter Zorn (Web: http://www.walterzorn.com )
Last modified: 24. 10. 2005

Performance optimizations for Internet Explorer
by Thomas Frank and John Holdsworth.
fillPolygon method implemented by Matthieu Haller.

High Performance JavaScript Graphics Library.
Provides methods
- to draw lines, rectangles, ellipses, polygons
	with specifiable line thickness,
- to fill rectangles and ellipses
- to draw text.
NOTE: Operations, functions and branching have rather been optimized
to efficiency and speed than to shortness of source code.

LICENSE: LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License (LGPL) as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA,
or see http://www.gnu.org/copyleft/lesser.html
*/


var jg_ihtm, jg_ie, jg_fast, jg_dom, jg_moz,
jg_n4 = (document.layers && typeof document.classes != "undefined");


function chkDHTM(x, i)
{	
	x = document.body || null;
	jg_ie = x && typeof x.insertAdjacentHTML != "undefined";
	jg_dom = (x && !jg_ie &&
		typeof x.appendChild != "undefined" &&
		typeof document.createRange != "undefined" &&
		typeof (i = document.createRange()).setStartBefore != "undefined" &&
		typeof i.createContextualFragment != "undefined");
	jg_ihtm = !jg_ie && !jg_dom && x && typeof x.innerHTML != "undefined";
	jg_fast = jg_ie && document.all && !window.opera;
	jg_moz = jg_dom && typeof x.style.MozOpacity != "undefined";
}


function pntDoc()
{
	alert('pntDoc');
	this.wnd.document.write(jg_fast? this.htmRpc() : this.htm);
	this.htm = '';
}


function pntCnvDom()
{
/*	var x = document.createRange();
	x.setStartBefore(this.cnv);//this line fails in FireFox1.5, so i replaced it by innerHTML attribute that FireFox supports
	x = x.createContextualFragment(jg_fast? this.htmRpc() : this.htm);
	this.cnv.appendChild(x);
	this.htm = '';
*/
this.cnv.innerHTML += this.htm;
	this.htm = '';
}


function pntCnvIe()
{
	this.cnv.insertAdjacentHTML("BeforeEnd", jg_fast? this.htmRpc() : this.htm);
	this.htm = '';
}


function pntCnvIhtm()
{
	alert('pntCnvIhtm');	
	this.cnv.innerHTML += this.htm;
	this.htm = '';
}


function pntCnv()
{
	this.htm = '';
}


function mkDiv(x, y, w, h)
{       var xx=x;
        var yy=y;
        var ww=w;
        var hh=h;
        if(x<0) {ww=w+x;xx=0;}
        if(y<0) {hh=h+y;yy=0;}
        if(x>=0 && y>=0 && x+w>this.width && y+h<=this.height){
		ww = (this.width-x);
        }
        else if(x>=0 && y>=0 && x+w<=this.width&& y+h>this.height){
		hh = (this.height-y);
        }
        else if(x>=0 && y>=0 && x+w>this.width&& y+h>this.height){
		ww = (this.width-x);
		hh = (this.height-y);
        }

  	  if(x+w>0 && y+h>0)
		this.htm += '<div style="position:absolute;'+
		'left:' + xx + 'px;'+
		'top:' + yy + 'px;'+
		'width:' + ww + 'px;'+
		'height:' + hh + 'px;'+
		'clip:rect(0,'+ww+'px,'+hh+'px,0);'+
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';

}


function mkDivIe(x, y, w, h)
{
        var xx=x;
	var yy=y;
        var ww=w;
        var hh=h;

        if(x<0){ww=w+x;xx=0;}
        if(y<0){hh=h+y;yy=0;}

	
        if(x>=0 && y>=0 && x+w>this.width && y+h<=this.height){
	  ww=this.width-x;
	}else if(x>=0 && y>=0 && x+w<=this.width && y+h>this.height){
	  hh=this.height-y;
	}else if(x>=0 && y>=0 && x+w>this.width && y+h>this.height){
	  ww=this.width-x;
	  hh=this.height-y;
	}

	if(x+w>0 && y+h>0) this.htm += '%%'+this.color+';'+xx+';'+yy+';'+ww+';'+hh+';';
}


function mkDivPrt(x, y, w, h)
{
	this.htm += '<div style="position:absolute;'+
		'border-left:' + w + 'px solid ' + this.color + ';'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:0px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';
}


function mkLyr(x, y, w, h)
{
	this.htm += '<layer '+
		'left="' + x + '" '+
		'top="' + y + '" '+
		'width="' + w + '" '+
		'height="' + h + '" '+
		'bgcolor="' + this.color + '"><\/layer>\n';
}


var regex =  /%%([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);/g;
function htmRpc()
{
	return this.htm.replace(
		regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2;top:$3;width:$4;height:$5"></div>\n');
}


function htmPrtRpc()
{
	return this.htm.replace(
		regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2;top:$3;width:$4;height:$5;border-left:$4px solid $1"></div>\n');
}


function mkLin(x1, y1, x2, y2)
{
	if (x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	if (dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while ((dx--) > 0)
		{
			++x;
			if (p > 0)
			{
				this.mkDiv(ox, y, x-ox, 1);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this.mkDiv(ox, y, x2-ox+1, 1);
	}

	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if (y2 <= y1)
		{
			while ((dy--) > 0)
			{
				if (p > 0)
				{
					this.mkDiv(x++, y, 1, oy-y+1);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this.mkDiv(x2, y2, 1, oy-y2+1);
		}
		else
		{
			while ((dy--) > 0)
			{
				y += yIncr;
				if (p > 0)
				{
					this.mkDiv(x++, oy, 1, y-oy);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this.mkDiv(x2, oy, 1, y2-oy+1);
		}
	}
}


function mkLin2D(x1, y1, x2, y2)
{
	if (x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	var s = this.stroke;
	if (dx >= dy)
	{
		if (dx > 0 && s-3 > 0)
		{
			var _s = (s*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(s>>1)*dy) / dx;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.ceil(s/2);

		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while ((dx--) > 0)
		{
			++x;
			if (p > 0)
			{
				this.mkDiv(ox, y, x-ox+ad, _s);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this.mkDiv(ox, y, x2-ox+ad+1, _s);
	}

	else
	{
		if (s-3 > 0)
		{
			var _s = (s*dy*Math.sqrt(1+dx*dx/(dy*dy))-(s>>1)*dx-dy) / dy;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.round(s/2);

		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if (y2 <= y1)
		{
			++ad;
			while ((dy--) > 0)
			{
				if (p > 0)
				{
					this.mkDiv(x++, y, _s, oy-y+ad);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this.mkDiv(x2, y2, _s, oy-y2+ad);
		}
		else
		{
			while ((dy--) > 0)
			{
				y += yIncr;
				if (p > 0)
				{
					this.mkDiv(x++, oy, _s, y-oy+ad);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this.mkDiv(x2, oy, _s, y2-oy+ad+1);
		}
	}
}


function mkLinDott(x1, y1, x2, y2)
{
	if (x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1,
	drw = true;
	if (dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx;
		while ((dx--) > 0)
		{
			if (drw) this.mkDiv(x, y, 1, 1);
			drw = !drw;
			if (p > 0)
			{
				y += yIncr;
				p += pru;
			}
			else p += pr;
			++x;
		}
		if (drw) this.mkDiv(x, y, 1, 1);
	}

	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy;
		while ((dy--) > 0)
		{
			if (drw) this.mkDiv(x, y, 1, 1);
			drw = !drw;
			y += yIncr;
			if (p > 0)
			{
				++x;
				p += pru;
			}
			else p += pr;
		}
		if (drw) this.mkDiv(x, y, 1, 1);
	}
}


function mkOv(left, top, width, height)
{
	var a = width>>1, b = height>>1,
	wod = width&1, hod = (height&1)+1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	ox = 0, oy = b,
	aa = (a*a)<<1, bb = (b*b)<<1,
	st = (aa>>1)*(1-(b<<1)) + bb,
	tt = (bb>>1) - aa*((b<<1)-1),
	w, h;
	while (y > 0)
	{
		if (st < 0)
		{
			st += bb*((x<<1)+3);
			tt += (bb<<1)*(++x);
		}
		else if (tt < 0)
		{
			st += bb*((x<<1)+3) - (aa<<1)*(y-1);
			tt += (bb<<1)*(++x) - aa*(((y--)<<1)-3);
			w = x-ox;
			h = oy-y;
			if (w&2 && h&2)
			{
				this.mkOvQds(cx, cy, -x+2, ox+wod, -oy, oy-1+hod, 1, 1);
				this.mkOvQds(cx, cy, -x+1, x-1+wod, -y-1, y+hod, 1, 1);
			}
			else this.mkOvQds(cx, cy, -x+1, ox+wod, -oy, oy-h+hod, w, h);
			ox = x;
			oy = y;
		}
		else
		{
			tt -= aa*((y<<1)-3);
			st -= (aa<<1)*(--y);
		}
	}
	this.mkDiv(cx-a, cy-oy, a-ox+1, (oy<<1)+hod);
	this.mkDiv(cx+ox+wod, cy-oy, a-ox+1, (oy<<1)+hod);
}


function mkOv2D(left, top, width, height)
{
	var s = this.stroke;
	width += s-1;
	height += s-1;
	var a = width>>1, b = height>>1,
	wod = width&1, hod = (height&1)+1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa = (a*a)<<1, bb = (b*b)<<1,
	st = (aa>>1)*(1-(b<<1)) + bb,
	tt = (bb>>1) - aa*((b<<1)-1);

	if (s-4 < 0 && (!(s-2) || width-51 > 0 && height-51 > 0))
	{
		var ox = 0, oy = b,
		w, h,
		pxl, pxr, pxt, pxb, pxw;
		while (y > 0)
		{
			if (st < 0)
			{
				st += bb*((x<<1)+3);
				tt += (bb<<1)*(++x);
			}
			else if (tt < 0)
			{
				st += bb*((x<<1)+3) - (aa<<1)*(y-1);
				tt += (bb<<1)*(++x) - aa*(((y--)<<1)-3);
				w = x-ox;
				h = oy-y;

				if (w-1)
				{
					pxw = w+1+(s&1);
					h = s;
				}
				else if (h-1)
				{
					pxw = s;
					h += 1+(s&1);
				}
				else pxw = h = s;
				this.mkOvQds(cx, cy, -x+1, ox-pxw+w+wod, -oy, -h+oy+hod, pxw, h);
				ox = x;
				oy = y;
			}
			else
			{
				tt -= aa*((y<<1)-3);
				st -= (aa<<1)*(--y);
			}
		}
		this.mkDiv(cx-a, cy-oy, s, (oy<<1)+hod);
		this.mkDiv(cx+a+wod-s+1, cy-oy, s, (oy<<1)+hod);
	}

	else
	{
		var _a = (width-((s-1)<<1))>>1,
		_b = (height-((s-1)<<1))>>1,
		_x = 0, _y = _b,
		_aa = (_a*_a)<<1, _bb = (_b*_b)<<1,
		_st = (_aa>>1)*(1-(_b<<1)) + _bb,
		_tt = (_bb>>1) - _aa*((_b<<1)-1),

		pxl = new Array(),
		pxt = new Array(),
		_pxb = new Array();
		pxl[0] = 0;
		pxt[0] = b;
		_pxb[0] = _b-1;
		while (y > 0)
		{
			if (st < 0)
			{
				st += bb*((x<<1)+3);
				tt += (bb<<1)*(++x);
				pxl[pxl.length] = x;
				pxt[pxt.length] = y;
			}
			else if (tt < 0)
			{
				st += bb*((x<<1)+3) - (aa<<1)*(y-1);
				tt += (bb<<1)*(++x) - aa*(((y--)<<1)-3);
				pxl[pxl.length] = x;
				pxt[pxt.length] = y;
			}
			else
			{
				tt -= aa*((y<<1)-3);
				st -= (aa<<1)*(--y);
			}

			if (_y > 0)
			{
				if (_st < 0)
				{
					_st += _bb*((_x<<1)+3);
					_tt += (_bb<<1)*(++_x);
					_pxb[_pxb.length] = _y-1;
				}
				else if (_tt < 0)
				{
					_st += _bb*((_x<<1)+3) - (_aa<<1)*(_y-1);
					_tt += (_bb<<1)*(++_x) - _aa*(((_y--)<<1)-3);
					_pxb[_pxb.length] = _y-1;
				}
				else
				{
					_tt -= _aa*((_y<<1)-3);
					_st -= (_aa<<1)*(--_y);
					_pxb[_pxb.length-1]--;
				}
			}
		}

		var ox = 0, oy = b,
		_oy = _pxb[0],
		l = pxl.length,
		w, h;
		for (var i = 0; i < l; i++)
		{
			if (typeof _pxb[i] != "undefined")
			{
				if (_pxb[i] < _oy || pxt[i] < oy)
				{
					x = pxl[i];
					this.mkOvQds(cx, cy, -x+1, ox+wod, -oy, _oy+hod, x-ox, oy-_oy);
					ox = x;
					oy = pxt[i];
					_oy = _pxb[i];
				}
			}
			else
			{
				x = pxl[i];
				this.mkDiv(cx-x+1, cy-oy, 1, (oy<<1)+hod);
				this.mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
				ox = x;
				oy = pxt[i];
			}
		}
		this.mkDiv(cx-a, cy-oy, 1, (oy<<1)+hod);
		this.mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
	}
}


function mkOvDott(left, top, width, height)
{
	var a = width>>1, b = height>>1,
	wod = width&1, hod = height&1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb = (b*b)<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb,
	tt = (bb>>1) - aa2*((b<<1)-1),
	drw = true;
	while (y > 0)
	{
		if (st < 0)
		{
			st += bb*((x<<1)+3);
			tt += (bb<<1)*(++x);
		}
		else if (tt < 0)
		{
			st += bb*((x<<1)+3) - aa4*(y-1);
			tt += (bb<<1)*(++x) - aa2*(((y--)<<1)-3);
		}
		else
		{
			tt -= aa2*((y<<1)-3);
			st -= aa4*(--y);
		}
		if (drw) this.mkOvQds(cx, cy, -x, x+wod, -y, y+hod, 1, 1);
		drw = !drw;
	}
}


function mkRect(x, y, w, h)
{
	var s = this.stroke;
	if(w<0){x=x+w;w=-w;}
	if(h<0){y=y+h;h=-h;}
	this.mkDiv(x, y, w, s);
	this.mkDiv(x+w, y, s, h);
	this.mkDiv(x, y+h, w+s, s);
	this.mkDiv(x, y+s, s, h-s);
}


function mkRectDott(x, y, w, h)
{
	this.drawLine(x, y, x+w, y);
	this.drawLine(x+w, y, x+w, y+h);
	this.drawLine(x, y+h, x+w, y+h);
	this.drawLine(x, y, x, y+h);
}


function jsgFont()
{
	this.PLAIN = 'font-weight:normal;';
	this.BOLD = 'font-weight:bold;';
	this.ITALIC = 'font-style:italic;';
	this.ITALIC_BOLD = this.ITALIC + this.BOLD;
	this.BOLD_ITALIC = this.ITALIC_BOLD;
}
var Font = new jsgFont();


function jsgStroke()
{
	this.DOTTED = -1;
}
var Stroke = new jsgStroke();


function jsGraphics(id,width,height,canvObj)
{
	this.width = width;
	this.height = height;
	this.setColor = new Function('arg', 'this.color = arg.toLowerCase();');

	this.setStroke = function(x)
	{
		this.stroke = x;
		if (!(x+1))
		{
			this.drawLine = mkLinDott;
			this.mkOv = mkOvDott;
			this.drawRect = mkRectDott;
		}
		else if (x-1 > 0)
		{
			this.drawLine = mkLin2D;
			this.mkOv = mkOv2D;
			this.drawRect = mkRect;
		}
		else
		{
			this.drawLine = mkLin;
			this.mkOv = mkOv;
			this.drawRect = mkRect;
		}
	};


	this.setPrintable = function(arg)
	{
		this.printable = arg;
		if (jg_fast)
		{
			this.mkDiv = mkDivIe;
			this.htmRpc = arg? htmPrtRpc : htmRpc;
		}
		else this.mkDiv = jg_n4? mkLyr : arg? mkDivPrt : mkDiv;
	};


	this.setFont = function(fam, sz, sty)
	{
		this.ftFam = fam;
		this.ftSz = sz;
		this.ftSty = sty || Font.PLAIN;
	};


	this.drawPolyline = this.drawPolyLine = function(x, y, s)
	{
		for (var i=0 ; i<x.length-1 ; i++ )
			this.drawLine(x[i], y[i], x[i+1], y[i+1]);
	};


	this.fillRect = function(x, y, w, h)
	{
		this.mkDiv(x, y, w, h);
	};


	this.drawPolygon = function(x, y)
	{
		this.drawPolyline(x, y);
		this.drawLine(x[x.length-1], y[x.length-1], x[0], y[0]);
	};


	this.drawEllipse = this.drawOval = function(x, y, w, h)
	{
		if(w<0){x=x+w;w=-w;}
		if(h<0){y=y+h;h=-h;}
		this.mkOv(x, y, w, h);
	};


	this.fillEllipse = this.fillOval = function(left, top, w, h)
	{
		if(w<0){left=left+w;w=-w;}
		if(h<0){top=top+h;h=-h;}
		var a = (w -= 1)>>1, b = (h -= 1)>>1,
		wod = (w&1)+1, hod = (h&1)+1,
		cx = left+a, cy = top+b,
		x = 0, y = b,
		ox = 0, oy = b,
		aa2 = (a*a)<<1, aa4 = aa2<<1, bb = (b*b)<<1,
		st = (aa2>>1)*(1-(b<<1)) + bb,
		tt = (bb>>1) - aa2*((b<<1)-1),
		pxl, dw, dh;
		if (w+1) while (y > 0)
		{
			if (st < 0)
			{
				st += bb*((x<<1)+3);
				tt += (bb<<1)*(++x);
			}
			else if (tt < 0)
			{
				st += bb*((x<<1)+3) - aa4*(y-1);
				pxl = cx-x;
				dw = (x<<1)+wod;
				tt += (bb<<1)*(++x) - aa2*(((y--)<<1)-3);
				dh = oy-y;
				this.mkDiv(pxl, cy-oy, dw, dh);
				this.mkDiv(pxl, cy+y+hod, dw, dh);
				ox = x;
				oy = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}
		}
		this.mkDiv(cx-a, cy-oy, w+1, (oy<<1)+hod);
	};


/* fillPolygon method, implemented by Matthieu Haller.
This javascript function is an adaptation of the gdImageFilledPolygon for Walter Zorn lib.
C source of GD 1.8.4 found at http://www.boutell.com/gd/

THANKS to Kirsten Schulz for the polygon fixes!

The intersection finding technique of this code could be improved
by remembering the previous intertersection, and by using the slope.
That could help to adjust intersections to produce a nice
interior_extrema. */
	this.fillPolygon = function(array_x, array_y)
	{
		var i;
		var y;
		var miny, maxy;
		var x1, y1;
		var x2, y2;
		var ind1, ind2;
		var ints;

		var n = array_x.length;

		if (!n) return;


		miny = array_y[0];
		maxy = array_y[0];
		for (i = 1; i < n; i++)
		{
			if (array_y[i] < miny)
				miny = array_y[i];

			if (array_y[i] > maxy)
				maxy = array_y[i];
		}
		for (y = miny; y <= maxy; y++)
		{
			var polyInts = new Array();
			ints = 0;
			for (i = 0; i < n; i++)
			{
				if (!i)
				{
					ind1 = n-1;
					ind2 = 0;
				}
				else
				{
					ind1 = i-1;
					ind2 = i;
				}
				y1 = array_y[ind1];
				y2 = array_y[ind2];
				if (y1 < y2)
				{
					x1 = array_x[ind1];
					x2 = array_x[ind2];
				}
				else if (y1 > y2)
				{
					y2 = array_y[ind1];
					y1 = array_y[ind2];
					x2 = array_x[ind1];
					x1 = array_x[ind2];
				}
				else continue;

				 // modified 11. 2. 2004 Walter Zorn
				if ((y >= y1) && (y < y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);

				else if ((y == maxy) && (y > y1) && (y <= y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);
			}
			polyInts.sort(integer_compare);
			for (i = 0; i < ints; i+=2)
				this.mkDiv(polyInts[i], y, polyInts[i+1]-polyInts[i]+1, 1);
		}
	};


	this.drawString = function(txt, id, x, y)
	{
		this.htm += '<div id="'+id+'" style="position:absolute;white-space:nowrap;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt +
			'<\/div>';
	};


/* drawStringRect() added by Rick Blommers.
Allows to specify the size of the text rectangle and to align the
text both horizontally (e.g. right) and vertically within that rectangle */
	this.drawStringRect = function(txt, x, y, width, height, halign)
	{
		this.htm += '<div id="div2" style="position:absolute;overflow:hidden;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'width:'+width +'px;'+
			//'height:'+height +'px;'+
			'text-align:'+halign+';'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt + '<\/div>';
		this.drawRect(x,y,width,height);
	};


	this.drawImage = function(imgSrc, x, y, w, h, a)
	{
		this.htm += '<div style="position:absolute;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'width:' +  w + ';'+
			'height:' + h + ';">'+
			'<img src="' + imgSrc + '" width="' + w + '" height="' + h + '"' + (a? (' '+a) : '') + '>'+
			'<\/div>';
	};


	this.clear = function()
	{
		this.htm = "";
		if (this.cnv) this.cnv.innerHTML = this.defhtm;
	};


	this.mkOvQds = function(cx, cy, xl, xr, yt, yb, w, h)
	{
		this.mkDiv(xr+cx, yt+cy, w, h);
		this.mkDiv(xr+cx, yb+cy, w, h);
		this.mkDiv(xl+cx, yb+cy, w, h);
		this.mkDiv(xl+cx, yt+cy, w, h);
	};

	this.setStroke(1);
	this.setFont('verdana,geneva,helvetica,sans-serif', String.fromCharCode(0x31, 0x32, 0x70, 0x78), Font.PLAIN);
	this.color = '#000000';
	this.htm = '';
	this.bufferHtm = new Array("","","","","");
	this.wnd = window;

	if (!(jg_ie || jg_dom || jg_ihtm)) chkDHTM();
	if (typeof id != 'string' || !id) this.paint = pntDoc;
	else if(canvObj==undefined)
	{
		this.cnv = document.getElementById? (this.wnd.document.getElementById(id) || null)
			: null;
		this.defhtm = (this.cnv && this.cnv.innerHTML)? this.cnv.innerHTML : '';
		this.paint = jg_dom? pntCnvDom : jg_ie? pntCnvIe : jg_ihtm? pntCnvIhtm : pntCnv;
	}
        else{
		this.cnv = canvObj;
		this.defhtm = (this.cnv && this.cnv.innerHTML)? this.cnv.innerHTML : '';
		this.paint = jg_dom? pntCnvDom : jg_ie? pntCnvIe : jg_ihtm? pntCnvIhtm : pntCnv;
        }
	
	
    this.storeHiddenCanvas = function(i){
			this.bufferHtm[i] =  this.cnv.innerHTML;		 		 
	}

		
    this.restoreHiddenCanvas = function(i){		 
		 this.htm=this.bufferHtm[i];
	         this.cnv.innerHTML='';
	}

   this.drawBezier = function(x0,y0,x1,y1,x2,y2,x3,y3){
      var p0p1 = ((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0))>0?Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0)):0;
      var p1p2 = ((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))>0?Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)):0;
      var p2p3 = ((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2))>0?Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2)):0;
      var l = p0p1+p1p2+p2p3;
      var dt = 1/(l/20);
      var t=-dt;
      l = Math.round(l);
      var xx0=Math.round(x0);
      var yy0=Math.round(y0);
      for(var i=0;i<=l/20;i++){
        t+=dt;
        var t_2 = t*t;
        var t_3 = t_2*t;
        var o_t_2 = (1-t)*(1-t);
        var o_t_3 = (o_t_2)*(1-t);
	var xx1=Math.round(o_t_3*x0+3*t*o_t_2*x1+3*t_2*(1-t)*x2+t_3*x3);
	var yy1=Math.round(o_t_3*y0+3*t*o_t_2*y1+3*t_2*(1-t)*y2+t_3*y3);
        this.drawLine(xx0,yy0,xx1,yy1);
        xx0=xx1;yy0=yy1;
      }
    }
   
    this.sketchBezier = function(x0,y0,x1,y1,x2,y2,x3,y3,iteration, isLast){

       if(iteration <= 0){ 
          this.fillRect(x0-1,y0-1,2,2);	  
          if (isLast) {
          	this.fillRect(x3-1,y3-1,2,2);
          }
          return;
       }       

       if(iteration==undefined){
         iteration=3;
         this.fillRect(x3-2,y3-2,4,4);	  
       }
       var res = splitBezier(x0,y0,x1,y1,x2,y2,x3,y3);
       this.sketchBezier(res[0],res[1],res[2],res[3],res[4],res[5],res[6],res[7],iteration-1, false);
       this.sketchBezier(res[8],res[9],res[10],res[11],res[12],res[13],res[14],res[15],iteration-1, true);

    }
    

    this.drawDiv = function(left,top,width,height,div){
      left = width>0?left:(left+width);
      top = height>0?top:(top+height);      
      width = width>0?width:(-width);
      height = height>0?height:(-height);

      this.htm+="<DIV style=\"OVERFLOW: hidden; POSITION: absolute; LEFT: "+left+"px; TOP: "+top+"px; WIDTH: "+width+"px; HEIGHT: "+height+"px;\">";
      this.htm+=div.innerHTML;
      this.htm+="</DIV>";
    } 
    
    this.mkDiv = mkDiv;  
    
    this.drawEllipse2 = function(x, y, w, h)
	{
		var step = Math.round(Math.pow(Math.max(Math.abs(w),Math.abs(h)),0.25))-1;
		var magicConst = 0.2761423749154;
		var hmagicConst = 0.2761423749154*h;
		var wmagicConst = 0.2761423749154*w;
		
		var xw2 = (2*x+w)/2;
		var yh2 = (2*y+h)/2;
		var fyh2 = Math.floor(yh2);
		var fxw2 = Math.floor(xw2);
		var fxw2wpm = Math.floor(xw2+wmagicConst);
		var fyh2hmm = Math.floor(yh2-hmagicConst)
		var fyh2hpm =  Math.floor(yh2+hmagicConst);
		var fxw2wmm = Math.floor(xw2-wmagicConst);
		var xw = x+w;
		var yh = y+h;
						
		this.sketchBezier(fxw2,y,fxw2wpm,y,xw,fyh2hmm,xw,fyh2,step);
		this.sketchBezier(xw,fyh2,xw,fyh2hpm,fxw2wpm,yh,fxw2,yh,step);
		this.sketchBezier(fxw2,yh,fxw2wmm,yh,x,fyh2hpm,x,fyh2,step);
     	this.sketchBezier(x,fyh2,x,fyh2hmm,fxw2wmm,y,fxw2,y,step);
		
	};
	
	this.drawLine2 = function(x, y, w, h) 
	{
		var step = Math.round(Math.pow(Math.max(Math.abs(w-x),Math.abs(h-y)),0.3))-2;
		var p1x = Math.floor(3*x/4+w/4);
		var p1y = Math.floor(3*y/4+h/4);
		var p2x = Math.floor(x/4+3*w/4);
		var p2y = Math.floor(y/4+3*h/4);
		this.sketchBezier(x,y,p1x,p1y,p2x,p2y,w,h,step);
	}


   this.setPrintable(false);
}



function integer_compare(x,y)
{
	return (x < y) ? -1 : ((x > y)*1);
}


function collinear(x0,y0,x1,y1,x2,y2){
   var eps = 0.01;
   var l0 = Math.sqrt(x0*x0+y0*y0);
   var l1 = Math.sqrt(x1*x1+y1*y1);
   var l2 = Math.sqrt(x2*x2+y2*y2);
   var res = (x0*x1+y0*y1)/(l0*l1)>=(1-eps) && (x1*x2+y1*y2)/(l1*l2)>=(1-eps);
   return res;   
}


function splitBezier(x0,y0,x1,y1,x2,y2,x3,y3){
  var first = new Array();
  first[0] = Math.floor((x0+x1)/2);
  first[1] = Math.floor((y0+y1)/2);
  first[2] = Math.floor((x1+x2)/2);
  first[3] = Math.floor((y1+y2)/2);
  first[4] = Math.floor((x2+x3)/2);
  first[5] = Math.floor((y2+y3)/2);
  var second = new Array();
  second[0] = Math.floor((first[0]+first[2])/2);
  second[1] = Math.floor((first[1]+first[3])/2);
  second[2] = Math.floor((first[2]+first[4])/2);
  second[3] = Math.floor((first[3]+first[5])/2);
  var third = new Array();
  third[0] = Math.floor((second[0]+second[2])/2);
  third[1] = Math.floor((second[1]+second[3])/2);

  var res = new Array();
  res[0] = x0;
  res[1] = y0;
  res[2] = first[0];
  res[3] = first[1];
  res[4] = second[0];
  res[5] = second[1];
  res[6] = third[0];
  res[7] = third[1];

  res[8] = third[0];
  res[9] = third[1];
  res[10] = second[2];
  res[11] = second[3];
  res[12] = first[4];
  res[13] = first[5];
  res[14] = x3;
  res[15] = y3;

  return res;  
}