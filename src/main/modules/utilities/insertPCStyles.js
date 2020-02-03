import toCSS from 'to-css'

const getPCStyles = () => toCSS({
  'body::-webkit-scrollbar': {
    width: '12px',
    height: '12px'
  },
  'body::-webkit-scrollbar-corner': {
    'background-color': '#eee'
  },
  'body::-webkit-scrollbar-thumb': {
    'background-color': '#777',
    'border-radius': '6px',
    border: '2px solid #eee'
  },
  'body::-webkit-scrollbar-button': {
    display: 'none'
  }
})

const insertPCStyles = win => {
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(getPCStyles(), {
      cssOrigin: 'user'
    })
  })
}

export default insertPCStyles
