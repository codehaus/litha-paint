var browser = window.navigator.userAgent;

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
im_plus.src="img/context_menu/plus.gif";

var im_minus = document.createElement("img");
im_minus.src="img/context_menu/minus.gif";

var im_toline = document.createElement("img");
im_toline.src="img/context_menu/to_line.gif";

var im_split = document.createElement("img");
im_split.src="img/context_menu/split.gif";

var im_continue = document.createElement("img");
im_continue.src="img/context_menu/continue.gif";

var im_tocurve = document.createElement("img");
im_tocurve.src="img/context_menu/to_curve.gif";

var im_cusp = document.createElement("img");
im_cusp.src="img/context_menu/cusp.gif";

var im_smooth = document.createElement("img");
im_smooth.src="img/context_menu/smooth.gif";

var im_join = document.createElement("img");
im_join.src="img/context_menu/join.gif";

var im_joinset = document.createElement("img");
im_joinset.src="img/context_menu/join_set.gif";

var im_joinwith = document.createElement("img");
im_joinwith.src="img/context_menu/join_with.gif";

var canvas;
var workspace;
var scrap = new Array();
var bufferScrap = new Array();

var request = false;

var baseURL = "";
var url = baseURL+"/xmlpool";

//init fontBar
var hiddenSpan;
fontFamily	= 'Arial';
fontSize	= '20px';
fontWeight	= 'normal';
fontStyle	= 'normal';
textDecoration = 'none';

strokeWidth			= 1;
strokeDasharray		= '2 1';
strokeLinecap		= 'round'; //default
strokeLinejoin		= 'bevel';//default
strokeMiterlimit	= 4;//default


var objFontPanel;
//end

//start colorPicker
var mgn;

strokeColor = '#000000';
strokeOpacity = 1;
fillColor = 'alpha';
fillOpacity = 1;
fillRule = "nonzero";
params = new Array();
var colorPicker;
linePickerID = 'linePikerID';
params = new Array();
var linePicker;

var projectWidth=2000;
var projectHeight=2000;

var clientWidth=0;
var clientHeight=0;

var scrapWidth = 200;
var scrapHeight = 200;

var scrapCountX = 10;
var scrapCountY = 10;
var scrapCount = scrapCountX*scrapCountY;

var message1;

var fpane;

var curProjectName="document";

function initWorkSpace(){
  hiddenSpan = document.createElement("span");
  hiddenSpan.setAttribute('id', 'hiddenSpan');
  hiddenSpan.style.visibility = 'hidden';
  document.body.appendChild(hiddenSpan);

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
	//img.style.zIndex = -1;   
	var id = document.createAttribute("id");
	id.value=i+"_"+j;
	var width = document.createAttribute("width");
	width.value = scrapWidth;
	var height = document.createAttribute("height");
	height.value = scrapHeight;
	var src = document.createAttribute("src");
	src.value = "img/alpha.PNG";
	var border = document.createAttribute("border");
	border.value=1;
	
	img.setAttributeNode(id);
	img.setAttributeNode(width);
	img.setAttributeNode(height);
	img.setAttributeNode(src);
	//img.setAttributeNode(border);
	
	img.onmouseenter = enter;
	img.onmouseout = leave;


        document.getElementById("workspace").appendChild(img);
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
      if(img){document.getElementById("workspace").removeChild(img);}
    }
  }    
}

function enter(){
	canvas.setCapture();
}

function leave(){
	if(document.releaseCapture)document.releaseCapture();
}


function retrieveClientSize(){
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  clientWidth = myWidth-verScrollbarWidth;// a width of scrollbars
  clientHeight = myHeight-horScrollbarWidth;  
  if (fitWorkspace) changeDimension();
  refreshWorkspace();
}

function changeDimension(){
  var newWidth = Math.min(projectWidth,clientWidth-canvas_x);
  var newHeight = Math.min(projectHeight,clientHeight-canvas_y);
//    var newWidth = clientWidth-canvas_x;
//    var newHeight = clientHeight-canvas_y;


  //if(clientWidth-canvas_x>minWSWidth && clientHeight-canvas_y>minWSHeight){
    if(canvas.style.display == "none" || workspace.style.display == "none"){
      //canvas.style.display = "block"
      //workspace.style.display = "block"
      //message1.style.display = "none";
    }
    canvas.style.width = newWidth;
    canvas.style.height = newHeight;
    //canvas.style.clip = "rect(0 "+newWidth+" "+newHeight+" 0)";
    workspace.style.width = newWidth;
    workspace.style.height = newHeight;
    //workspace.style.clip = "rect(0 "+newWidth+" "+newHeight+" 0)"; 
    wsx1 = newWidth;
    wsy1 = newHeight;  
  /*} else{
    canvas.style.display = "none";
    workspace.style.display = "none";
    message1.style.display = "block";
  }*/
}

function initial_document(){             
       if (parent.lpcbBeforeInit) parent.lpcbBeforeInit();
       var document_width = 2000;
       var document_height = 2000;
       
       sendObjectWithoutDisplay(new Array(document_width,document_height),"new_document");
       projectWidth = 2000;
       projectHeight = 2000;
       clearWorkSpace();
       clearr();
       focusedBez = new Array();
       mousee = new Array();
       reflected = new Array();
       scrapCountX = Math.ceil(parseInt(document_width)/parseInt(scrapWidth));
       scrapCountY = Math.ceil(parseInt(document_height)/parseInt(scrapHeight));
       scrapCount = scrapCountX*scrapCountY;
       canvas.style.width = projectWidth;
       canvas.style.height = projectHeight;       
       initWorkSpace();
       canvas.style.display="block";
       jg = new jsGraphics("canvas",projectWidth,projectHeight);
       switchArrow();
}

function initCanvas() {
  jg = new jsGraphics("canvas",2000,2000);
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
  
  canvas = document.getElementById("canvas");
  workspace = document.getElementById("workspace");
  hiddenSpan	= document.getElementById('hiddenSpan');
  objFontPanel = new fontBar();
  objFontPanel.initState();
  mgn = new windowManager();
  colorPicker = new ColorPicker();
  colorPicker.initPanelColor();
  colorPickerID = 'colorPickerID';
  mgn.addWindow(50, 120, 240, 280, colorPickerID, colorPicker.getColorPicker, '', params, showColor);
  linePicker  = new LinePicker();
  linePicker.init(linePickerID);
  mgn.addWindow(50, 120, 320, 270, linePickerID, linePicker.getLinePicker, '', params, showLinePicker);
  
  message1 = document.getElementById("message1");
  canvas.style.display = "block";
  fpane = document.getElementById("font_pane");
  if (fpane) fpane.style.display = "block";
  initial_document();
  retrieveClientSize();
  showSplashScreen();
  canvas.onmouseenter=enter;
  canvas.onmouseleave=leave;
  window.onresize = retrieveClientSize;
}