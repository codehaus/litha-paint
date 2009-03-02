package com.paintly.renderer.test;

public class SplitTest {

    /**
     * @param args
     */
    public static void main(String[] args) {
       String points = "100 233,123 231,234 231";
       String point[] = points.split("\\s");
       for(int i=0;i<point.length;i++){
           System.out.println(point[i]);
       }

    }

}
