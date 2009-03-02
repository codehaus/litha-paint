package com.blinx.renderer;

import java.awt.Rectangle;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashSet;
import java.util.Set;

/**
 * This class contains some useful operation of 2D geometry such as calculation of supplement of rectangle etc.
 * @author VyacheslavE
 * @version Apr 14, 2006
 */
public class Utils {
    
    /**
     * Calculates supplement of rect1 to rect2 
     * @param rect1
     * @param rect2
     * @return set of rectangles
     */
    // TODO: implement
    public static Set calculateRectSupplementary(Rectangle rect1, Rectangle rect2){
        Set res = new HashSet();
        res.add(rect2);
        return res;       
    }

    /**
     * Calculates union of rect1 with rect2
     * @return union
     */
    // TODO: implement
    public static Set calculateRectUnion(Rectangle rect1, Rectangle rect2) {
        Set res = new HashSet();
        res.add(rect1);
        res.add(rect2);
        return res;
    }

    /**
     * Calculates a digest for byte array
     * @param scrapData byte array for which we need to calculate digest
     * @return digest or zero-length array in case of error
     */
    public static byte[] calculateDigest(byte[] scrapData) {
        MessageDigest md = null;
        byte[] res = new byte[0];
        try {            
            md = MessageDigest.getInstance("MD5");
            res = md.digest(scrapData);
        } catch (NoSuchAlgorithmException e) {            
            e.printStackTrace();     
        }        
        return res;
    }

    
    /**
     * Checks if two byte arrays is identical 
     * @param dig1 first byte array
     * @param dig2 second bytes array
     * @return true if first byte array is identical to second byte array
     */
    public static boolean digestsEquals(byte[] dig1, byte[] dig2) {        
        int length = dig1.length;
        boolean res = length==dig2.length?true:false;
        for(int i=0; i<length && res; i++){
            if(dig1[i]!=dig2[i]) res = false;
        }
        return res;
    }
    
    public static String removeCRs(String str){
    	String res = "";
    	res = str.replaceAll("\n","");
    	res = res.replaceAll("\r","");
    	return res;
    }

    public static  double[][] mulMatrixes(double[][] mx1, double[][] mx2) {
        double[][] res = new double[3][3];
        for(int i=0;i<3;i++){
            for(int j=0;j<3;j++){
                for(int k=0;k<3;k++){
                    res[i][j] = res[i][j]+(mx1[i][k]*mx2[k][j]);
                }
                res[i][j] = Math.round(res[i][j]*10000)/10000.0;
            }
        }
        return res;
    }


    public static double[][] calculateTransform(Rectangle rect1, Rectangle rect2, double[][] oldTransform) {
      double[][] res1 = new double[3][3];
      java.util.Arrays.fill(res1[0],0.0);
      java.util.Arrays.fill(res1[1],0.0);
      java.util.Arrays.fill(res1[2],0.0);
      res1[0][0] = 1; res1[1][1] = 1; res1[2][2] = 1;

      double[][] res2 = new double[3][3];
      java.util.Arrays.fill(res2[0],0.0);
      java.util.Arrays.fill(res2[1],0.0);
      java.util.Arrays.fill(res2[2],0.0);
      res2[0][0] = 1; res2[1][1] = 1; res2[2][2] = 1;

      double [][] res;

      res1[2][0] = rect2.getX()-rect1.getX();
      res1[2][1] = rect2.getY()-rect1.getY();

      res2[0][0] = rect2.getWidth()/rect1.getWidth();
      res2[1][1] = rect2.getHeight()/rect1.getHeight();        

      res = mulMatrixes(res2,mulMatrixes(oldTransform,res1));

      return res;
   }

    public static Rectangle rectAbs(Rectangle rect) {
        Rectangle res = new Rectangle(rect.width>0?rect.x:rect.x+rect.width,rect.height>0?rect.y:rect.y+rect.height,Math.abs(rect.width),Math.abs(rect.height));
        return res;
    }
}
