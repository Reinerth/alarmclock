'use strict'; /* Used traditional syntax and ES5, except "let". */



/** Here is the BEGINNING (the entry-point to the application):
 * We reserve a namespace ("alarmclock") for the application, 
 * wherein we attach our classes and the configurations of the application
 * and we would load here-in also the model-content, means e.g. JSON-files or database-content.
 * But in this app we dont need AJAX-calls, JSON-files and database at all.
 * Here is the place to deposit content which has to be reachable from the complete application.
*/


// NOTE: Dont change this. Here are not user settings.
// For changing the configuration of the app look in the file usersettings.js in the root.
window.alarmclock = {
    "decription"                :"An alarm-clock based on JavaScript",
    "language"                  :"en",
    "name"                      :"alarmclock",
    "version"                   :"1.0",
    "displayLeftTime"           :true,
    "displayLightAlarm"         :false,
    "displayTestSound"          :false,
    "soundFile"                 :"",
    "soundFilePath"             :"./mvc/view/sound/",
    "backgroundColor"           :"silver",
    "backgroundImage"           :false,
    "backgroundImagePath"       :"./mvc/view/img/",
    "precision"                 :10,

    /** This function "makeAJAXRequest" 
     * can be used for AJAX-requests without or with parameters
     * e.g. for json- or php-files.
     * @param {string} callMeWhenReady - The name of the callbackfunction from the class
     * @param {string} url - The request-url
     * @param {string} param1 - Optional parameter
     * @param {string} param2 - Optional parameter
     * @param {string} param2 - Optional parameter
     **/
    "makeAJAXRequest"  :function(callMeWhenReady, url, param1, param2, param3){

        let AJAXRequest = new XMLHttpRequest();
        let parameters = "";

        // In case that the request has parameters, we add them
        if (typeof param1 != 'undefined' && param1 != null && param1 != ""){
            parameters = parameters + "&param1=" + param1;
        }
        if (typeof param2 != 'undefined' && param2 != null && param2 != ""){
            parameters = parameters + "&param2=" + param2;
        }
        if (typeof param3 != 'undefined' && param3 != null && param3 != ""){
            parameters = parameters + "&param3=" + param3;
        }

        AJAXRequest.open("GET", url, true);
        AJAXRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        AJAXRequest.send(parameters);

        AJAXRequest.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) { // on success
                callMeWhenReady(AJAXRequest.responseText);
            }

            if (this.status != 200) {
                let fileError = { "fileError": "An ERROR occured on requesting the file:" + url };
                callMeWhenReady(fileError);
            }
        };
    }
};