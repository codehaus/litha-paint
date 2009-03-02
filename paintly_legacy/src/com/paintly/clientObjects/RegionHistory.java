package com.paintly.clientObjects;

import java.util.Map;

/**
 * Represents regionHistory client side object on the server side
 * @author slava
 *
 */
public class RegionHistory extends ClientObject{
   /**
    * Pointer to the next free index of the regionHistory 
    */
   public String curFigureId = "";
   
   /**
    * Constructor
    * @param map
    */
   public RegionHistory(Map map){
       textContent = (String)map.get("text");
       curFigureId = (String)map.get("curfigureid");
       if(textContent.indexOf("<regionhistory")!=1) textContent ="";
   }
   
   
   public String toString(){
       String res = null;
       res = "<regionhistory curfigureid=\""+curFigureId+"\">";
       res+=textContent;
       res+="</regionhistory>";
       return res;
   }
}
