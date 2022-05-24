const fs = require('fs');
const {nativeTheme} = require('electron')
const {  removeJsonComment } = require('../utils');

module.exports = {

	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
	'get-settings': (win, ev, ...arg) => {
		const settingsString = fs.readFileSync('../../config/settings.json'.toPath(__dirname));
		const settingsJson = removeJsonComment(settingsString);
		let themeColor;
		/**@type {typeof top.settings} */
		const settings = JSON.parse(settingsJson);
		if (settings['theme-settings']["theme"] == "auto") {
			if (nativeTheme.shouldUseDarkColors)
				themeColor = 'dark';
			else {
				themeColor = 'light'
			}
		}
		else
			themeColor = settings["theme-settings"]["theme"];
		// reply object of settings and theme color
		ev.reply('get-settings', settings, themeColor)
	},
	/**
	 * @param {Electron.BrowserWindow}win
	 * @param {Electron.IpcMainEvent} ev
	 * @param {typeof top.settings} settings
	*/

	'save-settings': (win, ev, settings) => {
		fs.writeFileSync('../../config/settings.json'.toPath(__dirname), JSON.stringify(settings, (k, v) => { return v }, 2))
	}
}
