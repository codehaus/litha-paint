function bringFocusedBack(){

  if(focusedBez!=null && focusedBez.length>6){
    sendObject(new Array(focusedBez[5][0],0,0),"bring_back");
    return;
  }

  if(focusedText!=null && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
    sendObject(new Array(focusedText[5][0],0,0),"bring_back");
    return;
  }

  if(focusedImage!=null && focusedImage.length==6){
    sendObject(new Array(focusedImage[5],0,0),"bring_back");
    return;
  }

}

function bringFocusedFront(){

  if(focusedBez!=null && focusedBez.length>6){
    sendObject(new Array(focusedBez[5][0],0,0),"bring_front");
    return;
  }

  if(focusedText!=null && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
    sendObject(new Array(focusedText[5][0],0,0),"bring_front");
    return;
  }

  if(focusedImage!=null && focusedImage.length==6){
    sendObject(new Array(focusedImage[5],0,0),"bring_front");
    return;
  }

}

function bringFocusedTop(){

  if(focusedBez!=null && focusedBez.length>6){
    sendObject(new Array(focusedBez[5][0],0,0),"bring_top");
    return;
  }

  if(focusedText!=null && focusedText.length>6 && focusedText[6].length>0){
    sendObject(new Array(focusedText[5][0],0,0),"bring_top");
    return;
  }

  if(focusedImage!=null && focusedImage.length==6){
    sendObject(new Array(focusedImage[5],0,0),"bring_top");
    return;
  }

}

function bringFocusedBottom(){

  if(focusedBez!=null && focusedBez.length>6){
    sendObject(new Array(focusedBez[5][0],0,0),"bring_bottom");
    return;
  }

  if(focusedText!=null && focusedText.length>6 && focusedText[6] && focusedText[6].length>0){
    sendObject(new Array(focusedText[5][0],0,0),"bring_bottom");
    return;
  }

  if(focusedImage!=null && focusedImage.length==6){
    sendObject(new Array(focusedImage[5],0,0),"bring_bottom");
    return;
  }

}