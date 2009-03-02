var zIdx = 2000;
var sessionId;
var browser = window.navigator.userAgent;
var canvasId = "canvas";
var workspaceId = "workspace";
var cssPrefix="";

var jg;
var ellipseV;
var squareV;
var arrowV;
var singlelineV;
var polylineV;
var polygonV;
var bezierV;
var textV;
var penV;
var lassoV;
var handV;
var applyStrokeColor;
var applyFillColor;
var importV;

var im_plus = document.createElement("img");
im_plus.src=baseURL+"/"+"img/context_menu/plus.gif";

var im_minus = document.createElement("img");
im_minus.src=baseURL+"/"+"img/context_menu/minus.gif";

var im_toline = document.createElement("img");
im_toline.src=baseURL+"/"+"img/context_menu/to_line.gif";

var im_split = document.createElement("img");
im_split.src=baseURL+"/"+"img/context_menu/split.gif";

var im_continue = document.createElement("img");
im_continue.src=baseURL+"/"+"img/context_menu/continue.gif";

var im_tocurve = document.createElement("img");
im_tocurve.src=baseURL+"/"+"img/context_menu/to_curve.gif";

var im_cusp = document.createElement("img");
im_cusp.src=baseURL+"/"+"img/context_menu/cusp.gif";

var im_smooth = document.createElement("img");
im_smooth.src=baseURL+"/"+"img/context_menu/smooth.gif";

var im_join = document.createElement("img");
im_join.src=baseURL+"/"+"img/context_menu/join.gif";

var im_joinset = document.createElement("img");
im_joinset.src=baseURL+"/"+"img/context_menu/join_set.gif";

var im_joinwith = document.createElement("img");
im_joinwith.src=baseURL+"/"+"img/context_menu/join_with.gif";

var canvas;
var workspace;
var scrap = new Array();
var bufferScrap = new Array();

var request = false;

var url = baseURL+"/geom";
var url2scrap = baseURL+"/scraps";

//init fontBar
var hiddenSpan;
var fontFamily	= 'Arial';
var fontSize	= '20px';
var fontWeight	= 'normal'; //could be bold
var fontStyle	= 'normal'; //could be italic
var textDecoration = 'none'; // could be underline, overline, line-through, inherit
var hiddenSpanId = "hiddenSpan_BlinxCanvElId";

var strokeWidth			= 1; //could be integer >= 1;
var strokeDasharray		= '2 1'; //could be '2 1 43 3'
var strokeLinecap		= 'round'; //default. could be "butt", "square", "inherit"
var strokeLinejoin		= 'bevel';//default. could be "miter", "round", "inherit"
var strokeMiterlimit	= 4;//default could be float >= 1.



//start colorPicker
var strokeColor = '#000000';
var strokeOpacity = 1;
var fillColor = 'alpha';
var fillOpacity = 1;
var fillRule = "nonzero"; //could ba also an "evenodd"
var params = new Array();
var colorPicker;
var linePickerID = 'linePikerID';
var params = new Array();
var linePicker;

var projectWidth=2000;
var projectHeight=2000;

var canvasWidth = 0;
var canvasHeight = 0;

var clientWidth=0;
var clientHeight=0;

var bgcolor = 'alpha';

var scrapWidth = 200;
var scrapHeight = 200;

var scrapCountX = 10;
var scrapCountY = 10;
var scrapCount = scrapCountX*scrapCountY;

var message1;

var fpane;

var curProjectName="document";

function initWorkSpace(){
  if (document.getElementById(hiddenSpanId) == null) {
	  hiddenSpan = document.createElement("span");
	  hiddenSpan.setAttribute('id', hiddenSpanId);
	  hiddenSpan.style.visibility = 'hidden';
	  document.body.appendChild(hiddenSpan);
  }

  scrollVectorX = 0;
  scrollVectorY = 0;

  for(var i=0;i<scrapCountY;i++){
    scrap[i] = new Array();	
    //bufferScrap[i] = new Array();
    for(var j=0;j<scrapCountX;j++){
	var img = document.createElement("img");
	img.style.position="absolute";
	img.style.left = j*scrapWidth+"px";
	img.style.top = i*scrapHeight+"px"; 
	var id = document.createAttribute("id");
	id.value=i+"_"+j;
	var width = document.createAttribute("width");
	width.value = scrapWidth;
	var height = document.createAttribute("height");
	height.value = scrapHeight;
	var src = document.createAttribute("src");
	src.value = baseURL+"/"+"img/alpha.PNG";
	var border = document.createAttribute("border");
	border.value=1;
	
	img.setAttributeNode(id);
	img.setAttributeNode(width);
	img.setAttributeNode(height);
	img.setAttributeNode(src);
	//img.setAttributeNode(border);
	
	img.onmouseenter = enter;
	img.onmouseout = leave;


        document.getElementById(workspaceId).appendChild(img);
	//img = document.getElementById(i+"_"+j);
        if(document.all){
          img.width = 200;
          img.height = 200;
        }
	scrap[i][j] = img;

     }

  }
}


function clearWorkSpace(){
  focusedBez = new Array();
  regionHistory = new Array();
  mousee = new Array();
  reflected = new Array();
  node = new Array();
  focusedText = new Array();
  undoRedoLog = new Array();
  undoRedoLogOper = new Array();
  undoRedoPtr = -1;
  copyPasteBuffer = new Array();
  pastedCount=0;
  rotCenter = new Array();
  rotStartVector = new Array();
  rotEndVector = new Array();
  mobilePoint = new Array();
  focusedMobilePointNum = -1;
  joinStartPoint = new Array();
  clearr();  
  for(var i=0;i<scrapCountY;i++){      
    for(var j=0;j<scrapCountX;j++){
      var img = document.getElementById(i+"_"+j);
      if(img){document.getElementById(workspaceId).removeChild(img);}
    }
  }    
}

function enter(){
	canvas.setCapture();
}

function leave(){
	if(document.releaseCapture)document.releaseCapture();
}



function initial_document(){             
       if (parent.lpcbBeforeInit) parent.lpcbBeforeInit();
       var document_width = projectWidth;
       var document_height = projectHeight;
       
       sendObject(new Array(document_width,document_height, bgcolor),"new_document");
       clearWorkSpace();
       clearr();
       focusedBez = new Array();
       mousee = new Array();
       reflected = new Array();
       scrapCountX = Math.ceil(parseInt(document_width)/parseInt(scrapWidth));
       scrapCountY = Math.ceil(parseInt(document_height)/parseInt(scrapHeight));
       scrapCount = scrapCountX*scrapCountY;
       canvas.style.width = canvasWidth;
       canvas.style.height = canvasHeight;       
       initWorkSpace();
       canvas.style.display="block";
       jg = new jsGraphics(canvasId,canvasWidth,canvasHeight);
       switchArrow();
}

function initCanvas() {
  var rnd = ""+Math.random();
  sessionId = rnd.substr(2,5);
  jg = new jsGraphics(canvasId, projectWidth, projectHeight);
  ellipseV = document.getElementById("ellipse");
  squareV = document.getElementById("square");
  arrowV = document.getElementById("arrow");
  singlelineV = document.getElementById("singleline");
  polylineV = document.getElementById("polyline");
  polygonV = document.getElementById("polygon");
  bezierV = document.getElementById("bezier");
  textV = document.getElementById("text");
  penV = document.getElementById("pen");
  lassoV = document.getElementById("lasso");
  handV = document.getElementById("hand");
  applyStrokeColor = document.getElementById("applyStrokeColor");
  applyFillColor = document.getElementById("applyFillColor");
  importV = document.getElementById("import");
  canvas = document.getElementById(canvasId);
  workspace = document.getElementById(workspaceId);
  hiddenSpan = document.getElementById(hiddenSpanId);
  
  message1 = document.getElementById("message1");
  canvas.style.display = "block";
  fpane = document.getElementById("font_pane");
  if (fpane) fpane.style.display = "block";
  initial_document();
  canvas.onmouseenter=enter;
  canvas.onmouseleave=leave;
  if (fitWorkspace) {
    retrieveClientSize();
    changeDimension();
    refreshWorkspace();    
    window.onresize = doFitWorkspace;
  }
  
  setTimeout("_iniServicetStatistic();",60000);
}

function doFitWorkspace(){
  retrieveClientSize();
  changeDimension();
  refreshWorkspace();    
}