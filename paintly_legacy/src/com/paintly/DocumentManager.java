package com.paintly;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.paintly.exception.LithaOpenDocumentException;
import com.paintly.renderer.CanvasScrapHolder;
import com.paintly.renderer.ConstantsBulk;
import com.paintly.renderer.DocumentFragment;
import com.paintly.renderer.DocumentHolder;
import com.paintly.renderer.Renderer;
import com.paintly.renderer.SVGDocumentTools;
import com.paintly.renderer.shapes.Bezier;
import com.paintly.renderer.shapes.Image;
import com.paintly.renderer.shapes.Text;

/**
 * This utility class is intended for reading litha's documents.
 * @author slava
 *
 */
public class DocumentManager {
	
	private static Logger log = Logger.getLogger(DocumentManager.class);

	/**
	 * Reads given file, parses and renders it, stores ro the user session and return back to the client the information regionHistory could be restored from
	 * @param fileName name of file to be read
	 * @param save_dir the Home directory of user
	 * @param session user's session to store the documentHolder and canvasScrapHolder
	 * @return the string that hold pard of the document that would be used by client to restore regionHistory object 
	 * @throws LithaOpenDocumentException if given file could not be readen
	 */
    static public String openDocument(String fileName, String save_dir, HttpSession session) throws LithaOpenDocumentException {
        String res = "";
        FileReader fileReader=null;
        BufferedReader br = null;
        try {          
		  String fullFileName = save_dir+ConstantsBulk.FILESEPARATOR+fileName;
		  log .debug("opening "+fullFileName);
		  fileReader = new FileReader(fullFileName);          
		  br = new BufferedReader(fileReader);		  
          res = parseAndRenderDocument(session, br);          
        } catch (IOException e) {
          log.error(e,e);
        } 
        finally{
        	try {
				br.close();
				fileReader.close();
			} catch (IOException e) {
				log.error(e,e);
			}        	        
        }
        return res;
    }

    /**
     * Parse litha's document, render, and save documentHolder and canvasScrapHolder into session.
     * @param session session where canvasScrapHolder and document holder would be stored
     * @param br Buffered Reader the document would be stored in
     * @return the string that hold pard of the document that would be used by client to restore regionHistory object
     * @throws IOException if something go wrong
     * @throws LithaOpenDocumentException if can't read buffered reader
     */
	static public String parseAndRenderDocument(HttpSession session, BufferedReader br) throws IOException, LithaOpenDocumentException {
		String res = "";
		String line = "";
		int recognizedRootElements = 0;
          DocumentHolder documentHolder = new DocumentHolder();          
          CanvasScrapHolder canvas = null;
          while((line = br.readLine())!=null){
              if(line.indexOf("<documentholder>")!=-1){
            	  recognizedRootElements++;
                  DocumentFragment docFrag;
                  while((line = br.readLine()).indexOf("</documentholder>")==-1){                      
                      if(line.indexOf("<bezier")>-1){
                          Bezier bezier = new Bezier(line);                         
                          docFrag = new DocumentFragment(bezier);
                          documentHolder.addFragment(bezier.getID(),docFrag);                          
                      }
                      else if(line.indexOf("<text")>-1){
                          Text text = new Text(line);
                          docFrag = new DocumentFragment(text);
                          documentHolder.addFragment(text.getID(),docFrag);                  
                      }
                      else if(line.indexOf("<image")>-1){
                    	  Image image = new Image(line);                    	  
                    	  docFrag = new DocumentFragment(image);
                    	  documentHolder.addFragment(image.getID(),docFrag);
                      }                                            
                  }
                  session.setAttribute("documentHolder",documentHolder);          
              }
              else if(line.indexOf("<canvas")!=-1){
            	  recognizedRootElements++;
                  canvas = new CanvasScrapHolder(line);
                  session.setAttribute("canvasScrapHolder",canvas);
                  res+=line+"\n";
              }
              else{
                res+=line+"\n";
              }
          }
          Renderer renderer = new Renderer(canvas,documentHolder);          
          renderer.renderDocument();
        if(recognizedRootElements<2) throw new LithaOpenDocumentException("Document is corrupted");
		return res;
	}

	/**
	 * Publish document that is stored in DocumentHolder into given file name of given file type.
	 * @param fileName name of file to publish
	 * @param fileType type of file to publish
	 * @param publishDir directory to publish
	 * @param document DocumentHolder that holds document being published
	 * @param realWidth width of document in pixels
	 * @param realHeight heights of document in pixels
	 * @param userid GUID of the user from the session
	 * @return url the published document could be retrieved by.
	 */
	public static String publishDocument(String fileName, String fileType, String publishDir, DocumentHolder document, int realWidth, int realHeight, String userid) {
		log.debug("going to publish "+fileName+" "+fileType);
        Document svgDocument = SVGDocumentTools.assemble(document,realWidth,realHeight);
        if(!"".equals(fileName) && !"".equals(fileType) && realWidth>0 && realHeight>0){
            String fullPath = publishDir+ConstantsBulk.FILESEPARATOR+fileName;
			String fullPathUnpublish = fullPath+ConstantsBulk.DO_NOT_PUBLISH_SUFFIX;
			if("svg".equals(fileType)){
              String stringDocument = SVGDocumentTools.serialize2SVG(svgDocument);
              if(!fileName.toLowerCase().endsWith(".svg")){
                  fileName+=".svg";
                  fullPath+=".svg";
              }
              writeText(fullPath, fullPathUnpublish, stringDocument);
            }

            if("png".equals(fileType)){
                byte[] png = SVGDocumentTools.serialize2PNG(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".png")){
                    fileName+=".png";
                    fullPath+=".png";
                }
                writeBinary(fullPath, fullPathUnpublish, png);

            }

            if("jpg".equals(fileType)){
                byte[] jpg = SVGDocumentTools.serialize2JPEG(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".jpg") && !fileName.toLowerCase().endsWith(".jpeg")){
                    fileName+=".jpg";
                    fullPath+=".jpg";
                }
                writeBinary(fullPath, fullPathUnpublish, jpg);
            }

            if("tif".equals(fileType)){
                byte[] tif = SVGDocumentTools.serialize2TIFF(svgDocument,realWidth,realHeight);
                if(!fileName.toLowerCase().endsWith(".tif") && !fileName.toLowerCase().endsWith(".tiff")){
                    fileName+=".tif";
                    fullPath+=".tif";
                }
                writeBinary(fullPath, fullPathUnpublish, tif);
            }

        }
        return ConstantsBulk.LITHA_URL+"/public/"+userid+"/"+fileName;
    }
	

	private static void writeBinary(String fullPath, String fullPathUnpublish, byte[] data) {
		BufferedOutputStream bos = null;
		try {
		    bos = new BufferedOutputStream(new FileOutputStream(fullPath));
		    bos.write(data);
		    log.debug(fullPath + " has been writen.");
		} catch (FileNotFoundException e) {
		    log.error(e,e);
		} catch(IOException e){
		    log.error(e,e);
		}
		finally{
		    try {
		        bos.close();
		        File unpublishedFile = new File(fullPathUnpublish);
		        if (unpublishedFile.delete()) {
		        	log.debug(fullPathUnpublish + " has been deleted");
		        }
		    } catch (IOException e) {
		        log.error(e,e);
		    }
		}
	}

	private static void writeText(String fullPath, String fullPathUnpublish, String stringDocument) {
		BufferedWriter bw=null;
		  try {
		    bw = new BufferedWriter(new FileWriter(fullPath));
		    bw.write(stringDocument);
		    log.debug(fullPath+" has been writen");
		  } catch (IOException e) {
		    log.error(e,e);
		  }
		  finally{
		      try {
		        bw.close();
		        File unpublishedFile = new File(fullPathUnpublish);
		        if(unpublishedFile.delete()){
		        	log.debug(fullPathUnpublish + " has been deleted");
		        }
		    } catch (IOException e) {
		        log.error(e,e);
		    }
		  }
	}

	/**
	 * Saves a document content into file
	 * @param fileName the name of the file the document would be saved in
	 * @param saveDir the name of a dir the file would be stored in
	 * @param textContents the List of Strings that would create content of the saved file
	 * @param canvas CanvasScrapHolder
	 */
	public static void performSaveDocument(String fileName, String saveDir,
			List textContents, CanvasScrapHolder canvas) {
	
		// String saveDir = (String)session.getAttribute("save");
		// CanvasScrapHolder canvas = (CanvasScrapHolder
		// )session.getAttribute("canvasScrapHolder");
		FileOutputStream fileWriter = null;
		try {
			fileWriter = new FileOutputStream(saveDir
					+ ConstantsBulk.FILESEPARATOR + fileName);
			fileWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
					.getBytes());
			fileWriter.write("<document>\n".getBytes());
			for (int i = 0; i < textContents.size(); i++) {
				fileWriter.write(((String) textContents.get(i)).getBytes());
			}
			fileWriter.write(canvas.toString().getBytes());
			fileWriter.write("</document>".getBytes());
		} catch (IOException e) {
			log.error(e, e);
		} finally {
			try {
				if (fileWriter != null)
					fileWriter.close();
			} catch (IOException e) {
				log.error(e, e);
			}
		}
	}
	
	/**
	 * Delete document from published folder
	 * @param fileName
	 * @param publishDir
	 */
	public static void deletePublishedDocument(String fileName, String publishDir) {
		File publishedFile = new File(publishDir + ConstantsBulk.FILESEPARATOR
				+ fileName);
		File unpublishedFile = new File(publishDir
				+ ConstantsBulk.FILESEPARATOR + fileName
				+ ConstantsBulk.DO_NOT_PUBLISH_SUFFIX);
		if (publishedFile.canRead())
			publishedFile.delete();
		if (unpublishedFile.canRead())
			unpublishedFile.delete();
	}

	/**
	 * Unpublish a document from the folder
	 * @param fileName
	 * @param publishDir
	 */
	public static void unpublishDocument(String fileName, String publishDir) {
		File publishedFile = new File(publishDir + ConstantsBulk.FILESEPARATOR
				+ fileName);
		File unpublishedFile = new File(publishDir
				+ ConstantsBulk.FILESEPARATOR + fileName
				+ ConstantsBulk.DO_NOT_PUBLISH_SUFFIX);
		publishedFile.renameTo(unpublishedFile);
	}

	/**
	 * republish a document
	 * @param fileName
	 * @param publishDir
	 */
	public static void republishDocument(String fileName, String publishDir) {
		File unpublishedFile = new File(publishDir
				+ ConstantsBulk.FILESEPARATOR + fileName
				+ ConstantsBulk.DO_NOT_PUBLISH_SUFFIX);
		File publishedFile = new File(publishDir + ConstantsBulk.FILESEPARATOR
				+ fileName);
		unpublishedFile.renameTo(publishedFile);
	}

	/**
	 * Opens a workstate from the file into memory
	 * @param userid
	 * @param autosave_dir
	 * @param session
	 * @return String representation of the workstate
	 */
	public static String openWorkstate(String userid, String autosave_dir,
			HttpSession session) {
		String res = "";
		try {
			BufferedReader br = new BufferedReader(new FileReader(autosave_dir
					+ ConstantsBulk.FILESEPARATOR + "clientstate.xml"));
			String line = "";
			DocumentHolder documentHolder = null;
			CanvasScrapHolder canvas = null;
			while ((line = br.readLine()) != null) {
				if (line.indexOf("<documentholder>") != -1) {
					documentHolder = new DocumentHolder();
					while ((line = br.readLine()).indexOf("</documentholder>") == -1) {
						if (line.indexOf("<bezier") > -1) {
							Bezier bezier = new Bezier(line);
							DocumentFragment docFrag = new DocumentFragment(
									bezier);
							documentHolder.addFragment(bezier.getID(), docFrag);
						}
						if (line.indexOf("<text") > -1) {
							Text text = new Text(line);
							DocumentFragment docFrag = new DocumentFragment(
									text);
							documentHolder.addFragment(text.getID(), docFrag);
						} else if (line.indexOf("<image") > -1) {
							Image image = new Image(line);
							DocumentFragment docFrag = new DocumentFragment(
									image);
							documentHolder.addFragment(image.getID(), docFrag);
						}
					}
					session.setAttribute("documentHolder", documentHolder);
				} else if (line.indexOf("<canvas") != -1) {
					canvas = new CanvasScrapHolder(line);
					session.setAttribute("canvasScrapHolder", canvas);
					res += line + "\n";
				} else {
					res += line + "\n";
				}
			}
			Renderer renderer = new Renderer(canvas, documentHolder);
			renderer.renderDocument();
		} catch (IOException e) {
			log.error(e, e);
		}
		return res;
	}

	/**
	 * Lists files in the directory
	 * @param dir
	 * @return | separated files names
	 */
	public static String listFiles(String dir) {
		String res = "";
		File dirFile = new File(dir);
		String[] fileName = dirFile.list();
		for (int i = 0; i < fileName.length; i++) {
			res += fileName[i] + "|";
		}
		if (res.length() > 0) {
			res = res.substring(0, res.length() - 1);
		}
		res = "<list>" + res + "</list>";
		return res;
	}

	/**
	 * Lists diles in the puvlished directory
	 * @param userid
	 * @param dir
	 * @param session
	 * @return | separarted file list
	 */
	public static String listPublishedFiles(String userid, String dir,
			HttpSession session) {
		String res = "";
		File dirFile = new File(dir);
		if (dirFile.exists()) {
			String[] fileNames = dirFile.list();
			for (int i = 0; i < fileNames.length; i++) {
				String fileName = fileNames[i];
				String published = "pub";
				String url = ConstantsBulk.LITHA_URL + "/public/" + userid
						+ "/" + fileName;
				if (fileName.endsWith(ConstantsBulk.DO_NOT_PUBLISH_SUFFIX)) {
					published = "unpub";
					fileName = fileName.substring(0, fileName.length()
							- ConstantsBulk.DO_NOT_PUBLISH_SUFFIX.length());
					url = "";
				}
				res += fileName + "^" + published + "^" + url + "|";
			}
			if (res.length() > 0) {
				res = res.substring(0, res.length() - 1);
			}
			res = "<list>" + res + "</list>";
		}
		return res;
	}

	/**
	 * Checks if the given file exists
	 * @param userid
	 * @param fileName
	 * @param save_dir
	 * @param session
	 * @return "yes" or "no"
	 */
	public static String ifFileExists(String userid, String fileName,
			String save_dir, HttpSession session) {
		try {
			BufferedReader br = new BufferedReader(new FileReader(save_dir
					+ ConstantsBulk.FILESEPARATOR + fileName));

			if (br.readLine() != null) {
				return "yes";
			} else {
				return "no";
			}
		} catch (IOException e) {
			return "no";
		}
	}

	/**
	 * Deletes a document from the file system
	 * @param userid
	 * @param fileName
	 * @param save_dir
	 * @param session
	 */
	public static void deleteDocument(String userid, String fileName,
			String save_dir, HttpSession session) {
		new File(save_dir + ConstantsBulk.FILESEPARATOR + fileName).delete();
	}

	/**
	 * Saves a workspaces into file
	 * @param textContents
	 * @param session
	 */
	public static void performSaveWorkspace(List textContents, HttpSession session) {

		String autosaveDir = (String) session.getAttribute("autosave");
		CanvasScrapHolder canvas = (CanvasScrapHolder) session
				.getAttribute("canvasScrapHolder");
		try {
			BufferedWriter bw = new BufferedWriter(new FileWriter(autosaveDir
					+ ConstantsBulk.FILESEPARATOR + "clientstate.xml"));
			bw.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
			bw.write("<workstate>\n");
			for (int i = 0; i < textContents.size(); i++) {
				bw.write((String) textContents.get(i));
			}
			bw.write(canvas.toString());
			bw.write("</workstate>");
			bw.close();
		} catch (IOException e) {
			log.error(e, e);
		}

	}



}
