package com.paintly.performancetest;

import java.text.NumberFormat;
import java.util.Locale;

/**
 * Created by IntelliJ IDEA.
 * User: Администратор
 * Date: 25.08.2006
 * Time: 13:44:07
 * To change this template use File | Settings | File Templates.
 */
public class FormatorTest {
	
	/**
	 * main method
	 * @param s
	 */
    public static void main(String[] s){
        NumberFormat formator = NumberFormat.getInstance(Locale.ENGLISH);
        System.out.println(formator.format(4.545857487));
    }
}
