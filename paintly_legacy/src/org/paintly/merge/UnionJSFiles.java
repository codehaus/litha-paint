package org.paintly.merge;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.Writer;
import java.util.Hashtable;

public class UnionJSFiles {

	static String pathToJS = "c:\\Temp\\obfusc\\";

	static String resultJS = "index.js";

	static Hashtable exceptJSFiles = new Hashtable();

	public static void main(String[] args) {

		exceptJSFiles.put("wz_jsgraphics.js", (String) "somth data");
		exceptJSFiles.put("tabber.js", (String) "somth data");		
		exceptJSFiles.put(resultJS, (String) "somth data");

		if (args != null && args.length != 0) {
			// args - if exists
			// 0 element - dir path
			// 1...n elements - merge except this fileNames

			pathToJS = args[0];

			if (args.length > 1) {
				for (int i = 1; i < args.length; i++) {
					exceptJSFiles.put(args[i], (String) "somth data");
				}// for
			}// if
		}// if
		System.out.println("Start appending ...");
		unionFiles();
		System.out.println("Appending is completed ...");
		System.out.println("Start delete ...");
		deleteFiles();
		System.out.println("Delete is completed ...");
	}

	private static void deleteFiles() {
		File filePathToJS = new File(pathToJS);
		File[] fileList = filePathToJS.listFiles(new JSFilter());

		for (int i = 0; i < fileList.length; i++) {
			if (null == exceptJSFiles.get(fileList[i].getName())) {
				 if(!fileList[i].delete()){
					 System.out.println(fileList[i].getAbsolutePath() + " - file does not deleted.");
				 }
			}
		}
	}

	private static void unionFiles() {
		File filePathToJS = new File(pathToJS);
		File[] fileList = filePathToJS.listFiles(new JSFilter());

		File resultFile = null;

		StringBuffer contents = new StringBuffer();
		BufferedReader input = null;
		Writer output = null;

		String tempVariable;
		try {
			if (fileList.length != 0) {
				resultFile = new File(pathToJS, resultJS);
			}
			for (int i = 0; i < fileList.length; i++) {
				tempVariable = (String) exceptJSFiles
						.get(fileList[i].getName());

				// read files except Hashtable keys - files
				if (tempVariable == null) {
					input = new BufferedReader(new FileReader(fileList[i]));
					String line = null;
					while ((line = input.readLine()) != null) {
						contents.append(line);
						contents.append("\n");
					}
					input.close();
				}
				contents.append(System.getProperty("line.separator"));
				output = new BufferedWriter(new FileWriter(resultFile));
				output.write(contents.toString());
			}
			output.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (output != null)
				try {
					output.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}
}

class JSFilter implements FilenameFilter {
	public boolean accept(File dir, String name) {
		return (name.endsWith(".js"));
	}
}
