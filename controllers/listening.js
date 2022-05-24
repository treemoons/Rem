
const { ipcMain, app, nativeTheme, ipcRenderer } = require('electron');

/** 初始化成功后，不再重复加载listening的判断 */
var initialed = false;

/**
 *
 * @param {Electron.BrowserWindow} win
 * @param {'app'|'system'} controller
 */
function addOnListening(win, controller) {
	if (initialed) return false;
	const dir = require('path').resolve(__dirname, './' + controller);
	const controllers = {};

	// due to fileName of dir './app'
	require('fs').readdirSync(dir).forEach(fileNane => controllers[fileNane] = require(dir + '/' + fileNane))


	//ipcMain listening "on"
	for (const name in controllers) {
		/**@type {(win:Electron.BrowserWindow,ev:Electron.IpcMainEvent,...arg)=>void[] } {channel:Function} */
		const controller = controllers[name];
		if (controller)
			for (const channel in controller) {
				ipcMain.on(channel, (ev, ...arg) => controller[channel](win, ev, ...arg));
			}
	}
	return true;
}
/**
 *
 * @param {Electron.BrowserWindow} win
*/
function listening(win) {
	if (addOnListening(win, 'system'))
		ipcMain.on('initiled-successed', e => {
			if (initialed) {
				e.reply('initiled-successed');
				return;
			}
			// add listening of users
			addOnListening(win, 'app');

			// show main window
			setTimeout(() => {
				// win.show();
				win.unmaximize();
				//启动参数传递前台
				let startArgvs = {};
				let count = 0;
				process.argv.forEach(v => {
					v.match(/--([^-]+)-([^=]+)=(.+)/gi);
					let key = RegExp.$2;
					console.log(key)
					let value = RegExp.$3;
					if (v.startsWith('--rendererArgv-')) {
						startArgvs[key] = value == "true" || "false" ? value == "true" ? true : false : value;
						startArgvs['count'] = ++count;
					} else {
						// start app
					}
				});
				if (startArgvs['count']) {
					e.reply('initiled-successed', startArgvs);
				} else
					e.reply('initiled-successed');
				initialed = true;
			}, 300);
		})
}

module.exports = listening;
