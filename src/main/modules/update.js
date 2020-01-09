import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

const update = evt => new Promise((resolve, reject) => {
  autoUpdater.on('update-available', ({ version }) => {
    evt.reply('updateFound', version)
  })

  autoUpdater.on('update-not-available', () => {
    resolve()
  })

  autoUpdater.on('download-progress', ({ percent }) => {
    evt.reply('updateProgress', percent)
  })

  autoUpdater.on('update-downloaded', async ({ version }) => {
    const quit = await dialog.showMessageBox({
      type: 'question',
      message: `Able2 v${version} has finished downloading. For the update to take effect Able2 must restart. Close Able2?`,
      buttons: ['Close and Install', 'Not Now']
    })
  
    if (quit.response === 0) autoUpdater.quitAndInstall()
  
    resolve()
  })
  
  autoUpdater.on('error', reject)

  return autoUpdater.checkForUpdatesAndNotify()
})

export default update
