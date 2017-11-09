// ------------------ navigation buttons actions ------------------------

// Hide all sections and deselect nav-item
function hideAllSectionsAndDeselectButtons() {
    const sections = document.querySelectorAll('.js-section.is-shown');
    Array.prototype.forEach.call(sections, function (section) {
        section.classList.remove('is-shown')
    })

    const lis = document.querySelectorAll('.nav-li.is-selected');
    Array.prototype.forEach.call(lis, function(li){
        li.classList.remove('is-selected')
    })
}

// show section when corresponding button is selected
function handleSectionTrigger (event) {
    hideAllSectionsAndDeselectButtons();

    // Highlight clicked nav-item
    event.target.classList.add('is-selected');

    // Display current section
    const section = event.target.dataset.section;
    const sectionId = section + "-section";
    document.getElementById(sectionId).classList.add('is-shown');

    // save selected section
    m.writeData('lastActiveSection', prefDir, section)
}

document.body.addEventListener('click', function (event) {
  if (event.target.dataset.section) {
    handleSectionTrigger(event)
  }
})

// load default or last active section on launch of app
var lastActiveSection = m.readFile('lastActiveSection', prefDir);
document.getElementById(lastActiveSection).click();

// shortcut button in about.html, which on clicked with open howto section
const howtoButton = document.querySelector('#howto-section-shortcut');
howtoButton.addEventListener('click', function(){
    document.getElementById('howto').click();
});
