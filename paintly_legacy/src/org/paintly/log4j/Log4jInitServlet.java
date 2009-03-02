package org.paintly.log4j;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.PropertyConfigurator;

import com.paintly.Parser;
import com.paintly.renderer.ConstantsBulk;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Log4jInitServlet extends HttpServlet {

	public void init(ServletConfig config) throws ServletException {
        super.init(config);
		String prefix = config.getServletContext().getRealPath("/");
		String file = getInitParameter("log4j-init-file");
		// if the log4j-init-file is not set, then no point in trying
		if (file != null) {
			PropertyConfigurator.configure(prefix + file);
		}        
        String propertyFile = getInitParameter("paintly-init-file");
                
        try {
            Properties properties = new Properties();
            properties.load(new FileInputStream(prefix + propertyFile));            
            config.getServletContext().setAttribute(ConstantsBulk.PROPERTIES,properties);
            ConstantsBulk.TEMP_DIR = properties.getProperty("temp");
        } catch (IOException e) {
            System.out.println("IOException -> Can't load propertyFile:" + propertyFile+" "+e);
        }
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) {
	}
}