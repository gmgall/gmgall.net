function detectOSTheme(){
  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark'
  else
    return 'light'
}

function switchTheme(e) {
  localStorage.setItem('overrideTheme', e.target.checked)
  setup()
}

function setup() {
  if (localStorage.getItem('overrideTheme') === 'true') { // valores em localStorage são sempre strings
    if (detectOSTheme() === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

var checkbox = document.getElementById('toggle-switch')
if (localStorage.getItem('overrideTheme') === 'true') //valores em localStorage são sempre strings
  checkbox.checked = true
else
  checkbox.checked = false
setup()
checkbox.addEventListener('change', switchTheme, false)
