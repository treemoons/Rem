
/**
 * 静态变量，用于后台electron 字段传输
 */
module.exports = {
	/**@type {'unmaximized'|'minimized'|'maximized'} */
	windowSizeState: 'unmaximized',
	tray: undefined,
	snap: {
	lastWindowSize: { width: 600, height: 600 },
	lastWindowPosition: { x: 0, y: 0 },
	snaped: false,
	snapMark(win) {
		this.lastWindowPosition.x = win.getPosition()[0];
		this.lastWindowPosition.y = win.getPosition()[1];
		this.lastWindowSize.width = win.getSize()[0];
		this.lastWindowSize.height = win.getSize()[1];
		},
	/** @param {Electron.BrowserWindow} win */
		snapBack(win) {
			win.setPosition(this.lastWindowPosition.x, this.lastWindowPosition.y,true);
			win.setSize(this.lastWindowSize.width, this.lastWindowSize.height, true);
	}
	}

}

