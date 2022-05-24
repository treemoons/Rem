import { ArticleListCurrrentActive, navShowOrArticleShow, switchThemeColor } from '../main/theme.js';
import {
	convertRGBColorToHex
} from '../main/utils.js'

//#region //todo regular settings

//#region //! new paragraph to top
const addTop = document.getElementById('add-top');
if (addTop) {
	addTop.checked = top.settings['regular-settings']['add-top'];
	addTop.onchange = function (ev) {
		top.settings['regular-settings']['add-top'] = this.checked;
		top.ipcRenderer.send('save-settings', top.settings)
	}
}
//#endregion

//#region //! delete-warning
const deleteWarning = document.getElementById('delete-warning');
if (deleteWarning) {
	deleteWarning.checked = top.settings['regular-settings']['delete-warning'];
	deleteWarning.onchange = function (ev) {
		top.settings['regular-settings']['delete-warning'] = this.checked;
		top.ipcRenderer.send('save-settings', top.settings)
	}
}
//#endregion

//#region  //! overtime check

//// console.log(top.settings["theme-settings"]['theme'])
// ///**@type {HTMLInputElement} */
// //let a;
const overtimingWarning = document.getElementById('overtiming-warning');
const overtiming = document.getElementById('overtiming-color');
const overtimingRecords = document.getElementById('overtiming-color-records')
const overtimingLabel = document.querySelector('.overtiming label');
if (overtimingWarning) {
	overtimingWarning.checked = top.settings['regular-settings']['overtiming-warning'];
	overtimingWarning.onchange = function (ev) {
		if (overtimingWarning.checked) {
			overtimingRecords.removeAttribute('style');
		} else {
			overtimingRecords.style.height = 0;
		}
		top.settings['regular-settings']['overtiming-warning'] = overtimingWarning.checked;
		top.ipcRenderer.send('save-settings', top.settings)
	}
} else console.error('overtimingWarning is null')

//#region //! 过期标记


const overtimingColorRecords = document.querySelector('.overtiming-color-record')
const records = document.querySelectorAll('.overtiming-color-record div');

function loadWarningOvertime() {
	records.forEach((v, i) => {

		if (top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color-record"].length - 1 < i) {
			top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color-record"].push(v.style.backgroundColor)
		}
		////console.log(top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color-record"][i])
		v.style.backgroundColor = top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color-record"][i];
		v.onclick = function (ev) {
			// //overtimingColorRecords.prepend(v);
			let hexColor = convertRGBColorToHex(v.style.backgroundColor)
			overtimingLabel.style.color = hexColor;
			overtiming.value = hexColor;
			top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color"] = hexColor;
			top.ipcRenderer.send('save-settings', top.settings)
			// console.log(hexColor)
		}
	});
	let currentColor = top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color"];
	overtiming.value = currentColor;
	overtimingLabel.style.color = currentColor;
}
if (overtiming) {
	overtiming.oninput = function (ev) {
		overtimingLabel.style.color = this.value;

	}
	overtiming.onchange = function (ev) {
		let lastRecord = document.querySelector('.overtiming-color-record div:last-child')
		lastRecord.style.backgroundColor = this.value;
		overtimingColorRecords.prepend(lastRecord);
		top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color"] = this.value;
		records.forEach((v, i) => {
			console.log(v.style.backgroundColor)
			let hexColor = convertRGBColorToHex(v.style.backgroundColor);
			top.settings["regular-settings"]["overtiming-color-records"][top.theme]["overtiming-color-record"][i] = hexColor;
		});
		top.ipcRenderer.send('save-settings', top.settings)
		// send saving request
	}
	loadWarningOvertime();
} else console.error('overtiming is null');

//#endregion


//#endregion

//#region //! auto-recycle-paragraph
const autoRecycle = document.getElementById('auto-recycle-paragraph');
if (autoRecycle) {
	autoRecycle.checked = top.settings['regular-settings']['auto-recycle-paragraph'];
	autoRecycle.onchange = function (ev) {
		top.settings['regular-settings']['auto-recycle-paragraph'] = this.checked;
		top.ipcRenderer.send('save-settings', top.settings)
	}
}
//#endregion

//#region //! save the draft automatically
const draftAutoSave = document.getElementById('draft-saving');
if (draftAutoSave) {
	draftAutoSave.checked = top.settings['regular-settings']['draft-saving'];
	draftAutoSave.onchange = function (ev) {
		top.settings['regular-settings']['draft-saving'] = this.checked;
		top.ipcRenderer.send('save-settings', top.settings)
	}
}
//#endregion

//#region  //! hidden-article
const hiddenArticle = document.getElementById('hidden-article');
if (hiddenArticle) {
	hiddenArticle.checked = top.settings['regular-settings']['hidden-shown-acticle'];
	hiddenArticle.onchange = function () {
		console.log(hiddenArticle.checked)
		top.settings['regular-settings']['hidden-shown-acticle'] = this.checked;
		navShowOrArticleShow(window.parent.document, this.checked)
		top.ipcRenderer.send('save-settings', top.settings)
	}
}

//#endregion



//#endregion

// #region //todo theme setting
const lightRadio = document.getElementById('light');
const darkRadio = document.getElementById('dark');
const systemRadio = document.getElementById('system');

/**
 *
 * @param {'light'|'dark'} theme
 */
function themeColorChange(themeColor) {

	top.ipcRenderer.send('listening-system-theme-color', false);
	top.theme = themeColor;
	top.settings["theme-settings"]["theme"] = themeColor;
	top.ipcRenderer.send('save-settings', top.settings)
	switchThemeColor(themeColor);
	loadWarningOvertime();
}
// //console.log(top.settings["theme-settings"]['theme'])
switch (top.settings["theme-settings"]['theme']) {
	case 'light':
		lightRadio.checked = true;
		break;
	case 'dark':
		darkRadio.checked = true;
		break;
	default:
		systemRadio.checked = true;
		break;
}

if (lightRadio) {
	lightRadio.onchange = e => {
		if (lightRadio.checked && top.theme != 'light' && top.settings["theme-settings"]['theme'] != 'light') {
			themeColorChange('light')
		}
	}
} else console.error('lightRadio is null')
if (darkRadio) {
	darkRadio.onchange = e => {
		if (darkRadio.checked && top.theme != 'dark' && top.settings["theme-settings"]['theme'] != 'dark') {
			themeColorChange('dark')
		}
	}
} else console.error('darkRadio is null')
if (systemRadio) {
	systemRadio.onchange = e => {
		if (systemRadio.checked) {
			top.ipcRenderer.send('get-system-theme-color');
		}
	}
	top.ipcRenderer.topOn('get-system-theme-color', (ev, themeColor) => {
		if (top.theme != themeColor) {
			switchThemeColor(themeColor);
			top.theme = themeColor;
			loadWarningOvertime();
		}
		top.settings["theme-settings"]["theme"] = 'auto'
		top.ipcRenderer.send('listening-system-theme-color');
		top.ipcRenderer.send('save-settings', top.settings);
	})
} else console.error('systemRadio is null')

//#endregion

//#region //todo nav-list-article-list

let canHiddenNavIconEle = document.querySelectorAll('.nav-list-display li:not(.readonly) input');
if (canHiddenNavIconEle) {
	canHiddenNavIconEle.forEach(v => {
		// load settings
		v.checked = top.settings["nav-icon"][v.id];
		// settings changes
		v.onchange = function (e) {
			// debugger
			top.settings["nav-icon"][v.id] = v.checked;
			navShowOrArticleShow(window.parent.document, top.settings['regular-settings']['hidden-shown-acticle']);
			top.ipcRenderer.send('save-settings', top.settings);
		}
	})
} else console.error('canHiddenNavIconEle is null')
//#endregion

//#region //todo tray-settings

//#region //!background-runing

const backgroundRuning = document.getElementById('background-runing');
if (backgroundRuning) {
	backgroundRuning.checked = top.settings['tray-settings']['background-running'];
	backgroundRuning.onchange = function () {
		top.settings['tray-settings']['background-running'] = backgroundRuning.checked;
		top.ipcRenderer.send('save-settings', top.settings);
	}
}

//#endregion
