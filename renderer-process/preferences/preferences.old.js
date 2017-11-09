var sTh, sTm, sTap, eTh, eTm, eTap, weekendVal, weekendObj, weekendEle, weekendFile, timeRangeFile, timeRangeObj, timeRangeVal, sThEle, sTmEle, sTapEle, eThEle, eTmEle, eTapEle;

setWeekendValue();
setTimeRangeValue();
setupTimeRangeTable();

// save changed preference of weekend
weekendEle.addEventListener('change', function(event) {
    weekendObj.weekend = weekendEle.value;
    if (!m.writeData('weekend', prefDir, JSON.stringify(weekendObj))){
        raiseError("Cannot write file 'weekend' in " + prefDir + ". File permissions or IO error.")
    }
})


// save changed preference of time range
var timeRangeEles = document.querySelectorAll('.timeRange');
Array.prototype.forEach.call(timeRangeEles, function (timeRangeEle){
    timeRangeEle.addEventListener('change', function (event){
        if (checkTimeRange()) {
            saveTimeRange();
        }
        else {
            setTimeRangeValue();
        }
    })
});
function saveTimeRange () {
    timeRangeVal[0] = sThEle.value + sTmEle.value + sTapEle.value;
    timeRangeVal[1] = eThEle.value + eTmEle.value + eTapEle.value;
    timeRangeObj.timeRange = timeRangeVal;
    if (!m.writeData('timeRange', prefDir, JSON.stringify(timeRangeObj))) {
        raiseError("Preference not saved.\nCannot write file 'timeRange' in " + prefDir + ". File permissions or IO error.");
    }
}

function checkTimeRange() {
    var startTime = new Date();
    var endTime = new Date();
    startTime.setMinutes(Number(sTmEle.value));
    startTime.setSeconds(0);
    if (sTapEle.value == "am") {
        startTime.setHours(Number(sThEle.value));
    }
    else {
        startTime.setHours(Number(sThEle.value) + 12);
    }

    endTime.setMinutes(Number(eTmEle.value));
    endTime.setSeconds(0);
    if (eTapEle.value == "am") {
        endTime.setHours(Number(eThEle.value));
    }
    else {
        endTime.setHours(Number(eThEle.value) + 12);
    }
    if (startTime < endTime) {
        return true;
    }
    else {
        raiseError("Invalid time range!");
        return false;
    }
}

// set weekend user preference
function setWeekendValue() {
    weekendFile = m.readFile('weekend', prefDir);
    if (weekendFile) {
        //converting weekend from string to JSON
        weekendObj = JSON.parse(weekendFile);
    }
    else {
        raiseError("Cannot read file 'weekend' in " + prefDir + ". File permissions or IO error.");
        return;
    }
    weekendVal = weekendObj.weekend;
    weekendEle = document.getElementById("weekend")
    weekendEle.value = weekendVal;
}

//set time range user preference
function setTimeRangeValue() {
    timeRangeFile = m.readFile('timeRange', prefDir);
    if(timeRangeFile) {
        timeRangeObj = JSON.parse(timeRangeFile)
    }
    else {
        raiseError("Preference not saved.\nCannot read file 'timeRange' in " + prefDir + ". File permissions or IO error.");
        return;
    }
    timeRangeVal = timeRangeObj.timeRange;
    var startVal = timeRangeVal[0];
    var endVal = timeRangeVal[1];
    sTh = startVal.substr(0,2);
    sTm = startVal.substr(2,2);
    sTap = startVal.substr(4,2);
    eTh = endVal.substr(0,2);
    eTm = endVal.substr(2,2);
    eTap = endVal.substr(4,2);

    sThEle = document.getElementById("sTh");
    sTmEle = document.getElementById("sTm");
    sTapEle = document.getElementById("sTap");
    eThEle = document.getElementById("eTh");
    eTmEle = document.getElementById("eTm");
    eTapEle = document.getElementById("eTap");

    // set time range values
    sThEle.value = sTh;
    sTmEle.value = sTm;
    sTapEle.value = sTap;
    eThEle.value = eTh;
    eTmEle.value = eTm;
    eTapEle.value = eTap;
}

function setupTimeRangeTable() {
    // start time
    var sTv = sTh;
    if (sTap == "pm") {
        sTv = String(Number(sTv) + 12);
    }
    sTv = sTv +  ".0";
    if (sTm == "30") {
        sTv = String(Number(sTv) + 0.5);
    }
    sTv = Number(sTv);
    // end time
    var eTv = eTh;
    if (eTap == "pm") {
        eTv = String(Number(eTv) + 12);
    }
    eTv = eTv +  ".0";
    if (eTm == "30") {
        eTv = String(Number(eTv) + 0.5);
    }
    eTv = Number(eTv);

    for (i=1; i<sTv; i = i + 0.5) {
        var element = document.getElementById(String(i));
        element.classList.remove("table-row");
        element.classList.add("none");
        element.dataset.enabled = "0"
    }
    for (i=sTv; i <= eTv; i = i + 0.5) {
        var element = document.getElementById(String(i));
        element.classList.remove("none");
        element.classList.add("table-row");
        element.dataset.enabled = "1"
    }
    for (i=eTv+0.5; i<=24.5; i = i + 0.5) {
        var element = document.getElementById(String(i));
        element.classList.remove("table-row");
        element.classList.add("none");
        element.dataset.enabled = "0"
    }
}
