//------------------- open links in external browser -----------------

const shell = require('electron').shell

const openInExternal = document.querySelectorAll('a[href]')

Array.prototype.forEach.call(openInExternal, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})
