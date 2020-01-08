import { remote } from 'electron'
const textElements = 'input[type="text"]'

const setContextMenu = () => {
  const menu = new remote.Menu()

  if (process.env.NODE_ENV === 'development') {
    let pos = {}
    
    menu.append(new remote.MenuItem({
      label: 'Inspect Element',
      click() {
        remote.getCurrentWindow().inspectElement(pos.x, pos.y)
      }
    }))
  
    window.addEventListener('contextmenu', e => {
      e.preventDefault()
      pos = { x: e.x, y: e.y }
      menu.popup(remote.getCurrentWindow())
    })
  } else {
    const menuItems = [
      new remote.MenuItem({ role: 'cut' }),
      new remote.MenuItem({ role: 'copy' }),
      new remote.MenuItem({ role: 'paste' }),
      new remote.MenuItem({ type: 'separator' }),
      new remote.MenuItem({ role: 'selectAll' })
    ]
  
    menuItems.forEach(item => menu.append(item))
  
    window.addEventListener('contextmenu', e => {
      e.preventDefault()
  
      if (e.target.matches(textElements) && !e.target.disabled) {
        menu.popup(remote.getCurrentWindow())
      }
    })
  }
}

export default setContextMenu
