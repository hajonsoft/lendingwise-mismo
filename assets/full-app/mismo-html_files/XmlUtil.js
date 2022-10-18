
 /**************************************************
  XML HTTP Messaging for Client server Communication  
 ****************************************************/
 
function getResponse(url,queryString) {
    try{
        try {
            xmlHttp = new XMLHttpRequest()
        } catch (e) { 
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {  
               xmlHttp = false; 
            }
        }
        if (!xmlHttp) return null;
            //xmlHttp.overrideMimeType("text/xml");
            xmlHttp.open("POST", url, false);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.send(queryString);
            return (xmlHttp.responseText+"");
        } catch (e) {
            return e.message; 
        }
    }
    
 /*************************************************************************
  Loading XML document using XML HTTP messaging to parse xml nodes, compatible 
  for both Mozilla and IE
 ****************************************************************************/
 
function getXMLDoc(url,queryString) {
    var xmlDoc;
    var moz = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined');
    if (moz) {

        try {
            var parser = new DOMParser(); 
            xmlDoc = parser.parseFromString(getResponse(url, queryString), "text/xml");
            xmlDoc.async=false;
        } catch(e) {
	    alert('Error : '+e);
        }
    }  else {
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(getResponse(url,queryString));
        }  catch(e) {
      	    alert('Error : '+e);
	}        
    }
        return xmlDoc;
}  
var obj;
function getNewObject(objName) {
    try{
        obj = document.getElementById(objName);
        while(obj.options.length > 1) {
            obj.options[obj.options.length-1] = null;
        }
        obj.options[0] = new Option(" [Select] ","",false);
        return obj;
    } catch (e) {
            return e.message; 
    }
}