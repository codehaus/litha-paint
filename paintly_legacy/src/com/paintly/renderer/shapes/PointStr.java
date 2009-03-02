package com.paintly.renderer.shapes;

/**
 * Created by IntelliJ IDEA.
 * User: Администратор
 * Date: 22.05.2006
 * Time: 14:59:11
 * To change this template use File | Settings | File Templates.
 */
public class PointStr {
    String x=null;
    String y=null;
    PointStr(String x, String y){
        this.x = x;
        this.y = y;
    }

    public String getX() {
        return x;
    }

    public String getY() {
        return y;
    }
}
