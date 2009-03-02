Thank you for choosing Litha-Paint.

You have a three projects in the delivery folder:

a) paintly_legacy : Litha-Paint graphics editor;
b) Blinx  : server side code of graphics engine;
c) paintly : client side code of graphics engine;

In order to build Litha-Paint graphics editor you need to run deploy.test.war target of paintly_legacy/build.xml. Make sure that build.xml:/tomcat_webapp property points to correct folder.
In order to run application, make sure you have created all directories listed in paintly.windows (or paintly.linux).


In order to build Litha-Paint graphics engine you need to perform two stage process:
1) On the first stage, build the client side code. Run paintly/build.xml:/build.test.win target. The ant would append all javascript source file into one big file paintly\tmp\index.js.
2) on the second stage, build the server side code. 
  a) open blinx.js and fild the following string : m4_include(c:\work\soflow\paintly\tmp\index.js). Fix the path to paintly\tmp\index.js created on the previous stage.
  b) run Blinx/build.xml:/deploy.test.win target which is default one.


As in the previous case, make sure the property build.xml:/tomcat_webapp points to correct tomcat folder. 
Before starting the application, you need to have directories listed in litha.linux (or litha.windows) to be created.


NOTE: the port where tomcat is listening is assumed to be 6946.
NOTE: All neccessary libraries you may find in the following folders: Blinx\lib and paintly_legacy\lib.

If you encounter any troubles during building, write to litha.paint@gmail.com.
