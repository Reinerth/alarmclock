'use strict'; /* Used traditional syntax and ES5, except "let". No arrow-functions, backticks and other useless confusing syntax */

/** alarmclock *******************************************************
 * 
 * About the structure:
 * Constructing a class "controller" with private and public functions
 * wherein we could use (call) the public functions from other classes
 * even if they are not instantiated at that time,
 * because our container (the reserved namespace) "timeline" is global (in the window-scope).
 * Means, we hoisted our container to window,
 * so the functions are going to be executed 
 * only after the window is loaded with the complete scripts.
 * Similar like the compiled files e.g. in C or JAVA. 
 * In this way JavaScript is kind of precompiled for the browser.
 * 
 * 
 * About the application alarmclock:
 * The story in spoken words:
 * 
 * Timeline of one week in seconds (m=monday, t=tuesday ...):
 * 0 m--------t-o------w--------t--------f--------s--------s--------> 604800 s
 *              ^
 *              |
 *              tuesday 7:00 (o = timepoint)
 *              ((1x24)+7)x60x60 = 111600s
 *              (( 1x monday ) + tuesdays hours) x 60 minutes x 60 seconds = 111600
 *              I call this a point (or pointer) on the weeks timline
 *              All given times/seconds are points on the timeline and have a precise number in seconds
 * 
 * First all settings made from user in the GUI get collected 
 * and for each, the corresponding timeline-pointer (see above) 
 * gets calculated and collected in an array.
 * Then we retrieve the current time from computer and calculate the timeline-pointer too.
 * Then we look in our array for the next bigger number (next alarm in line), than the current pointer. 
 * Now we know the amount of seconds between the two pointers (next ring)
 * and calculate backwards from them the needed time-range like days, hours and minutes. 
 * 
 * 
*/
window.alarmclock.controller = function (){

    // Settings needed inside this class
    let internalSettings = {
        myURLGetSomehing        :"./mvc/model/not-needed-in-this-app.json",
        timelineOfAWeekInSeconds:604800,
        myInterval              :"",
        myIntervalBlink         :"",
        myMinuteInterval        :"",
        alarmTimeDays           :[],
        pointerOnWeeksTimeline  :[],
        pointerOfNextAlarm      :0,
        foundPointerOfNextAlarm :false,
        pointerOfNow            :[],
        setAlarmTimeStunden     :0,
        setAlarmTimeMinutes     :0,
        timeLeftDays            :0,
        timeLeftStunden         :0,
        timeLeftMinutes         :0,
        timeOfAlarm             :0,

        isActivated             :false,
        nightIsActivated        :false,
        isRinging               :false,
        sound                   :"",
        bgimg                   :"",
        alarmOn                 :document.getElementById("alarmOn"),
        deactivate              :document.getElementById("deactivate"),
        divider                 :document.getElementById("divider"),

        lefttimecontainer       :document.getElementById("lefttimecontainer"),
        lefttimedays            :document.getElementById("lefttimedays"),
        lefttimestunden         :document.getElementById("lefttimestunden"),
        lefttimeminutes         :document.getElementById("lefttimeminutes"),

        selectWithStunden       :document.getElementById("stunden"),
        selectWithMinutes       :document.getElementById("minutes"),
        weekcontainer           :document.getElementById("weekcontainer"),

        monday                  :document.getElementById("monday"),
        tuesday                 :document.getElementById("tuesday"),
        wednesday               :document.getElementById("wednesday"),
        thursday                :document.getElementById("thursday"),
        friday                  :document.getElementById("friday"),
        saturday                :document.getElementById("saturday"),
        sunday                  :document.getElementById("sunday"),

        nightSelectedMonday     :document.getElementById("nightSelectedMonday"),
        nightSelectedTuesday    :document.getElementById("nightSelectedTuesday"),
        nightSelectedWednesday  :document.getElementById("nightSelectedWednesday"),
        nightSelectedThursday   :document.getElementById("nightSelectedThursday"),
        nightSelectedFriday     :document.getElementById("nightSelectedFriday"),
        nightSelectedSaturday   :document.getElementById("nightSelectedSaturday"),
        nightSelectedSunday     :document.getElementById("nightSelectedSunday"),
        nightContainerMark      :document.getElementsByClassName("nightSelected"),

        setLightAlarm           :document.getElementById("setLightAlarm"),
        testAlarm               :document.getElementById("testAlarm"),
        alarmContainer          :document.getElementById("alarmContainer"),
        myBody                  :document.getElementsByTagName("body")[0],
        dayContainer            :document.getElementsByClassName("daycontainer"),
        dayContainerMark        :document.getElementsByClassName("daycontainermark")
    };




    // We let "ALARM ON" blink
    let blink = function(){

        internalSettings.myIntervalBlink = setInterval(function(){

            // decrement the seconds-counter for how long the alarm will ring or blink 
            // if user does not deacivate alarm with the "deactivate for now" button manually.
            internalSettings.timeOfAlarm--;

            // deactivate for now if given timerange in userettings.js is reached 
            // and user doesnt deactivates alarm manualy
            if (internalSettings.timeOfAlarm <=0){ 
                internalSettings.deactivate.click(); // deactivate for now
                internalSettings.timeOfAlarm = window.alarmclock.timeOfAlarm; // reset back to the time-range-setting from user
            }



            // This first "if", is the ugly workaround also explained in the click on "deactivate". 
            // Only if user has not clicked on "deactivate for now" we want the text to blink.
            // Of course we have cleared the interval, 
            // but we also need to trigger again the timer due to the next alarm
            // so the blink-interval is still ongoing till the left minutes are not 00 anymore.
            // So we need to wait till the minute is up
            // Then we trigger our timer and the blink-interval remains cleared till the next ALARM
            if(internalSettings.isActivated == true){

                if (internalSettings.deactivate.className != "mySwitch silver"){

                    internalSettings.alarmOn.className = "on red";


                    if (internalSettings.nightIsActivated == true){
                        internalSettings.myBody.style.backgroundColor = "white";
                    }


                    setTimeout(function(){

                        if (internalSettings.deactivate.className != "mySwitch silver"){
                            internalSettings.alarmOn.className = "off red";

                            if (internalSettings.nightIsActivated == true){
                                internalSettings.myBody.style.backgroundColor = "black";
                                internalSettings.alarmOn.className = "";
                            }

                        }

                    }, 500);
                }
            }

        }, 1000);
    };




    let onRrrring = function(){

        if(internalSettings.isRinging == false){

            // time is up
            // play sound
            if(window.alarmclock.sound == true){
                internalSettings.sound.play();
                internalSettings.sound.loop = true;
            }

            // Let the "deactivate for now"-element look like active, so the user can push on it
            internalSettings.deactivate.className = "mySwitch void";

            // Let the "ALARM ON"-text blink to highlight visually that the alarm is ringing
            blink();

            // When this rrring is up, we need to look for the next one (pointer on the timeline),
            // so we set the flag to false.
            internalSettings.foundPointerOfNextAlarm = false;
        }
    };




    let countTime = function(){

        getPointerOfNow(); // means get the pointer on the timeline of the current time
        calculateLeftOverTime();

        if (internalSettings.timeLeftDays < 1 && internalSettings.timeLeftStunden < 1 && internalSettings.timeLeftMinutes < 1 && internalSettings.isRinging == false){
            // time is up
            onRrrring();
            internalSettings.isRinging = true;
        } else {
            if (internalSettings.isRinging == true && internalSettings.foundPointerOfNextAlarm == false){
                findOutPointerOfNextAlarm(); // means for next alarm we only need the first timepoint from all given
            }
        }
    };




    let activateInterval = function(){

        // if we dont trigger this function once before the interval starts, 
        // the timer would only be displayed when the first round of the interval has reached the end.
        // Means if the interval is set to 5 sec, the time-change would be displayed after 5 sec,
        // but we want to see the time directly when user has clicked on "set" or has changed a time-setting.
        countTime(); 

        // Only if user has set/activated the alarm, we begin with the interval to verify if time is up
        if(internalSettings.isActivated == true){

            internalSettings.myInterval = setInterval(function(){

                countTime();

            }, 5000);
        }
    };




    // Adds a leading zero in front of numbers lower 10	
    let helperLeadingZero = function(myNum){

        if (myNum < 10){
            myNum = "0" + myNum;
        };

        return myNum;
    };




    let displayTimeLeftOver = function(){
        internalSettings.lefttimedays.innerText    = helperLeadingZero(internalSettings.timeLeftDays);
        internalSettings.lefttimestunden.innerText = helperLeadingZero(internalSettings.timeLeftStunden);
        internalSettings.lefttimeminutes.innerText = helperLeadingZero(internalSettings.timeLeftMinutes);
    };




    let calculateLeftOverTime = function(){

        let timeFrameInSeconds = 0;
        let leftDaysInSeconds = 0;
        let leftStundenInSeconds = 0;
        let leftMinutesInSeconds = 0;

        // if pointerOfNow is bigger than pointerOfNextAlarm, means, that the next alarm has past already and would be again in next week 
        if (internalSettings.pointerOfNow > internalSettings.pointerOfNextAlarm){
            // we substract from the complete timeline the pointerOfNow to know the empty left time of this week
            // and then we add the pointerOfNextAlarm to know additionally the time from the beginning of the week
            timeFrameInSeconds =  internalSettings.timelineOfAWeekInSeconds - internalSettings.pointerOfNow + internalSettings.pointerOfNextAlarm;
        } else { // if pointerOfNow is lower than pointerOfNextAlarm, means, that the next alarm is still this week
            // we substract the pointerOfNow from pointerOfNextAlarm (in seconds)
            timeFrameInSeconds =  internalSettings.pointerOfNextAlarm - internalSettings.pointerOfNow;
        }


        // I. 
        // We divide that by 60 to get the minutes, divide again by 60 to get the stunden and divide by 24 to get the full days.
        internalSettings.timeLeftDays =  parseInt((timeFrameInSeconds / 60 / 60 / 24).toString().split(".")[0]);

        // II.
        // We want the amount of seconds of the (full) days, 
        // because we need to substract them from the complete timeFrameInSeconds
        // to get the amount of timeLeftStunden
        leftDaysInSeconds = internalSettings.timeLeftDays * 24 * 60 * 60;
        leftStundenInSeconds =  timeFrameInSeconds - leftDaysInSeconds;
        internalSettings.timeLeftStunden =  parseInt((leftStundenInSeconds / 60 / 60).toString().split(".")[0]);


        // III.
        // We want the amount of seconds of the left (full) stunden,
        // because we need to substract them too from the complete timeFrameInSeconds
        // to get the amount of timeLeftMinutes
        leftStundenInSeconds = internalSettings.timeLeftStunden * 60 * 60;
        leftMinutesInSeconds = timeFrameInSeconds - leftDaysInSeconds - leftStundenInSeconds;
        internalSettings.timeLeftMinutes = leftMinutesInSeconds / 60;


        displayTimeLeftOver(); // if user has activated the countdown of the time till alarm it will be displayed
    };




    let findOutPointerOfNextAlarm = function(){

        // loop through the array with the pointers set from user
        for (let activePointer=0; activePointer<internalSettings.pointerOnWeeksTimeline.length; activePointer++){

            if(internalSettings.pointerOfNow < internalSettings.pointerOnWeeksTimeline[activePointer]){
                internalSettings.pointerOfNextAlarm = internalSettings.pointerOnWeeksTimeline[activePointer];
                return;
            } else {
                internalSettings.pointerOfNextAlarm = internalSettings.pointerOnWeeksTimeline[0];
            }
        }
        internalSettings.foundPointerOfNextAlarm = true;
    };




    let getPointerOfNow = function(){

        let currentTime = new Date();
        let day = currentTime.getDay();

        // On retrieving the day we get a number from 0-6, while 6 is Sunday.
        // My week starts with Monday so I will change that here back to where it should be.

        // Monday    is Oneday and 
        // Tuesday   is Twosday
        // Wednesday is Threesday
        // Thurstday is Fourthsday
        // Friday    is Fiveday
        // Saturday  is Sixday
        // Sunday    is Sevenday

        switch (day) {
            case 0:
                day = 6;
                break;
            case 1:
                day = 0;
                break;
            case 2:
                day = 1;
                break;
            case 3:
                day = 2;
                break;
            case 4:
                day = 3;
                break;
            case 5:
                day = 4;
                break;
            case 6:
                day = 5;
                break;
            default:
                break;
        }

        let stunde = currentTime.getHours();
        let minutes = currentTime.getMinutes();

        // First we multiply the amount of full days (before the current day) with 24 stunden
        // e.g. for Monday it would be 0*24 or for Wednesday it would be 2*24
        internalSettings.pointerOfNow = day * 24;
        // then we add the amount of stunden
        internalSettings.pointerOfNow = internalSettings.pointerOfNow + stunde;
        // then we multiply with 60 to get the minutes out of it
        internalSettings.pointerOfNow = internalSettings.pointerOfNow * 60;
        // then we add the amount of minutes 
        internalSettings.pointerOfNow = internalSettings.pointerOfNow + minutes;
        // then we multiply with 60 again to get the seconds out of it
        internalSettings.pointerOfNow = internalSettings.pointerOfNow * 60;
    };




    // In this function we calculate all the given pointers of the weeks timeline.
    // The pointers are unique numbers in seconds among the seconds of the week. 
    let calculatePointerOnTimeline = function(){

        internalSettings.pointerOnWeeksTimeline = []; // reset to empty before collecting new

        for (let pointer=0; pointer<internalSettings.alarmTimeDays.length; pointer++){

                // First we find out the amount of full days before the current selected day 
                // e.g. for Monday it would be 0 or for Wednesday it would be 2
                let myPointer = internalSettings.alarmTimeDays[pointer] * 24; 

                // then we add the amount of stunden set from user in the option-select
                myPointer = myPointer + parseInt(internalSettings.setAlarmTimeStunden);

                // then we multiply with 60 to get the minutes out of it
                myPointer = myPointer * 60; 

                // then we add the amount of minutes set from user in the option-select
                myPointer = myPointer + parseInt(internalSettings.setAlarmTimeMinutes);

                // then we multiply with 60 again to get the seconds out of it
                myPointer = myPointer * 60; 

                // and finally we rememer that number, 
                // because it represents the wanted pointer on the week-timeline.
                internalSettings.pointerOnWeeksTimeline.push(myPointer);
        }
    };




    // We collect the days that are checked from the user (input type checkbox)
    let collectMarkedTimes = function(){

        internalSettings.setAlarmTimeStunden = internalSettings.selectWithStunden.value;
        internalSettings.setAlarmTimeMinutes = internalSettings.selectWithMinutes.value;

        internalSettings.alarmTimeDays = []; // reset to empty befor collecting new

        for (let weekDay=0; weekDay<7; weekDay++){
            if (internalSettings.dayContainerMark[weekDay].checked == true){
                internalSettings.alarmTimeDays.push(weekDay);
            }
        }

        if(internalSettings.alarmTimeDays.length == 0){
            internalSettings.alarmOn.style.display = "none"; // display the "ALARM ON"
        }

    };




    // The options for the minutes we create dynammmically, 
    // because we have a configuration-possibility fromuser. 
    // He can decide whether all 60 minues can be selected as an option
    // or only in 10-minute-steps -> 10,20,30...
    let createOptionsForMinutes = function(userSetting){

        userSetting = parseInt(userSetting); // just in case the user has made a string of it
        let theOptionsMinutes = ["00","10","20","30","40","50"];

        if (userSetting == 1){
            userSetting = 60;
        } else {
            userSetting = 6;
        }

        for (let i=0; i<userSetting; i++){

            let myOption = document.createElement("option");

            if (userSetting == 6){
                myOption.value = theOptionsMinutes[i];
                myOption.text = theOptionsMinutes[i];
            } else {
                myOption.value = helperLeadingZero(i);
                myOption.text = helperLeadingZero(i);
            }

            internalSettings.selectWithMinutes.appendChild(myOption);
        }
    };




    let acivateLightBlinkMode = function(){

        // hide all elements except the deactivate-for-now-element
        // and let the backgroundcolor of the body blink white and black

        if (internalSettings.nightIsActivated == true){

            if (window.alarmclock.displayTestSound == true){
                internalSettings.testAlarm.style.visibility = "visible";
            } else {
                internalSettings.testAlarm.style.visibility = "hidden";
            }

            internalSettings.nightIsActivated = false;
            internalSettings.myBody.className = "";
            internalSettings.deactivate.className = "mySwitch silver";
            internalSettings.alarmOn.className = "";
            internalSettings.setLightAlarm.className ="mySwitch"
            internalSettings.setLightAlarm.innerText = "night";
            internalSettings.divider.style.visibility = "visible";
            internalSettings.selectWithStunden.className ="light"
            internalSettings.selectWithMinutes.className ="light"



            // display all inputfields / marking-elements
            for (let oneFromSeven=0; oneFromSeven<7; oneFromSeven++){
                internalSettings.dayContainerMark[oneFromSeven].style.visibility = "visible";
                internalSettings.nightContainerMark[oneFromSeven].style.visibility = "hidden";
            }

        } else {

            internalSettings.nightIsActivated = true;
            internalSettings.myBody.className = "night";
            internalSettings.deactivate.className = "";
            internalSettings.alarmOn.className = "";
            internalSettings.testAlarm.style.visibility = "hidden";
            internalSettings.setLightAlarm.className ="night"
            internalSettings.setLightAlarm.innerText = "light";
            internalSettings.divider.style.visibility = "hidden";
            internalSettings.selectWithStunden.className ="night"
            internalSettings.selectWithMinutes.className ="night"

            // hide all inputfields / marking-elements
            for (let oneFromSeven=0; oneFromSeven<7; oneFromSeven++){
                internalSettings.dayContainerMark[oneFromSeven].style.visibility = "hidden";
                if (internalSettings.dayContainerMark[oneFromSeven].checked == true){
                    internalSettings.nightContainerMark[oneFromSeven].style.visibility = "visible";
                }

            }
        }
    };




    // Set-up event and timer of this app
    let handleEvents = function(){


        for (let oneDay=0; oneDay<7; oneDay++){

            internalSettings.dayContainer[oneDay].onclick = function(){

                if (internalSettings.dayContainerMark[oneDay].checked == false){

                    internalSettings.dayContainerMark[oneDay].checked = true;

                    if (internalSettings.nightIsActivated == true){
                        internalSettings.nightContainerMark[oneDay].style.visibility = "visible";
                    }

                } else {

                    internalSettings.dayContainerMark[oneDay].checked = false;

                    if (internalSettings.nightIsActivated == true){
                        internalSettings.nightContainerMark[oneDay].style.visibility = "hidden";
                    }
                }
            }
        }




        // If user ich changing a setting, while the alarm is on, 
        // we want to take the new setting he made into account for our new calculations
        // so we trigger a click on our initial function
        internalSettings.weekcontainer.onclick = function(){
            setAlarm(); // this is the initial function to start the alarm
        };




        internalSettings.selectWithStunden.onchange = function(){

            internalSettings.setAlarmTimeStunden = this.value;

            internalSettings.deactivate.click();

            // If user ich changing a setting, while the alarm is on, 
            // we want to take the new setting he made into account for our new calculations
            setAlarm(); // this is the initial function to start the alarm
        };

        internalSettings.selectWithMinutes.onchange = function(){
            internalSettings.setAlarmTimeMinutes = this.value;

            internalSettings.deactivate.click();

            // If user ich changing a setting, while the alarm is on, 
            // we want to take the new setting he made into account for our new calculations
            setAlarm(); // this is the initial function to start the alarm
        };




        // If user has configured the setting to display the test-sound-element
        // and he clicks on it
        let soundIsPlaying = false;

        internalSettings.testAlarm.onclick = function(){

            if (soundIsPlaying == false){
                internalSettings.testAlarm.innerText = "quit";
                internalSettings.sound.play();
                internalSettings.sound.loop = true;
                soundIsPlaying = true;
            } else {
                internalSettings.testAlarm.innerText = "test sound";
                internalSettings.sound.pause();
                soundIsPlaying = false;
            }
        };




        internalSettings.setLightAlarm.onclick = function(){

            // ...we also want the background darkened
            // the application in fullscreen
            acivateLightBlinkMode();

            if (internalSettings.nightIsActivated == false){
                internalSettings.alarmOn.className = "off yellow";
                internalSettings.myBody.style.backgroundColor = window.alarmclock.backgroundColor;

                if (window.alarmclock.backgroundImage == true){
                    internalSettings.myBody.style.backgroundImage = "url("+internalSettings.bgimg+")";
                }

                leaveFullScreen();

            } else {
                internalSettings.alarmOn.className = "";
                internalSettings.myBody.style.backgroundColor = "#000000";
                internalSettings.myBody.style.backgroundImage = "";
                goFullScreen();
            }

        };




        // If user cicks on the big "deactivate for now"-element
        internalSettings.deactivate.onclick = function(){

            console.log("sleep");

            // If the "Deactivate for now"-element is greyed out, we dont want to deactivate again, so we quit/return.
            // if (internalSettings.deactivate.className == "mySwitch silver"){
            //     console.log("is not active");
            //     return;
            // }

            internalSettings.lefttimedays.innerHTML = "00";
            internalSettings.lefttimestunden.innerHTML = "00";
            internalSettings.lefttimeminutes.innerHTML = "00";

            clearInterval(internalSettings.myIntervalBlink); // we clear the interval of the blink-text
            clearInterval(internalSettings.myInterval); // we clear the interval of retrieving and calculating new times...
            // ...it gets activated again by generating a click on the setalarm-element -> setAlarm();


            internalSettings.isRinging = false;

            // if there still is a/another ALARM-point on the list
            // we need to set the "ALARM ON"-text yellow again
            // and activate the intervals again
            if(internalSettings.pointerOfNextAlarm != 0) {

                setAlarm(); // this is the initial function to start the alarm
                // we need to activate alarm again ...

                // ... but the text still blinks and rings 
                // till the minutecounter is on 00 
                // so we made an ugly workaround here ....
                // we have set (a few lines later) the variable isActivated to false 
                // in the blink-function we ask for the that status
                // Only if user has not clicked on "deactivate for now" we want the text to blink.
                // Of course we have cleared the interval, (a few lines above)
                // but we also need to trigger again the timer due to the next alarm
                // so the blink-interval is still ongoing till the left minutes are not 00 anymore.
                // So we need to wait till the minute is up
                // Then we trigger our timer and the blink-interval remains cleared till the next ALARM
                setTimeout(function(){
                    internalSettings.isActivated = true;
                    clearInterval(internalSettings.myIntervalBlink); // we clear the interval of the blink-text
                }, 2000); // this timerange has to be longer than the one in the blink-interval
            }

            if (internalSettings.nightIsActivated == true){
                internalSettings.deactivate.className = "";
                internalSettings.myBody.style.backgroundColor = "black";
            } else {
                internalSettings.deactivate.className = "mySwitch silver"; // reset to deactivated color
            }

            internalSettings.sound.pause();
            internalSettings.isActivated = false;
        };
    };




    let goFullScreen = function(){

        let elem = document.documentElement;

        if(elem.requestFullscreen){
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen){
            elem.msRequestFullscreen();
        }
    };




    let leaveFullScreen = function(){
        if(document.exitFullscreen){
            document.exitFullscreen();
        } else if (document.msExitFullscreen){
            document.msExitFullscreen();
        }
    };




    // This is the initial function to start the alarm.
    // If user clicks to set/activate the alarm
    let setAlarm = function(){

        if (internalSettings.nightIsActivated == false){
            internalSettings.alarmOn.className = "off yellow";
        } else {
            internalSettings.alarmOn.className = "";
        }

        // We dont want the user to set more then one interval, 
        // so we clear the old one before he sets a new one
        clearInterval(internalSettings.myInterval); // we clear the interval of retrieving and calculating new times
        clearInterval(internalSettings.myIntervalBlink); // we clear the interval of the blink-text

        collectMarkedTimes();

        if (internalSettings.alarmTimeDays.length == 0){ // If no day is marked, alarm cant be activated/set so we quit.
            internalSettings.lefttimedays.innerHTML = "00";
            internalSettings.lefttimestunden.innerHTML = "00";
            internalSettings.lefttimeminutes.innerHTML = "00";
            return;
        }

        calculatePointerOnTimeline(); // means find the number of seconds from the wanted timepoints on the weeks timeline
        getPointerOfNow(); // means get the pointer on the timeline of the current time
        findOutPointerOfNextAlarm(); // means for next alarm we only need the first timepoint from all given
        internalSettings.alarmOn.style.display = "block"; // display the "ALARM ON"
        internalSettings.isActivated = true; //we need this boolean for knowing if alarm is activated to trigger interval to verify time
        activateInterval(); // triggers the interval for calculations to verify if time is up
    };




    // Public
    this.init = function(){

        handleEvents();

        // Get the settings configured from the user in the alarmclock.htm
        internalSettings.timeOfAlarm = window.alarmclock.timeOfAlarm;


        let mySound = window.alarmclock.soundFilePath + window.alarmclock.soundFile;
        internalSettings.sound = new Audio(mySound);

        if (window.alarmclock.displayLeftTime == true){
            internalSettings.lefttimecontainer.className = "lefttimecontainer";
            internalSettings.alarmContainer.className = "";
            internalSettings.divider.style.visibility = "visible";
        } else {
            internalSettings.lefttimecontainer.className = "lefttimecontainer hide";
            internalSettings.alarmContainer.className = "spacer";
            internalSettings.divider.style.visibility = "hidden";
        }

        if (window.alarmclock.displayTestSound == true){
            internalSettings.testAlarm.style.visibility = "visible";
        } else {
            internalSettings.testAlarm.style.visibility = "hidden";
        }



        if (window.alarmclock.displayLightAlarm == true){
            internalSettings.setLightAlarm.style.visibility = "visible";
        } else {
            internalSettings.setLightAlarm.style.visibility = "hidden";
        }



        // Set backgroundimage if configured in alarmclock.htm
        if (window.alarmclock.backgroundImage == true){

            internalSettings.bgimg = window.alarmclock.backgroundImagePath + window.alarmclock.backgroundImageName;
            internalSettings.myBody.style.backgroundImage = "url("+internalSettings.bgimg+")";

        } else {
            internalSettings.myBody.style.backgroundImage = "";
        }

        // Set background-color as configuredin alarmclock.htm
        if (window.alarmclock.backgroundImage == false){
            internalSettings.myBody.style.backgroundColor = window.alarmclock.backgroundColor;
        }



        createOptionsForMinutes(window.alarmclock.precision);







        // NOT NEEDED IN THIS APP
        // Get the model-content (file) with "makeAJAXRequest"
        // and when load is finished, do something with the retrieved content 
        // by using callback-functions ("callMeWhenReady")
        // window.timeline.makeAJAXRequest(function(responseContent) {

            // Here we are in the callback-part of the request, 
            // means content-load is finished

        // }, internalSettings.myURLGetSomehing, param1);
    };
};


/***************************************************************************
 * INSTANTIATE (new) a variable (e.g. "alarmclock")                          *
 * with the class from this file ("controller.js")                         *
 * to make the class available to be invoked (in the "alarmclock.htm") *
****************************************************************************/
let alarmclock = new window.alarmclock.controller();
