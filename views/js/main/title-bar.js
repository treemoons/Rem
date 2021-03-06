import { ArticleListCurrrentActive } from "./theme.js";

const minWindow = document.querySelector('.btn-min'),
	headerBar = document.getElementById('title'),
	snap = document.getElementById('snap'),
	maxWindow = document.querySelector('#btn-max'),
	closeWindow = document.querySelector('.btn-close'),
	goback = document.querySelector('.header-menu');

top.titleBar = {
	headerBar: headerBar,
	minWindow: minWindow,
	maxWindow: maxWindow,
	closeWindow: closeWindow,
	goback: goback
};


minWindow.onclick = ev => top.ipcRenderer.send('min-window');

maxWindow.onclick = ev => top.ipcRenderer.send('max-window');
let snapTimeout;
function snapHidden() {
	snap.style.display = 'none';
	clearTimeout(snapTimeout);
	snapTimeout = undefined;
}
maxWindow.onmouseenter = e => {
	clearTimeout(snapTimeout);
	snapTimeout = setTimeout(() => {
		snap.style.display = 'flex';
	}, 500);
}
maxWindow.onmouseleave = e => {
	if (snapTimeout) {
		clearTimeout(snapTimeout);
		snapTimeout = setTimeout(() => {
			snapHidden();
		}, 500);
	}
}
snap.onmouseenter = e => {
	clearTimeout(snapTimeout);
	snapTimeout = undefined;
}
snap.onmouseleave = e => {
	snapTimeout = setTimeout(() => {
		snapHidden();
	}, 500);
}
let snapLeftDiv = document.querySelector('.snap-left'),
	snapRightDiv=document.querySelector('.snap-right'),
	snap1 = document.querySelector('.snap-position1'),
	snap2 = document.querySelector('.snap-position2'),
	snap3 = document.querySelector('.snap-position3'),
	snap4 = document.querySelector('.snap-position4');
let snapLeft = document.querySelector('.snap-left-hover');
let snapRight = document.querySelector('.snap-right-hover');
snap1.onclick = e => top.ipcRenderer.send('snap-window', 'top-left');
snap2.onclick = e => top.ipcRenderer.send('snap-window', 'top-right');
snap3.onclick = e => top.ipcRenderer.send('snap-window', 'bottom-left');
snap4.onclick = e => top.ipcRenderer.send('snap-window', 'bottom-right');
snapLeft.onclick = e => top.ipcRenderer.send('snap-window', 'left');
snapRight.onclick = e => top.ipcRenderer.send('snap-window', 'right');
snapLeftDiv.onclick = e => snapHidden();
snapRightDiv.onclick = e => snapHidden();

closeWindow.onclick = function (ev) {
	top.ipcRenderer.send('close-window', top.settings["tray-settings"]["background-running"]);
	this.blur();
}
top.ipcRenderer.on('is-max-window',(ev, max) => {
	if (max=='maximized') {
		maxWindow.className = 'btn-max';
	} else {
		maxWindow.className = 'btn-unmax';
	}
});
top.historyMaxIframeCount = 0;
goback.onclick = ev => {
	if (top.historyMaxIframeCount != 0) {
		top.historyMaxIframeCount--;
	}
	// maxIframe ??????
	if (top.maxWindowIframeBackground.style.display != '' && top.historyMaxIframeCount == 0) {

		//	// top.maxWindowIframe.style.top = '100%';
		//	// top.titleBar.goback.style.visibility = 'hidden';
		//	// let show=	top.maxWindowIframe.contentDocument.querySelectorAll('.show-display');
		//	// for (const ele of show) {
		//	// ele.classList.replace('show-display','hidden-display')
		//	// }
		// goback ???????????????
		if (top.titleBar.goback.classList.contains('goback-max')) {
			top.titleBar.goback.classList.remove('goback-max');
		}
		// ????????????GOBACK
		if (top.historyArticle.length == 0) {
			top.titleBar.goback.style.visibility = 'hidden';
		}
		// ????????????
		let articlelist = document.querySelector('.article-list');
		articlelist.classList.add('show-display')
		top.iframeContainer.classList.add('show-display');
		top.maxWindowIframeBackground.style.display = '';
		setTimeout(() => {
			articlelist.classList.remove('show-display')
			top.iframeContainer.classList.remove('show-display')
			//top.maxWindowIframe.src = '';
		}, 300);
	} else {
		// ???MaxIframe????????????goback??????article??????
		if (top.titleBar.goback.classList.contains('goback-max')) {
			history.go(-1);	// ???????????????MaxIframe?????????goback?????????
			return;
		}

		// goback??????article?????????????????????
		let lastArticle = top.historyArticle.pop();
		if (lastArticle) {
			ArticleListCurrrentActive.changeActiveClass(lastArticle);
			history.go(-1);	// ???????????????Iframe???????????????goback?????????
			// hidden goback icon
			if (top.historyArticle.length == 0)
				top.titleBar.goback.style.visibility = 'hidden';
		}
	}
}
