
import {
	appendCSSLink,
	ArticleListCurrrentActive,
	changeThemeChildIframeColor,
	changeThemeColor,
	loadBackgroundSize,
	navShowOrArticleShow,
	onResizeArticleList,
	onSerialArticleLi,
	showWaitDot
} from './theme.js'
//* adding renderer listening
top.ipcRenderer.topOn('listening-system-theme-color', (ev, themeColor) => {
	top.theme = themeColor;
	changeThemeColor(themeColor);
	//保留监听system-theme
	top.ipcRenderer.send('listening-system-theme-color');
})
	//* get-settings
	.topOn('get-settings', (ev, settings, themeColor) => {
		top.settings = settings;
		// console.log(JSON.stringify(settings))
		top.theme = themeColor;
		top.settingsCssLink = document.getElementById('theme').href = `../../css/theme/${top.theme}.css`;
		document.getElementById('backimg').src = top.settings["theme-settings"]["default-background-img"];

		document.getElementById('max-iframe-background').style.backgroundImage = `url('${top.settings['theme-settings']['default-background-img']}')`;

		if (top.settings["theme-settings"]["theme"] == 'auto') {
			top.ipcRenderer.send('listening-system-theme-color');
		}
	})
	//* initial-article-list
	.once('initial-article-list', (ev, ...arg) => {
		let articleListALLLi = document.querySelectorAll('.article-list li>div')
		ArticleListCurrrentActive.addClickListening(articleListALLLi);
		navShowOrArticleShow(document, top.settings["regular-settings"]["hidden-shown-acticle"]);
		document.getElementById('today').click();
		top.titleBar.goback.style.visibility = 'hidden';

		// index.js  initialed successfully

		//#region //! resizeArticleList

		onResizeArticleList(top.resizeArticleListEle);
		//#endregion
		//
		onSerialArticleLi();
		top.ipcRenderer.send('initiled-successed');
	})
	//*initiled-successed
	.once('initiled-successed', (e, argv) => {
		/**@type {{maxiframe:false,src:'account'|'settings'|'search'|'new-article'|'planed'|'draft'|'email'|'starred'|'today'|'archive'|'content',querystring:'?',anchor:'#'}} */
		let allArgvs;
		try {
			for (let key in argv) {
				switch (key) {
					case 'test':
						console.log(argv[key])
						break;
					default:
						break;
				}
			}

		} catch (error) {

		}
		let preload = document.getElementById('preload');
		preload.style.transition = 'left 300ms ease;'
		setTimeout(() => {
			preload.style.left = '-100%';
			setTimeout(() => {
				preload.remove();
				showWaitDot(false);
			}, 300);
		}, 1000);
	})

// loading ,pending,

top.backgroundImgEle = document.getElementById('backimg');
if (top.backgroundImgEle)
	top.backgroundImgEle.onload = function (ev) {
		loadBackgroundSize(this, document.body);
	}
let windowSizeTimeout;
onresize = ev => {
	loadBackgroundSize(top.backgroundImgEle, document.body);
	let maxArticleWidth = parseInt(getComputedStyle(document.body).width.replace('px').trim()) / top.articleListMaxShrink;
	document.querySelector('.article-lists').style.maxWidth = maxArticleWidth + 'px';
	windowSizeTimeout = setTimeout(() => {
		top.ipcRenderer.send('resized');
		clearTimeout(windowSizeTimeout);
	}, 100);
}
// container change theme or other things after loaded

top.iframeContainer.onload = function (e) {
	changeThemeChildIframeColor(top.theme);
	appendCSSLink(this.contentDocument, 'content-container', 'contentifr')
	this.classList.add('show-display');

	setTimeout(() => {
		this.classList.remove('show-display')

	}, 300);
};
top.maxWindowIframe.onload = function (e) {
	appendCSSLink(this.contentDocument, 'maxiframe-container', 'maxifr')
	changeThemeChildIframeColor(top.theme);
	if (top.maxWindowIframeBackground.style.display != 'block') {
		top.maxWindowIframe.classList.add('show-display');
		setTimeout(() => {
			top.maxWindowIframe.classList.remove('show-display')
		}, 300);
	}
}

// start initialing
top.ipcRenderer.send('get-settings');
top.ipcRenderer.send('initial-article-list');
