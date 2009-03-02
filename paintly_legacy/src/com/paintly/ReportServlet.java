package com.paintly;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.Date;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

/**
 * This servlet is bug-reporter
 * @author AlexanderP
 * @version July 16, 2006
 */
public class ReportServlet extends HttpServlet {    
	
	private static Logger log = Logger.getLogger(ReportServlet.class);
	
	private int iAuthor, iEmail, iDescription;

	private String fileReportName = "";
	
	public void init(ServletConfig config) throws ServletException {
		super.init(config);		
		Properties customProp = new Properties();
		try {			
	        String prefix = getServletContext().getRealPath("/");	        
	        String propertyFile = getInitParameter("paintly-init-file");
	        customProp.load(new FileInputStream(prefix + propertyFile));
			
			iAuthor = Integer.parseInt(customProp.getProperty("authorLength"));
			iAuthor = (iAuthor > 0) ? iAuthor : 30;

			iEmail = Integer.parseInt(customProp.getProperty("emailLength"));
			iEmail = (iEmail > 0) ? iEmail : 30;

			iDescription = Integer.parseInt(customProp.getProperty("descriptionLength"));
			iDescription = (iDescription > 0) ? iDescription : 700;

			fileReportName = customProp.getProperty("reportPath");
			
		} catch (IOException e) {
			log.error("IOException error: " + e.getLocalizedMessage());
		}
	}	
	
	public void doGet(HttpServletRequest req, HttpServletResponse res){

		String bugAuthor, bugEmail, bugBody;
		
		String smallDelimiter = "\n:";
		String bigDelimiter = "\n\n" + (new Date()).toString() + "------------------------------------------------\n\n";
		
		String resultReport = bigDelimiter;		

		boolean rightData = true;

		bugAuthor = req.getParameter("author");
		if (bugAuthor != null){
			stringFormatting(bugAuthor, iAuthor);
			resultReport += smallDelimiter + bugAuthor;			
		}else
			rightData = false;

		bugEmail = req.getParameter("email");
		if (bugEmail != null){
			stringFormatting(bugEmail, iEmail);
			resultReport += smallDelimiter + bugEmail;
		}

		bugBody = req.getParameter("description");
		if (bugBody != null){
			stringFormatting(bugBody, iDescription);
			resultReport += smallDelimiter + bugBody;
		}else
			rightData = false;
		
		if (rightData == true) {
			bug2file(resultReport);
		}
	}

	public void destroy() {
		//
	}

	synchronized private void bug2file(String resultReport) {
		FileChannel fChannel = null;
		try {
			
			fChannel = new RandomAccessFile(fileReportName, "rw").getChannel();
			fChannel.position(fChannel.size());
			fChannel.write(ByteBuffer.wrap(resultReport.getBytes()));
			
		} catch (IOException e) {
			log.error("IOException error: " + e.getLocalizedMessage());
		} finally {
			try {
				fChannel.close();
			} catch (IOException e) {
				log.error("Report file can't be closed");
			}
		}
	}

	private void stringFormatting(String param, int paramLength) {
		param = ((param.length() > paramLength) ? param.substring(0, paramLength) : param);
	}
}

