var button = document.getElementById('save-journal-button'),
todaysDate = new Date(),
dateString = todaysDate.getDate() + "." + todaysDate.getMonth() + "." + todaysDate.getFullYear();

setupJournal();
loadDataOfTodaysJournal();

// save journal when Save button is clicked
button.addEventListener('click', function (event) {
    saveJournal();
})

function setupJournal() {
    var timeRangeFile = m.readFile('timeRange', prefDir);
    if(timeRangeFile) {
        var timeRangeObj = JSON.parse(timeRangeFile)
    }
    else {
        raiseError("Preference not saved.\nCannot read file 'timeRange' in " + prefDir + ". File permissions or IO error.");
        return;
    }
    var timeRangeVal = timeRangeObj.timeRange,
    startVal = timeRangeVal[0],
    endVal = timeRangeVal[1],
    sTh = startVal.substr(0,2),
    sTm = startVal.substr(2,2),
    sTap = startVal.substr(4,2),
    eTh = endVal.substr(0,2),
    eTm = endVal.substr(2,2),
    eTap = endVal.substr(4,2);

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

    var element;
    for (i=1; i<sTv; i = i + 0.5) {
        element = document.getElementById(String(i));
        element.classList.remove("table-row");
        element.classList.add("none");
        element.dataset.enabled = "0"
    }
    for (i=sTv; i <= eTv; i = i + 0.5) {
        element = document.getElementById(String(i));
        element.classList.remove("none");
        element.classList.add("table-row");
        element.dataset.enabled = "1"
    }
    for (i=eTv+0.5; i<=24.5; i = i + 0.5) {
        element = document.getElementById(String(i));
        element.classList.remove("table-row");
        element.classList.add("none");
        element.dataset.enabled = "0"
    }

    // set today's day
    setDayOfTheWeek();

    function setDayOfTheWeek() {
        document.getElementById('weekday').value = todaysDate.getDay();
    }
}
// load data of today's journal (if any)
function loadDataOfTodaysJournal() {
    var journalDataObj, tableRow,
    journalData = m.readFile(dateString, journalsDir);
    if(journalData) {
        journalDataObj = JSON.parse(journalData);
        for (key in journalDataObj['journal']) {
            tableRow = document.getElementById(key);
            tableRow.querySelector('.activityPlan').value = journalDataObj['journal'][key].activityPlan;
            tableRow.querySelector('.activityDone').value = journalDataObj['journal'][key].activityDone;
        }
        document.getElementById('day').value = journalDataObj['day'];
        document.getElementById('weekday').value = journalDataObj['weekday'];
        document.getElementById('date').value = journalDataObj['date'];
        document.getElementById('total-activities-begun').value = journalDataObj['total-activities-begun'];
        document.getElementById('total-activities-completed').value = journalDataObj['total-activities-completed'];
        document.getElementById('total-interruptions').value = journalDataObj['total-interruptions'];
        document.getElementById('comments-about-this-day').value = journalDataObj['comments-about-this-day'];
    }
}
function saveJournal() {
    var journalData = "", // empty string
    journalDataObj = {}; //empty object
    journalDataObj['journal'] = prepareJournalData();
    journalDataObj['day'] = document.getElementById('day').value;
    journalDataObj['weekday'] = document.getElementById('weekday').value;
    journalDataObj['date'] = document.getElementById('date').value;
    journalDataObj['total-activities-begun'] = document.getElementById('total-activities-begun').value;
    journalDataObj['total-activities-completed'] = document.getElementById('total-activities-completed').value;
    journalDataObj['total-interruptions'] = document.getElementById('total-interruptions').value;
    journalDataObj['comments-about-this-day'] = document.getElementById('comments-about-this-day').value;
    journalData = JSON.stringify(journalDataObj);
    if (!m.writeData(dateString, journalsDir, journalData)) {
        raiseError("Journal not saved.\nCannot create file " + dateString + " in " + journalsDir);
    }
    else {
        showInfo("Your journal saved!\t");
    }

    // get data from open journal
    function prepareJournalData () {
        var tableRows, activityPlan, activityDone;
        var object = {}; // empty object
        tableRows = document.getElementsByClassName("table-row");
        for (var i=0; i<tableRows.length; i++) {
            activityPlan = tableRows[i].querySelector(".activityPlan").value;
            activityDone = tableRows[i].querySelector(".activityDone").value;
            object[tableRows[i].id] = {"activityPlan": activityPlan,"activityDone":activityDone};
        }
        return object;
    }
}

// show week summary textarea if day field's value is
// equal to the value set in preferences
var weekEndFile = m.readFile('weekend', prefDir);
if(weekEndFile) {
    var weekEndObj = JSON.parse(weekEndFile),
    weekEnd = weekEndObj['weekend'];
}
else {
    raiseError("Cannot read file 'weekend' in " + prefDir + ". File permissions or IO error.");
}
document.getElementById('day').addEventListener('focusout', function() {
    if (this.value == weekEnd) {
        
    }
})

// create string of date of the format YYYY-MM-DD
//  and set it in input of type date
// set weekday
// function setDate(){
//     var month, date = new Date(), string = "";
//     string += date.getFullYear() + "-";
//     month = date.getMonth() + 1;
//     month = String(month);
//     string += (month.length > 1 ? month : "0" + month);
//     string += "-";
//     string += date.getDate();
//     document.getElementById('date').value = string;
// }
