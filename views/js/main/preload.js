

const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
top.ipcRenderer = ipcRenderer;
top.ipcRenderer.removeAllListeners();
top.ipcRendererOnListenings = {};
ipcRenderer.topOn = (channel, listener) => {
	if (top.ipcRendererOnListenings[channel]) {
		top.ipcRenderer.removeListener(channel, top.ipcRendererOnListenings[channel])
	}
	top.ipcRendererOnListenings[channel] = listener;
	top.ipcRenderer.on(channel, top.ipcRendererOnListenings[channel]);
	return top.ipcRenderer;
}
top.electron = electron;
top.historyArticle = [];
top.maxWindowIframe = document.getElementById('max-iframe');
top.maxWindowIframeBackground = document.getElementById('max-iframe-background');
top.iframeContainer = document.getElementById('iframe-container');
top.resizeArticleListEle = document.getElementById('resize-list');

Date.prototype.formatDate = function (fmt) {
	let o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"f": this.getMilliseconds() //毫秒
	};

	let week = {
		"0": "\u65e5",
		"1": "\u4e00",
		"2": "\u4e8c",
		"3": "\u4e09",
		"4": "\u56db",
		"5": "\u4e94",
		"6": "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
	}
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
