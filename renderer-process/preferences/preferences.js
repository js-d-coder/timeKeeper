var weekendEle = document.getElementById("weekend"),
sThEle = document.getElementById("sTh"),
sTmEle = document.getElementById("sTm"),
sTapEle = document.getElementById("sTap"),
eThEle = document.getElementById("eTh"),
eTmEle = document.getElementById("eTm"),
eTapEle = document.getElementById("eTap");

setWeekendPreference();
setWeekendPreference();

document.getElementById('save-preferences-button').addEventListener('click', function(event) {
    if(saveData()) {
        showInfo("Your preferences saved!\t");
    }
})

function setWeekendPreference() {
    var weekendFile = m.readFile('weekend', prefDir);
    if (weekendFile) {
        //converting weekend from string to JSON
        var weekendObj = JSON.parse(weekendFile);
    }
    else {
        raiseError("Cannot read file 'weekend' in " + prefDir + ". File permissions or IO error.");
        return;
    }
    weekendEle.value = weekendObj['weekend'];
}
function setWeekendPreference() {
    var timeRangeFile = m.readFile('timeRange', prefDir);
    if(timeRangeFile) {
        var timeRangeObj = JSON.parse(timeRangeFile)
    }
    else {
        raiseError("Preference not saved.\nCannot read file 'timeRange' in " + prefDir + ". File permissions or IO error.");
        return;
    }
    var timeRangeVal = timeRangeObj['timeRange'];

    var startVal = timeRangeVal[0];
    var endVal = timeRangeVal[1];

    var sTh = startVal.substr(0,2);
    var sTm = startVal.substr(2,2);
    var sTap = startVal.substr(4,2);
    var eTh = endVal.substr(0,2);
    var eTm = endVal.substr(2,2);
    var eTap = endVal.substr(4,2);

    sThEle.value = sTh;
    sTmEle.value = sTm;
    sTapEle.value = sTap;
    eThEle.value = eTh;
    eTmEle.value = eTm;
    eTapEle.value = eTap;
}

function saveData() {

    if (saveWeekday() && saveTimeRange()) {
        return true;
    }
    else {
        return false;
    }

    function saveWeekday() {
        var weekendObj = {};
        weekendObj['weekend'] = weekendEle.value;
        if (m.writeData('weekend', prefDir, JSON.stringify(weekendObj))){
            return true;
        }
        else{
            raiseError("Cannot write file 'weekend' in " + prefDir + ". File permissions or IO error.");
            return false;
        }
    }
    function saveTimeRange() {
        if (checkTimeRange()) {
            var timeRangeVal = [];
            timeRangeVal[0] = sThEle.value + sTmEle.value + sTapEle.value;
            timeRangeVal[1] = eThEle.value + eTmEle.value + eTapEle.value;
            var timeRangeObj = {};
            timeRangeObj['timeRange'] = timeRangeVal;
            if (m.writeData('timeRange', prefDir, JSON.stringify(timeRangeObj))) {
                return true;
            }
            else{
                raiseError("Preference not saved.\nCannot write file 'timeRange' in " + prefDir + ". File permissions or IO error.");
                return false;
            }
        }
        else {
            return false;
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
    }
}
