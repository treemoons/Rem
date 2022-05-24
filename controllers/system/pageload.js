const { screen } = require('electron');
const transport = require('../utils/transport-fields.js');
module.exports =
{
	/**@param {Electron.BrowserWindow}win */
	'min-window': win => {
		win.minimize();
	},

	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
	'max-window': (win, ev) => {
		if ((transport.windowSizeState != 'maximized') || (transport.snap.snaped && transport.windowSizeState == 'maximized')) {
			win.maximize();
			transport.windowSizeState = 'maximized';
		}
		else {
			win.unmaximize();
			transport.snap.snapBack(win);
			transport.windowSizeState = 'unmaximized';
		}
		ev.reply('is-max-window', transport.windowSizeState);

	},

	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev @param {'top-left'|'top-right'|'bottom-left'|'bottom-right'|'left'|'right'} snapLayout*/
	'snap-window': (win, ev, snapLayout) => {
		transport.snap.snaped = true;
		let width, height, x, y;
		let halfScreenWidth = screen.getPrimaryDisplay().workAreaSize.width / 2;
		let halfScreenHeight = screen.getPrimaryDisplay().workAreaSize.height / 2;
		halfScreenWidth = halfScreenWidth < 600 ? 600 : halfScreenWidth;
		halfScreenHeight = halfScreenHeight < 600 ? 600 : halfScreenHeight;
		let minY = halfScreenHeight == 600 ? screen.getPrimaryDisplay().workAreaSize.height - 600 : halfScreenHeight;
		let minX = halfScreenWidth == 600 ? screen.getPrimaryDisplay().workAreaSize.width - 600 : halfScreenWidth;
		if (snapLayout.includes('-')) {
			width = halfScreenWidth;
			height = halfScreenHeight;
			if (snapLayout.includes('left')) {
				x = 0;
			}
			if (snapLayout.includes('right')) {
				x = minX;
			}
			if (snapLayout.includes('top')) {
				y = 0;
			}
			if (snapLayout.includes('bottom')) {
				y = minY;
			}
		}
		else if (snapLayout == 'left' || snapLayout == 'right') {
			height = screen.getPrimaryDisplay().workAreaSize.height;
			y = 0;
			if (snapLayout == 'left') {
				width = halfScreenWidth;
				x = 0;
			}
			if (snapLayout == 'right') {
				width = halfScreenWidth;
				x = minX;
			}
		};
		if (transport.windowSizeState == 'maximized') {
			win.unmaximize();
		}
		win.setPosition(x, y, true);
		win.setSize(width, height, true);
	},
	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
	'resized': (win, ev) => {
		ev.reply('is-max-window', transport.windowSizeState);
	},
	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */
	'close-window': (win, ev, isBackgroundRuning) => {
		if (isBackgroundRuning) {
			win.minimize();
			setTimeout(() => {
				win.hide();
			}, 100);
		} else {
			win.close()
		}
	},
	/**@param {Electron.BrowserWindow}win @param {Electron.IpcMainEvent} ev */

	'initial-article-list': (win, ev) => {
		let articleList;
		ev.reply('initial-article-list', articleList);
	}
}
