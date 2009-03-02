package com.paintly.renderer;

import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Set;

import com.paintly.renderer.shapes.Image;
import com.paintly.renderer.shapes.Shape;

/**
 * This class holds and manages a shapes that build up document in HashMap.
 * The HashMap consists of document fragments {@link com.paintly.renderer.DocumentFragment#DocumentFragment(Shape)}
 * There is rarely a need to use this class directly, rather by Renderer {@link com.paintly.renderer.Renderer#Renderer(CanvasScrapHolder, DocumentHolder)}  
 * @author VyacheslavE
 * @version Apr 14, 2006
 */
public class DocumentHolder {


    /**
     * Stores document fragments and provides access by id
     */
    private LinkedHashMap documentFragments = new LinkedHashMap();




    /**
     * Retrieves a such fragments which do intersects with specified regions set.  
     * @param regions a set of rectangular areas we want intersected shapes for. 
     * @return LinkedHashMap which contains subset of documentFragments field. 
     */
    LinkedHashMap retrieveFragmentsIntersectedWithRegions(Set regions){
        LinkedHashMap res = new LinkedHashMap();
        if(regions!=null && regions.size()>0){
            Iterator it1 = documentFragments.keySet().iterator();
            while(it1.hasNext()){
                Integer id = (Integer)it1.next();
                DocumentFragment fragment = (DocumentFragment)documentFragments.get(id);
                Iterator it2 = regions.iterator();
                while(it2.hasNext()){
                    Rectangle nextRegion = (Rectangle)it2.next();
                    if(fragment.getRect().intersects(nextRegion) && !fragment.isDeleted()){
                        res.put(id,fragment);
                        break;
                    }
                }
            }
        }
        return res;
    }

    /**
     * Retrieves a such fragments which do intersects with specified regions set and is below given shape.  
     * @param regions a set of rectangular areas we want intersected shapes for.
     * @param identifier id of shape below wich we are searching for a fragments  
     * @return LinkedHashMap which contains subset of documentFragments field. 
     */
    LinkedHashMap retrieveFragmentsIntersectedWithRegionsBelow(Set regions, Integer identifier){
        LinkedHashMap res = new LinkedHashMap();
        if(regions!=null && regions.size()>0 && identifier!=null){
            Iterator it1 = documentFragments.keySet().iterator();
            while(it1.hasNext()){
                Integer id = (Integer)it1.next();
                if(id.equals(identifier)){
                    break;
                }
                DocumentFragment fragment = (DocumentFragment)documentFragments.get(id);
                Iterator it2 = regions.iterator();
                while(it2.hasNext()){
                    Rectangle nextRegion = (Rectangle)it2.next();
                    if(fragment.getRect().intersects(nextRegion) && !fragment.isDeleted()){
                        res.put(id,fragment);
                        break;
                    }
                }
            }
        }
        return res;
    }

    /**
     * Retrieves a such fragments which do intersects with specified regions set and is above given shape.  
     * @param regions a set of rectangular areas we want intersected shapes for.
     * @param identifier id of a shape wich above we are searching for regions 
     * @return LinkedHashMap which contains subset of documentFragments field. 
     */
    LinkedHashMap retrieveFragmentsIntersectedWithRegionsAbove(Set regions, Integer identifier){
        LinkedHashMap res = new LinkedHashMap();
        boolean omit = true;
        if(regions!=null && regions.size()>0 && identifier!=null){
            Iterator it1 = documentFragments.keySet().iterator();
            while(it1.hasNext()){
                Integer id = (Integer)it1.next();
                if(id.equals(identifier)){
                    omit = false;
                    continue;
                }
                if(omit){
                    continue;
                }
                DocumentFragment fragment = (DocumentFragment)documentFragments.get(id);
                Iterator it2 = regions.iterator();
                while(it2.hasNext()){
                    Rectangle nextRegion = (Rectangle)it2.next();
                    if(fragment.getRect().intersects(nextRegion) && !fragment.isDeleted()){
                        res.put(id,fragment);
                        break;
                    }
                }
            }
        }
        return res;
    }

    /**
     * Adds a document fragment into fragments LinkedHashMap
     * @param identifier id
     * @param fragment which we want to add
     */
    public void addFragment(Integer identifier, DocumentFragment fragment){
        DocumentFragment fragment1 = (DocumentFragment)documentFragments.get(identifier);
        if(fragment1!=null){
            Shape element = fragment1.getElement();
            Shape element2 = fragment.getElement();
            if(element instanceof Image && element2 instanceof Image && "".equals(((Image)element2).getBase64encoded())){
                ((Image)element2).setBase64encoded(((Image)element).getBase64encoded());
            }
        }

        documentFragments.put(identifier,fragment);

    }

    /**
     * Updates a document fragment with the given identifier
     * @param identifier
     * @param fragment at which we update
     */
    void updateFragment(Integer identifier, DocumentFragment fragment){
        DocumentFragment fragment1 = (DocumentFragment)documentFragments.get(identifier);
        if(fragment1!=null){
            Shape element = fragment1.getElement();
            Shape element2 = fragment.getElement();
            if(element instanceof Image && element2 instanceof Image && "".equals(((Image)element2).getBase64encoded())){
                ((Image)element2).setBase64encoded(((Image)element).getBase64encoded());
            }
        }
        documentFragments.put(identifier,fragment);
    }

    /**
     * Removes a DocumentFragment with given identifier
     * @param identifier id of the shape to remove 
     */
    void deleteFragment(Integer identifier){
        DocumentFragment fragment = (DocumentFragment)documentFragments.get(identifier);
        if(fragment!=null){
            if(fragment.getElement() instanceof Image){
                fragment.setDeleted(true);//do not delete image phisically, cause we could not undo delete command in that case
            }
            else{
                documentFragments.remove(identifier);
            }
        }
    }

    /**
     * Retrieve all fragments 
     * @return documentFragments
     */
    LinkedHashMap retrieveFragmentsAll(){
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        Iterator it = documentFragments.keySet().iterator();
        while(it.hasNext()){
            Integer id = (Integer)it.next();
            DocumentFragment fragment = retrieveFragment(id);
            if(!fragment.isDeleted())linkedHashMap.put(id,fragment);
        }

        return linkedHashMap;
    }

    /**
     * Retrieves DocumentFragment for given identifier
     * @param identifier
     * @return a DocumentFragment
     */
    DocumentFragment retrieveFragment(Integer identifier){
        DocumentFragment documentFragment = (DocumentFragment) documentFragments.get(identifier);
        return documentFragment;
    }

    /**
     * Retrieves all document fragments except one give in parameter
     * @param identifier id of documentFragment which is need to be ommited
     * @param interest set of rectange regions that define region of interest
     * @return documentFragments collection
     */
    LinkedHashMap retrieveFragmentsExceptOne(Integer identifier, Set interest){
        LinkedHashMap res = new LinkedHashMap(documentFragments);
        if(res.containsKey(identifier)) res.remove(identifier);
        if(interest != null && interest.size()>0){
            Iterator it1 = res.keySet().iterator();
            LinkedHashMap res2 = new LinkedHashMap();
            while(it1.hasNext()){
                Integer id = (Integer)it1.next();
                DocumentFragment fragment = (DocumentFragment)res.get(id);
                Iterator it2 = interest.iterator();
                while(it2.hasNext()){
                    Rectangle nextRegion = (Rectangle)it2.next();
                    if(fragment.getRect().intersects(nextRegion) && !fragment.isDeleted()){
                        res2.put(id,fragment);
                        break;
                    }
                }
            }
            res = res2;
        }
        return res;
    }

    /**
     * puts back a shape with id = identifier
     * @param identifier
     * @return list of shapes with a new order
     */
    public ArrayList bringBack(Integer identifier){
        ArrayList res = new ArrayList();
        LinkedHashMap newDocumentFragments = new LinkedHashMap();
        DocumentFragment fragment1;
        DocumentFragment fragment2;
        Iterator i = documentFragments.keySet().iterator();
        Integer id1 = null;
        fragment1 = null;
        if(i.hasNext()){
            id1 = (Integer)i.next();
            fragment1 = (DocumentFragment)documentFragments.get(id1);
        }
        if(!i.hasNext()){
            return res;
        }
        boolean addNext = false;
        while(i.hasNext()){
            Integer id2 = (Integer)i.next();
            fragment2 = (DocumentFragment)documentFragments.get(id2);
            if(!id2.equals(identifier)){
                newDocumentFragments.put(id1,fragment1);
                if(addNext){
                   res.add(fragment1);
                   addNext = false;
                }
                id1=id2;
                fragment1=fragment2;

            }
            else{
                newDocumentFragments.put(id2,fragment2);
                res.add(fragment2);
                addNext = true;
            }
        }
        newDocumentFragments.put(id1,fragment1);
        if(addNext){
          res.add(fragment1);
          addNext = false;
        }
        documentFragments = newDocumentFragments;
        return res;
    }

    /**
     * Brigs to top a shape with a given identifier
     * @param identifier
     * @return document with the new order
     */
    public ArrayList bringFront(Integer identifier){
        ArrayList res = new ArrayList();
        LinkedHashMap newDocumentFragments = new LinkedHashMap();
        DocumentFragment fragment1;
        DocumentFragment fragment2;
        Iterator i = documentFragments.keySet().iterator();
        Integer id1 = null;
        fragment1 = null;

        boolean addNext = false;
        while(i.hasNext()){
            Integer id2 = (Integer)i.next();
            fragment2 = (DocumentFragment)documentFragments.get(id2);
            if(!id2.equals(identifier)){
                newDocumentFragments.put(id2,fragment2);
                if(addNext){
                   newDocumentFragments.put(id1,fragment1);
                   res.add(fragment1);
                   res.add(fragment2);
                   addNext = false;
                }
                id1=id2;
                fragment1=fragment2;

            }
            else{
                fragment1=fragment2;
                id1=id2;
                addNext = true;
                if(!i.hasNext()){
                    newDocumentFragments.put(id1,fragment1);
                }
            }
        }
        documentFragments = newDocumentFragments;
        return res;
    }

    /**
     * Brings to top a shape with the given identifier
     * @param identifier
     * @return document with the new order
     */
    ArrayList bringTop(Integer identifier){
        ArrayList res = new ArrayList();
        LinkedHashMap newDocumentFragments = new LinkedHashMap();
        DocumentFragment fragment1;
        DocumentFragment fragment2;
        Iterator i = documentFragments.keySet().iterator();
        Integer id1 = null;
        fragment1 = null;
        while(i.hasNext()){
            Integer id2 = (Integer)i.next();
            fragment2 = (DocumentFragment)documentFragments.get(id2);
            if(!id2.equals(identifier)){
                newDocumentFragments.put(id2,fragment2);
            }
            else{
                fragment1 = fragment2;
                id1 = id2;
            }
        }
        if(id1!=null){
            newDocumentFragments.put(id1,fragment1);
            res.add(fragment1);
        }
        documentFragments = newDocumentFragments;
        return res;
    }

    /**
     * Brings bottom a shape with the given identifier
     * @param identifier
     * @return document with the new order of shapes
     */
    ArrayList bringBottom(Integer identifier){
        ArrayList res = new ArrayList();
        LinkedHashMap newDocumentFragments = new LinkedHashMap();
        DocumentFragment fragment1;
        DocumentFragment fragment2;
        Iterator i = documentFragments.keySet().iterator();
        Integer id1 = identifier;
        fragment1 = (DocumentFragment)documentFragments.get(id1);
        if(id1!=null){
            newDocumentFragments.put(id1,fragment1);
            res.add(fragment1);
        }
        while(i.hasNext()){
            Integer id2 = (Integer)i.next();
            fragment2 = (DocumentFragment)documentFragments.get(id2);
            if(!id2.equals(identifier)){
                newDocumentFragments.put(id2,fragment2);
            }            
        }

        documentFragments = newDocumentFragments;
        return res;
    }

    public String toString(){
        String res="<documentholder>\n";
        Iterator it = documentFragments.keySet().iterator();
        while(it.hasNext()){
           Integer id = (Integer)it.next();
           DocumentFragment docFragment = (DocumentFragment)documentFragments.get(id);
           res+=docFragment.toString()+"\n";
        }
        res+="</documentholder>\n";
        return res;
    }

}
