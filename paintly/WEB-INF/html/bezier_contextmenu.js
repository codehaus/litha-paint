var joinStartPoint = new Array();
var bezMenuWidth=58;
var bezMenuHeight=140;


function showContextMenuBez(x,y){
  contextmenu = new ContextMenu("LTACTXMN", zIdx);
  var itemIdx = 0;
  var menuItem = new MenuItem(itemIdx++,im_plus,"Add","addStepPointBez");
  contextmenu.setMenuItem(menuItem);
  if(focusedBez.length>8){
    menuItem = new MenuItem(itemIdx++,im_minus,"Delete","deleteStepPointBez");
    contextmenu.setMenuItem(menuItem);
  }

  if(focusedBez[focusedMobilePointNum-3][line]==0){
    menuItem = new MenuItem(itemIdx++,im_toline,"To Line","toLineBez");
    contextmenu.setMenuItem(menuItem);
    menuItem = new MenuItem(itemIdx++,im_cusp,"Cusp","cuspBez");
    contextmenu.setMenuItem(menuItem);
    menuItem = new MenuItem(itemIdx++,im_smooth,"Smooth","smoothBez");
    contextmenu.setMenuItem(menuItem);
  }else{
    menuItem = new MenuItem(itemIdx++,im_tocurve,"To Curve","toCurveBez");
    contextmenu.setMenuItem(menuItem);
  }
  if(focusedMobilePointNum-3==6 || focusedMobilePointNum-3==focusedBez.length-1){
    menuItem = new MenuItem(itemIdx++,im_continue,"Continue","continueBez");
    contextmenu.setMenuItem(menuItem);
  }

  if((focusedMobilePointNum-3>6 && focusedMobilePointNum-3<focusedBez.length-1) || (focusedMobilePointNum-3==6 && focusedBez[focusedBez.length-1][termProp]) || (focusedMobilePointNum-3==focusedBez.length-1 && focusedBez[focusedMobilePointNum-3][termProp])){
    menuItem = new MenuItem(itemIdx++,im_split,"Split","splitBez");
    contextmenu.setMenuItem(menuItem);
  }

  if(focusedMobilePointNum-3==6 || focusedMobilePointNum-3==focusedBez.length-1){//terminal point
    if(joinStartPoint.length==0 && focusedBez[focusedBez.length-1][termProp] != 1){//set join start point
      menuItem = new MenuItem(itemIdx++,im_joinset,"Set Join Point","setJoinStartPoint");
      contextmenu.setMenuItem(menuItem);
    }else if (joinStartPoint.length>0){//perform join
      menuItem = new MenuItem(itemIdx++,im_joinwith,"Join With","joinBez");
      contextmenu.setMenuItem(menuItem);
    }
  }

  if(joinStartPoint.length>0){
      menuItem = new MenuItem(itemIdx++,im_minus,"Reset Join Point","resetJoinStartPoint");
      contextmenu.setMenuItem(menuItem);
  }

  contextmenu.setCallBackOnClose("_closeBezMenuCallBack");
  if(canvas_x+wsx1<=x+bezMenuWidth){x-=bezMenuWidth}
  if(canvas_y+wsy1<=y+bezMenuHeight){y-=bezMenuHeight}
  contextmenu.show(x,y);
}

function addStepPointBez(){
  var s;
  var e;
  if(focusedMobilePointNum-4>=6){
    s=focusedMobilePointNum-4;
    e=focusedMobilePointNum-3;
  }
  else{
    s=focusedMobilePointNum-3;
    e=focusedMobilePointNum-2;
  }

  var res = splitBezier(focusedBez[s][p][0],focusedBez[s][p][1],focusedBez[s][m][0],focusedBez[s][m][1],focusedBez[e][r][0],focusedBez[e][r][1],focusedBez[e][p][0],focusedBez[e][p][1]);
  for(var i=focusedBez.length;i>e;i--){
    focusedBez[i] = new Array();
    focusedBez[i][p] = new Array();
    focusedBez[i][m] = new Array();
    focusedBez[i][r] = new Array();
    focusedBez[i][p][0]=focusedBez[i-1][p][0];
    focusedBez[i][p][1]=focusedBez[i-1][p][1];
    focusedBez[i][m][0]=focusedBez[i-1][m][0];
    focusedBez[i][m][1]=focusedBez[i-1][m][1];
    focusedBez[i][r][0]=focusedBez[i-1][r][0];
    focusedBez[i][r][1]=focusedBez[i-1][r][1];
    focusedBez[i][couple]=focusedBez[i-1][couple];
    focusedBez[i][termProp]=focusedBez[i-1][termProp];
    focusedBez[i][line]=focusedBez[i-1][line];
  }

  focusedBez[s][p][0] = res[0];
  focusedBez[s][p][1] = res[1];
  focusedBez[s][m][0] = res[2];
  focusedBez[s][m][1] = res[3];

  focusedBez[e][p][0] = res[6];
  focusedBez[e][p][1] = res[7];

  focusedBez[e][m][0] = res[10];
  focusedBez[e][m][1] = res[11];
  focusedBez[e][r][0] = res[4];
  focusedBez[e][r][1] = res[5];
  focusedBez[e][couple] = true;
  focusedBez[e][termProp] = 0;
  focusedBez[e][line] = 0;


 
  focusedBez[e+1][p][0] = res[14];
  focusedBez[e+1][p][1] = res[15];

  focusedBez[e+1][r][0] = res[12];
  focusedBez[e+1][r][1] = res[13];
  
  finishBezier();
  sendObject(focusedBez,"update");
  contextmenu.close(true);
}

function deleteStepPointBez(){
  var s;
  var e;
  if(focusedMobilePointNum-4>=6 && focusedMobilePointNum-2<focusedBez.length){
    s=focusedMobilePointNum-4;
    e=focusedMobilePointNum-2;
    var i;
    for(i=e;i<focusedBez.length;i++){
      focusedBez[i-1][p][0]=focusedBez[i][p][0];
      focusedBez[i-1][p][1]=focusedBez[i][p][1];
      focusedBez[i-1][m][0]=focusedBez[i][m][0];
      focusedBez[i-1][m][1]=focusedBez[i][m][1];
      focusedBez[i-1][r][0]=focusedBez[i][r][0];
      focusedBez[i-1][r][1]=focusedBez[i][r][1];
      focusedBez[i-1][couple]=focusedBez[i][couple];
      focusedBez[i-1][termProp]=focusedBez[i][termProp];
      focusedBez[i-1][line]=focusedBez[i][line];
    }

    focusedBez.length--;
    e--;
    focusedBez[s][m][0]+=(focusedBez[s][m][0]-focusedBez[s][p][0]);
    focusedBez[s][m][1]+=(focusedBez[s][m][1]-focusedBez[s][p][1]);
    focusedBez[s][r][0]-=(focusedBez[s][p][0]-focusedBez[s][r][0]);
    focusedBez[s][r][1]-=(focusedBez[s][p][1]-focusedBez[s][r][1]);

    focusedBez[e][m][0]+=(focusedBez[e][m][0]-focusedBez[e][p][0]);
    focusedBez[e][m][1]+=(focusedBez[e][m][1]-focusedBez[e][p][1]);
    focusedBez[e][r][0]-=(focusedBez[e][p][0]-focusedBez[e][r][0]);
    focusedBez[e][r][1]-=(focusedBez[e][p][1]-focusedBez[e][r][1]);
    mousee = new Array();
    reflected = new Array();
    finishBezier();
    createFocusedBezDiv(focusedBez);
    sendObject(focusedBez,"update");


    contextmenu.close(true);     
    return;
  }    
  if(focusedMobilePointNum-3==6){
    for(i=7;i<focusedBez.length;i++){
      focusedBez[i-1][p][0]=focusedBez[i][p][0];
      focusedBez[i-1][p][1]=focusedBez[i][p][1];
      focusedBez[i-1][m][0]=focusedBez[i][m][0];
      focusedBez[i-1][m][1]=focusedBez[i][m][1];
      focusedBez[i-1][r][0]=focusedBez[i][r][0];
      focusedBez[i-1][r][1]=focusedBez[i][r][1];
      focusedBez[i-1][couple]=focusedBez[i][couple];
      focusedBez[i-1][termProp]=focusedBez[i][termProp];
      focusedBez[i-1][line]=focusedBez[i][line];
    }

    focusedBez.length--;
    mousee = new Array();
    reflected = new Array();
    finishBezier();
    createFocusedBezDiv(focusedBez);
    sendObject(focusedBez,"update");	

    contextmenu.close(true);     
    return;
  }
  if(focusedMobilePointNum-3==focusedBez.length-1){
    focusedBez[focusedBez.length-2][termProp] = focusedBez[focusedBez.length-1][termProp];
    focusedBez.length--;
    mousee = new Array();
    reflected = new Array();
    finishBezier();
    createFocusedBezDiv(focusedBez);
    sendObject(focusedBez,"update");
    contextmenu.close(true);     
    return;
  }
}

function toLineBez(){
  var point =focusedMobilePointNum-3;
  focusedBez[point][line]=1;
  focusedBez[point][m][0] = focusedBez[point][p][0];
  focusedBez[point][m][1] = focusedBez[point][p][1];
  focusedBez[point][r][0] = focusedBez[point][p][0];
  focusedBez[point][r][1] = focusedBez[point][p][1];
  mousee = new Array();
  reflected = new Array();
  if(point-1>=6){//to line previous stepPoint
    focusedBez[point-1][line]=1;
    focusedBez[point-1][m][0] = focusedBez[point-1][p][0];
    focusedBez[point-1][m][1] = focusedBez[point-1][p][1];
    focusedBez[point-1][r][0] = focusedBez[point-1][p][0];
    focusedBez[point-1][r][1] = focusedBez[point-1][p][1];    
  }

  saveBezToUndoRedoLog("update");
  bezierModified=false;
  createFocusedBezDiv(focusedBez);
  sendObject(focusedBez,"update");
  contextmenu.close(true);
}

function toCurveBez(){
  var point =focusedMobilePointNum-3;
  focusedBez[point][line]=0;
  focusedBez[point][couple]=true;
  saveBezToUndoRedoLog("update");
  bezierModified=false;
  //this is a invisible modification, so do not send bezier to the server for rerendering
  createFocusedBezDiv(focusedBez);
  canvas.style.cursor="default";
  contextmenu.close(true);
}


function cuspBez(){
  focusedBez[focusedMobilePointNum-3][couple] = false;
  contextmenu.close(true);    
}

function smoothBez(){
  focusedBez[focusedMobilePointNum-3][couple] = true;
  contextmenu.close(true);    
}

function continueBez(){
  bezSteps = new Array();
  if(focusedMobilePointNum-3==focusedBez.length-1){
     var first = 6;
     var last = focusedBez.length;
     var delta =1;
  }
  else if(focusedMobilePointNum-3==6){
     var first = focusedBez.length-1;
     var last = 5;
     var delta =-1;
  }

  var i=first;
  while(i!=last){
      var l = bezSteps.length;
      bezSteps[l] = new Array();
      bezSteps[l][p] = new Array();
      bezSteps[l][m] = new Array();
      bezSteps[l][r] = new Array();
    
      bezSteps[l][p][0] = focusedBez[i][p][0];
      bezSteps[l][p][1] = focusedBez[i][p][1];
      bezSteps[l][m][0] = delta==1?focusedBez[i][m][0]:focusedBez[i][r][0];
      bezSteps[l][m][1] = delta==1?focusedBez[i][m][1]:focusedBez[i][r][1];
      bezSteps[l][r][0] = delta==1?focusedBez[i][r][0]:focusedBez[i][m][0];
      bezSteps[l][r][1] = delta==1?focusedBez[i][r][1]:focusedBez[i][m][1];

      bezSteps[l][couple] = focusedBez[i][couple];
      bezSteps[l][termProp] = focusedBez[i][termProp];
      bezSteps[l][line] = focusedBez[i][line];
      i+=delta;
  }
  
  idd=focusedBez[5][0];
  contextmenu.close(false);
  switchBezier();
}

function closeBezMenuCallBack(){
  focusedMobilePointNum=-1;
}

function splitBez(){
  if(focusedMobilePointNum-3==6){
    focusedBez[focusedBez.length-1][termProp]=0;
    focusedBez[focusedBez.length-1][line]=0;
    var l=focusedBez.length;
    focusedBez[l] = new Array();
    focusedBez[l][p] = new Array();
    focusedBez[l][m] = new Array();
    focusedBez[l][r] = new Array();
    focusedBez[l][p][0]=focusedBez[6][p][0];
    focusedBez[l][p][1]=focusedBez[6][p][1];
    focusedBez[l][m][0]=focusedBez[6][m][0];
    focusedBez[l][m][1]=focusedBez[6][m][1];
    focusedBez[l][r][0]=focusedBez[6][r][0];
    focusedBez[l][r][1]=focusedBez[6][r][1];
    focusedBez[l][couple] = focusedBez[6][couple];
    focusedBez[l][termProp] = 0;
    focusedBez[l][line] = focusedBez[6][line];
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("update");
    sendObject(focusedBez,"update");
    contextmenu.close(true);    
  }
  else if(focusedMobilePointNum-3>6 && focusedBez[focusedBez.length-1][termProp]==0){
    var bezInfo = new Array(focusedBez[5][0],new Array(focusedBez[5][1][0],focusedBez[5][1][1],focusedBez[5][1][2],focusedBez[5][1][3],focusedBez[5][1][4],focusedBez[5][1][5],focusedBez[5][1][6]),new Array(focusedBez[5][2][0],focusedBez[5][2][1],focusedBez[5][2][2]));
    var focusedBez4split = new Array(focusedBez[0],focusedBez[1],focusedBez[2],focusedBez[3],focusedBez[4],bezInfo);
    for(var i=6;i<focusedBez.length;i++){
      focusedBez4split[i] = new Array();
      focusedBez4split[i][p] = new Array();
      focusedBez4split[i][m] = new Array();
      focusedBez4split[i][r] = new Array();

      focusedBez4split[i][p][0] = focusedBez[i][p][0];
      focusedBez4split[i][p][1] = focusedBez[i][p][1];
      focusedBez4split[i][m][0] = focusedBez[i][m][0];
      focusedBez4split[i][m][1] = focusedBez[i][m][1];
      focusedBez4split[i][r][0] = focusedBez[i][r][0];
      focusedBez4split[i][r][1] = focusedBez[i][r][1];

      focusedBez4split[i][couple] = focusedBez[i][couple];      
      focusedBez4split[i][termProp] = focusedBez[i][termProp];      
      focusedBez4split[i][line] = focusedBez[i][line];      
    }
    
    focusedBez.length = focusedMobilePointNum-2;
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("update");
    sendObjectWithoutDisplay(focusedBez,"update");
    drawFocusedBez();
    lostFocus();

    bezInfo = new Array(curFigureId++,new Array(bezInfo[1][0],bezInfo[1][1],bezInfo[1][2],bezInfo[1][3],bezInfo[1][4],bezInfo[1][5],bezInfo[1][6]), new Array(bezInfo[2][0],bezInfo[2][1],bezInfo[2][2]));
    focusedBez = new Array("bezier",left,top,width,height,bezInfo);
    for(var i=0;i<focusedBez4split.length-(focusedMobilePointNum-3);i++){
      focusedBez[6+i] = new Array();
      focusedBez[6+i][p] = new Array();
      focusedBez[6+i][m] = new Array();
      focusedBez[6+i][r] = new Array();

      focusedBez[6+i][p][0] = focusedBez4split[focusedMobilePointNum-3+i][p][0];
      focusedBez[6+i][p][1] = focusedBez4split[focusedMobilePointNum-3+i][p][1];

      focusedBez[6+i][m][0] = focusedBez4split[focusedMobilePointNum-3+i][m][0];
      focusedBez[6+i][m][1] = focusedBez4split[focusedMobilePointNum-3+i][m][1];

      focusedBez[6+i][r][0] = focusedBez4split[focusedMobilePointNum-3+i][r][0];
      focusedBez[6+i][r][1] = focusedBez4split[focusedMobilePointNum-3+i][r][1];

      focusedBez[6+i][couple] = focusedBez4split[focusedMobilePointNum-3+i][couple];
      focusedBez[6+i][termProp] = focusedBez4split[focusedMobilePointNum-3+i][termProp];
      focusedBez[6+i][line] = focusedBez4split[focusedMobilePointNum-3+i][line];
    }
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("delete");
    sendObjectWithoutDisplay(focusedBez,"insert");
    mousee = new Array(); reflected = new Array(); node = new Array();
    createFocusedBezDiv(focusedBez);

    drawFocusedBez();

    contextmenu.close(true);    
  }
  else if(focusedMobilePointNum-3>6 && focusedBez[focusedBez.length-1][termProp]==1){
    var focusedBez4split = new Array();
    j=6;
    for(var i=focusedMobilePointNum-3;i<focusedBez.length;i++){
      focusedBez4split[j] = new Array();
      focusedBez4split[j][p] = new Array(focusedBez[i][p][0],focusedBez[i][p][1]);
      focusedBez4split[j][m] = new Array(focusedBez[i][m][0],focusedBez[i][m][1]);
      focusedBez4split[j][r] = new Array(focusedBez[i][r][0],focusedBez[i][r][1]);     
      focusedBez4split[j][couple] = focusedBez[i][couple];      
      focusedBez4split[j][termProp] = 0;
      focusedBez4split[j][line] = focusedBez[i][line];
      j++;
    }
    for(var i=6;i<=focusedMobilePointNum-3;i++){
      focusedBez4split[j] = new Array();
      focusedBez4split[j][p] = new Array(focusedBez[i][p][0],focusedBez[i][p][1]);
      focusedBez4split[j][m] = new Array(focusedBez[i][m][0],focusedBez[i][m][1]);
      focusedBez4split[j][r] = new Array(focusedBez[i][r][0],focusedBez[i][r][1]);     
      focusedBez4split[j][couple] = focusedBez[i][couple];      
      focusedBez4split[j][termProp] = 0;
      focusedBez4split[j][line] = focusedBez[i][line];
      j++;
    }
    

    focusedBez.length=6;
    for(var i=6;i<focusedBez4split.length;i++){
      focusedBez[i] = new Array();
      focusedBez[i][p] = new Array();
      focusedBez[i][m] = new Array();
      focusedBez[i][r] = new Array();

      focusedBez[i][p][0] = focusedBez4split[i][p][0];
      focusedBez[i][p][1] = focusedBez4split[i][p][1];

      focusedBez[i][m][0] = focusedBez4split[i][m][0];
      focusedBez[i][m][1] = focusedBez4split[i][m][1];

      focusedBez[i][r][0] = focusedBez4split[i][r][0];
      focusedBez[i][r][1] = focusedBez4split[i][r][1];

      focusedBez[i][couple] = focusedBez4split[i][couple];
      focusedBez[i][termProp] = focusedBez4split[i][termProp];
      focusedBez[i][line] = focusedBez4split[i][line];
    }
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("update");
    sendObjectWithoutDisplay(focusedBez,"update");
    mousee = new Array(); reflected = new Array(); node = new Array();
    createFocusedBezDiv(focusedBez);

    drawFocusedBez();

    contextmenu.close(true);    
  }
}

function setJoinStartPoint(){
  if((focusedMobilePointNum-3==6 || focusedMobilePointNum-3==focusedBez.length-1) && focusedBez[focusedBez.length-1][termProp] != 1){
    joinStartPoint = new Array(focusedBez[5][0],focusedMobilePointNum-3);  
  }
  contextmenu.close(true);    
}

function joinBez(){
  if(focusedBez[5][0] == joinStartPoint[0] && focusedMobilePointNum-3!=joinStartPoint[1]){
    focusedBez.length--;
    focusedBez[focusedBez.length-1][termProp]=1;
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("update");
    sendObject(focusedBez,"update");
    mousee = new Array(); reflected = new Array(); node = new Array();
    createFocusedBezDiv(focusedBez);
    drawFocusedBez();
    joinStartPoint = new Array();
    contextmenu.close(true);    
  }  
  else if(focusedBez[5][0] != joinStartPoint[0]){
    //if history doesn't contain join start point anymore - return
    if(regionHistory[joinStartPoint[0]].length<joinStartPoint[1]){
      joinStartPoint = new Array();
      contextmenu.close(true);        
      return;
    }

    var joinedBezInfo = new Array(regionHistory[joinStartPoint[0]][5][0],new Array(regionHistory[joinStartPoint[0]][5][1][0],regionHistory[joinStartPoint[0]][5][1][1],regionHistory[joinStartPoint[0]][5][1][2],regionHistory[joinStartPoint[0]][5][1][3],regionHistory[joinStartPoint[0]][5][1][4],regionHistory[joinStartPoint[0]][5][1][5],regionHistory[joinStartPoint[0]][5][1][6]), new Array(regionHistory[joinStartPoint[0]][5][2][0],regionHistory[joinStartPoint[0]][5][2][1],regionHistory[joinStartPoint[0]][5][2][2]));
    var joinedBez = new Array(regionHistory[joinStartPoint[0]][0],regionHistory[joinStartPoint[0]][1],regionHistory[joinStartPoint[0]][2],regionHistory[joinStartPoint[0]][3],regionHistory[joinStartPoint[0]][4],joinedBezInfo);
    var i = 0;
    var i_delta = 0;
    var lastStep = 0;

    //take first part of joined bezier from history buffer
    if(joinStartPoint[1]==regionHistory[joinStartPoint[0]].length-1){
      i=6;
      i_delta=1;
      lastStep = regionHistory[joinStartPoint[0]].length-1;
    }
    else if(joinStartPoint[1]==6){
      i=regionHistory[joinStartPoint[0]].length-1;
      lastStep=6;
      i_delta=-1;
    }
    while(i!=lastStep){
     var l = joinedBez.length;
     joinedBez[l] = new Array();
     joinedBez[l][p] = new Array(regionHistory[joinStartPoint[0]][i][p][0],regionHistory[joinStartPoint[0]][i][p][1]);
     joinedBez[l][m] = new Array(i_delta==1?regionHistory[joinStartPoint[0]][i][m][0]:regionHistory[joinStartPoint[0]][i][r][0],i_delta==1?regionHistory[joinStartPoint[0]][i][m][1]:regionHistory[joinStartPoint[0]][i][r][1]);
     joinedBez[l][r] = new Array(i_delta==1?regionHistory[joinStartPoint[0]][i][r][0]:regionHistory[joinStartPoint[0]][i][m][0],i_delta==1?regionHistory[joinStartPoint[0]][i][r][1]:regionHistory[joinStartPoint[0]][i][m][1]);
     joinedBez[l][couple] = regionHistory[joinStartPoint[0]][i][couple];
     joinedBez[l][termProp] = 0;
     joinedBez[l][line] = regionHistory[joinStartPoint[0]][i][line];
     i+=i_delta;     
    }

    //take second part of joined bezier from focused bezier
    if(focusedMobilePointNum-3==6){
      i=6;
      i_delta=1;
      lastStep = focusedBez.length;
    }
    else if(focusedMobilePointNum-3==focusedBez.length-1){
      i=focusedBez.length-1;
      lastStep=5;
      i_delta=-1;
    }
    while(i!=lastStep){
     var l = joinedBez.length;
     joinedBez[l] = new Array();
     joinedBez[l][p] = new Array(focusedBez[i][p][0],focusedBez[i][p][1]);
     joinedBez[l][m] = new Array(i_delta==1?focusedBez[i][m][0]:focusedBez[i][r][0],i_delta==1?focusedBez[i][m][1]:focusedBez[i][r][1]);
     joinedBez[l][r] = new Array(i_delta==1?focusedBez[i][r][0]:focusedBez[i][m][0],i_delta==1?focusedBez[i][r][1]:focusedBez[i][m][1]);
     joinedBez[l][couple] = focusedBez[i][couple];
     joinedBez[l][termProp] = 0;
     joinedBez[l][line] = focusedBez[i][line];
     i+=i_delta;     
    }

    regionHistory[focusedBez[5][0]] = new Array();
    sendObject(focusedBez,"delete");
    //lostFocus(); lostFocus restores regionHistory[focusedBez[5][0]] wich we dont need because user would be able to select removed object
 
    //copy joined bezier to focusedBez and draw focused bezier
    var bezInfo = new Array(joinedBez[5][0],new Array(joinedBez[5][1][0],joinedBez[5][1][1],joinedBez[5][1][2],joinedBez[5][1][3],joinedBez[5][1][4],joinedBez[5][1][5],joinedBez[5][1][6]), new Array(joinedBez[5][2][0],joinedBez[5][2][1],joinedBez[5][2][2]));
    focusedBez = new Array(joinedBez[0],joinedBez[1],joinedBez[2],joinedBez[3],joinedBez[4],bezInfo);
    for(var i=6;i<joinedBez.length;i++){
      focusedBez[i] = new Array();
      focusedBez[i][p] = new Array(joinedBez[i][p][0],joinedBez[i][p][1]); 
      focusedBez[i][m] = new Array(joinedBez[i][m][0],joinedBez[i][m][1]); 
      focusedBez[i][r] = new Array(joinedBez[i][r][0],joinedBez[i][r][1]); 
      focusedBez[i][couple] = joinedBez[i][couple]; 
      focusedBez[i][termProp] = 0;
      focusedBez[i][line] = joinedBez[i][line]; 
    }

    //preclose actions
    calculateBezLTWH();focusedBez[1] = left;focusedBez[2] = top; focusedBez[3] = width; focusedBez[4] = height;
    saveBezToUndoRedoLog("delete");
    sendObject(focusedBez,"update");
    mousee = new Array(); reflected = new Array(); node = new Array();
    createFocusedBezDiv(focusedBez);

    drawFocusedBez();
    joinStartPoint = new Array();
    contextmenu.close(true);        
  }
}

function resetJoinStartPoint(){
  joinStartPoint = new Array();
  contextmenu.close(true);        
}