const { app, BrowserWindow, ipcMain, Menu, Tray, screen, ipcRenderer } = require('electron');
require('./controllers/utils/perload-prototype.js')
const transport = require('./controllers/utils/transport-fields.js')

function createWindow() {
	let win = new BrowserWindow({
		minWidth: 600,
		minHeight: 600,
		width: 1000,
		height: 700,
		show: false,
		frame: false,
		titleBarOverlay: true,
		backgroundColor: '#ffffff',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	win.minimize();
	win.menuBarVisible = false;
	require('./controllers/listening')(win);
	win.loadFile('./views/html/main/index.html'.toPath(__dirname));
	// win.webContents.openDevTools();
	return win;
}
// app.dock.setBadge("notice")
// app.dock.setMenu(menu);

app.whenReady().then(() => {
	transport.tray = new Tray('./src/img/test.ico'.toPath(__dirname))
	let win = createWindow();
	transport.snap.snapMark(win);
	win.addListener('resized', (ev, istop) => {
		if (!transport.snap.snaped) {
			transport.snap.snapMark(win);
		}
	});
	win.addListener('moved', (ev, istop) => {
		if (!transport.snap.snaped) {
			transport.snap.lastWindowPosition.x = win.getPosition()[0];
			transport.snap.lastWindowPosition.y = win.getPosition()[1];
		}
	});
	win.addListener('unmaximize', (e, top) => {
		transport.snap.snapBack(win);
		transport.windowSizeState = 'unmaximized';
	});
	win.addListener('maximize', e => {
		transport.windowSizeState = 'maximized';
		transport.snap.snaped = false;
	})
	if (process.platform == 'win32') {

		// 结束前保存所有记录
		win.addListener('session-end', () => {
			console.log('session end')

		});
	}
	// console.log(win.getPosition())
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Close',
			type: 'normal',
			role: 'close',
			click: e => {
				app.quit();
			}
		},
	]);
	transport.tray.addListener('click', () => {
		if (win.isMinimized()) {
			if (transport.windowSizeState == 'maximized') {
				win.maximize();
			} else {
				win.unmaximize();
			}
			win.show();
		} else {
			win.minimize();
		}
	});
	transport.tray.setToolTip('Rem.');
	transport.tray.setContextMenu(contextMenu);

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	});

});

app.on('window-all-closed', () => {

	app.quit()

})
// main-process
// ipcMain.on('drag-start', (event) => {
//     // event.sender.startDrag({
//     //     icon:'./src/img/test.ico'
//     // })
//     return true
// })
