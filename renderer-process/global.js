const {remote} = require('electron');
const {app} = remote;
const path = require('path');
const {dialog} = remote;
const m = require('manageFiles')
// global variables that can be used in any javascript file in renderer process
const appPath = app.getAppPath();
const userData = app.getPath('userData');
const appData = app.getPath('appData');
const userHome = app.getPath('home');
const userDocuments =  app.getPath('documents');

// userData directory will have pref directory to keep user preferences
var prefDir = path.join(userData, "pref");

// journals directory will have user's journals
var journalsDir = path.join(userData, "journals");

//raise error window
var raiseError = (message) => {
    dialog.showErrorBox("An Error Occcured!", message)
}
//show info window
var showInfo = (message) => {
    dialog.showMessageBox({type:'info', buttons: ['Dismiss'], message: message, title: 'information'});
}
