// startup file must be included in main.js file
// it must be included before browser (renderer) window is launched

const {app} = require('electron');
const path =  require('path');
const m = require('manageFiles');
const {dialog} = require('electron');

function raiseError(message) {
    dialog.showErrorBox("An Error Occcured!", message)
}

appData = app.getPath("appData");
newUserData = path.join(appData, "timekeeper");

// on startup check if timekeeper dir exists inside appData
// create, if it does not exists, before setting new userData
// to appData/timekeeper
if (!m.createDirIfNotExists('timekeeper', appData)) {
    raiseError("Cannot create directory: " + newUserData);
    app.quit()
}
// ****changing the default directory of user-data
app.setPath('userData', newUserData);
// global variables
userData = app.getPath('userData');

//pref dir inside userData to store user preferences
var prefDir = path.join(userData, "pref");
// on startup check if pref dir exists in userData
// if it does not then create it.
if (!m.createDirIfNotExists('pref', userData)) {
    raiseError("Cannot create directory: " + prefDir);
    app.quit()
}

//journals dir inside userData to store user's journals
var journals = path.join(userData, "journals");
// on startup check if journals dir exists in userData
// if it does not then create it.
if (!m.createDirIfNotExists('journals', userData)) {
    raiseError("Cannot create directory: " + journals);
    app.quit()
}

// on startup check if lastActiveSection file (in pref dir) exists or not
// if it does not create it and set its contents to 'about'
if (!m.exists("lastActiveSection", prefDir)) {
    if (!m.writeData('lastActiveSection', prefDir, 'about')) {
        app.quit()
    }
}

// on startup check if timeRange file (in pref dir) exists or not
// if it does not create it and set its contents to '{timeRange: [6,19]}'
// the default time range is from 6AM to 7PM
if (!m.exists("timeRange", prefDir)) {
    if (!m.writeData('timeRange', prefDir, '{"timeRange": ["0600am","0700pm"]}')) {
        app.quit()
    }
}

// on startup check if weekend file (in pref dir) exists or not
// if it does not create it and set its contents to '{weekend: 5}'
// by default weekend will be on every 5 days
if (!m.exists("weekend", prefDir)) {
    if (!m.writeData('weekend', prefDir, '{"weekend":"5"}')) {
        app.quit()
    }
}
