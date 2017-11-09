const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const m = require('manageFiles');

require('./main-process/startup.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// create main browser window
function createWindow(setWidth, setHeight) {
    var windowOptions = {
        title : "Time Keeper",
        center : true,
        defaultEncoding : "utf-8",
        minWidth : 900,
        minHeight : 600,
        // set width after detecting the screen resolution
        // set height after detecting the screen resolution
        maxWidth : 1200,
        maxHeight : 700,
        resizable : false,
        maximizable : false,
        webaudio : false,
        fullscreenable :  false,
    }
    windowOptions.width = setWidth;
    windowOptions.height = setHeight;
    // set window icon on Linux
    windowOptions.icon = path.join(__dirname, "/assets/app-icon/png/clock64.png")
    // Create the browser window. With only this instance the browser
    // will be empty.
    mainWindow = new BrowserWindow(windowOptions);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // maximize the window
    //mainWindow.maximize();
    // set title of the window
    mainWindow.setTitle("Time Keeper");
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    });
}

// fallback window for very small screens
function fallBackWindow() {
    var windowOptions = {
        title : "Error - Time Keeper",
        resizable : false,
        maximizable : false,
        webaudio : false,
        fullscreenable :  false,
        defaultEncoding : "utf-8",
        width : 600,
        height : 200,
    }
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(`file://${__dirname}/fallback.html`);
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    });
}


// initialization
function initialization () {
    const electronScreen = require('electron').screen;
    const {width, height} = electronScreen.getPrimaryDisplay().workAreaSize;
    var setWidth = null;    // the width of the application when launched
    var setHeight = null;   // the height of the application when launched
    if (width >= 1600) {
        setWidth = 1200;
        setHeight = 700;
        createWindow(setWidth, setHeight);
    }
    else if (width >= 1300 ) {
        setWidth = 1200;
        setHeight = 600;
        createWindow(setWidth, setHeight);
    }
    else if (width >= 900) {
        setWidth = 900;
        setHeight = 600;
        createWindow(setWidth, setHeight);
    }
    else { // if scren width is smaller than 1024px then run fall back window
        fallBackWindow(); // show error to user : Minimum screen resolution required to launch Time Keeper is 1024px x 768px.
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialization);


// Make this app a single instance app
// when a person tries to open another (main) window, and if main window is
//already open, restore and focus the main window.
function makeSingleInstance() {
    return app.makeSingleInstance(function () {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.maximize();
            mainWindow.focus();
        }
    });
}
var shouldQuit = makeSingleInstance();
if (shouldQuit) return app.quit();

// Quit when all windows are closed.
app.on("window-all-closed", function (){
      app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    initialization()
  }
})
