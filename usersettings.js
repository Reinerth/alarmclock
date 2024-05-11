/***************************************************************************
 *  Here you can change some settings of the application "alarmclock". 
 * You can display or hide some buttons, 
 * you can activate the night-mode/light-alarm,
 * you can change or deactivate the soundfile of the alarmclock,
 * you can set a background-image or change the background-color.
***************************************************************************/

// false, does not display the countdown of the left-over time (the time till alarm rings)
window.alarmclock.displayLeftTime = true;

// false, does not display the option of the night-mode (light-alarm).
// With the night mode you can set the complete view to black. 
// That activates the background to blink when alarm-time has been reached, 
// and sets the alarmclock to fullscreen-mode. (F11)
// NOTE: "sound" can be set to false, for only-flash-light-alarm
window.alarmclock.displayLightAlarm = true;

// false, deactivates sound (when using the light-alarm/night-mode). 
window.alarmclock.sound = true;

// true, displays the option where you could test sound-file of the alarmclock.
window.alarmclock.displayTestSound = true;

// Precision-options in the select-element can be 1 or 10
// 1 sets selectable minutes 00-59 
// 10 sets selectable minutes in 10 minutes-steps (00,10,20,30,40,50 )
window.alarmclock.precision = 1;

// Name of the sound file from the diretory ./mvc/view/sound/ e.g "make-sound.mp3"
window.alarmclock.soundFile = "rain-at-tarp.m4a";

// NOTE: "backgroundImage" needs to be set to false
// Backgroundolor can be set by using wordings of internet-colors like: 
// "white", "silver", "cadetblue", "darkcyan", "darkorange", "deepskyblue"
// or with CSS-hex-code like: "#335577", "#336699", "#007700", ,"#007777", "#004477", "#774000"
window.alarmclock.backgroundColor = "#336699"; 

// false, deactivates the background-image and makes the background-color visible
window.alarmclock.backgroundImage = true; 

// Name of the image file from the diretory ./mvc/view/img/
window.alarmclock.backgroundImageName = "03.jpg"; 

// Timerange in seconds of the alarm sound or blink if not deactivated by user. 
window.alarmclock.timeOfAlarm = 60; 



//The complete list of settings as they were set by default:
// window.alarmclock.displayLeftTime = true;
// window.alarmclock.displayLightAlarm = true;
// window.alarmclock.sound = true;
// window.alarmclock.displayTestSound = true;
// window.alarmclock.precision = 1;
// window.alarmclock.soundFile = "rain-at-tarp.m4a";
// window.alarmclock.backgroundColor = "#335577"; 
// window.alarmclock.backgroundImage = true; 
// window.alarmclock.backgroundImageName = "03.jpg"; 
// window.alarmclock.timeOfAlarm = 60; 