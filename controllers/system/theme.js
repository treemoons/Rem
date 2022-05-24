const { nativeTheme, ipcMain } = require('electron');
const fs = require('fs');
//	console.log(getFileAbsoluteURL('../../config/settings.json','string'))

module.exports =
{


	'get-system-theme-color':	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
		(win, ev, settings) => {
			let themeColor = 'light';
			if (nativeTheme.shouldUseDarkColors)
				themeColor = 'dark';
			else {
				themeColor = 'light'
			}
			ev.reply('get-system-theme-color', themeColor)
		}

	, 'listening-system-theme-color':	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
		(win, ev, listening = true) => {
			if (listening) {
				nativeTheme.removeAllListeners().once('updated', () => {
					if (nativeTheme.shouldUseDarkColors)
						themeColor = 'dark';
					else {
						themeColor = 'light'
					}
					ev.reply('listening-system-theme-color', themeColor)
				});
			} else
				nativeTheme.removeAllListeners();
		}

}