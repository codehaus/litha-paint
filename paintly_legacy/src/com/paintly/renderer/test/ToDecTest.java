package com.paintly.renderer.test;

public class ToDecTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		byte idd[] = {'1','2','3'};
    	int i=0;
    	int d = 0;
    	while(i<idd.length){    	
    		int d1 = idd[i]-48;    		    	
    		d +=(d1)*Math.exp((idd.length-i-1)*Math.log(10)); 
    		i+=1;
    	}
    	System.out.println(d);

	}

}
