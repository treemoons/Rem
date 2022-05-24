import {
	AutoArticleListWidth,
	showMaxIframe,
	switchThemeColor
} from './theme.js';

import {
	createUrlString
} from './utils.js'

////#region 自定义
//// readonly ipcRenderer: Electron.IpcRenderer;
//// readonly nav : {
////     articleListIcon: HTMLDivElement,
////     newArticle: HTMLDivElement,
////     search: HTMLDivElement,
////     searching: HTMLInputElement,
////     starred: HTMLDivElement,
////     email:HTMLDivElement
//// }
//// readonly theme: { theme: 'light' | 'dark', 'default-background-img': string }
//// readonly maxWindowIframe: HTMLIFrameElement;
//// readonly iframeContainer: HTMLIFrameElement;
////#endregion

// theme
const themeCssLink = document.getElementById('theme').href;

// top-nav element
const articleListIcon = document.getElementById('article-list-icon');
const newArticle = document.getElementById('new-article');
const search = document.getElementById('search')
const searching = document.getElementById('searching')
const starred = document.getElementById('starred')
const email = document.getElementById('email');
const planed = document.getElementById('planed');
const draft = document.getElementById('draft');
const archive = document.getElementById('archive');
top.themeCssLink = themeCssLink;
top.nav = {
	articleListIcon: articleListIcon,
	newArticle: newArticle,
	search: {
		icon: search,
		input: searching
	},
	starred: starred,
	email: email,
	planed: planed,
	draft: draft,
	archive: archive
};

//#region //! icon of article list

let list = document.querySelector('.article-lists');
if (articleListIcon) {
	articleListIcon.onclick = function (e) {
		if (window.getComputedStyle(list).width == '0px') {
			AutoArticleListWidth.getArticleListDefaultWidth();
			list.style = `width:${(AutoArticleListWidth.articleListMaxWidth > top.articleListMaxWidth ? top.articleListMaxWidth : AutoArticleListWidth.articleListMaxWidth)}px;`;
			top.resizeArticleListEle.style.display = 'block';
		} else {
			list.style.width = '0'
			list.style.minWidth = '0';
			top.resizeArticleListEle.removeAttribute('style');
		}
	}
}
//#endregion


//#region  quick adding by settings,default today
if (newArticle) {
	newArticle.onclick = function (ev) {
		top.maxWindowIframe.src = createUrlString('new-article');
		showMaxIframe(); top.articleListMinWidth = 300;
	};
}

//#endregion

//#region  search icon
if (search)
	search.onclick = function (e) {
		this.children[1].children[0].focus();

	}
// searching input
if (searching) {
	searching.onkeydown = function (e) {
		if (e.key == 'Enter') {
			if (this.value == '') return;
			let searchicon = this.parentElement.parentElement.children[0];
			if (!searchicon.style.animation) {
				searchicon.style.animation = ' searching 1s infinite linear';
			}
			let ifr = top.maxWindowIframe;
			// old iframe-src
			// /**@type {string} */
			// const oldsrc = ifr.src;
			// if (!RegExp('../pages/search.html', 'gi').test(oldsrc)) {
			// 	 动画
			// }
			// // if (list.style.width != "") {
			// // 	top.nav.articleListIcon.click();
			// // }
			// load iframe
			ifr.src = createUrlString('search', { searching: this.value });
			this.blur();
			showMaxIframe();
			//do function
			setTimeout(() => {
				searchicon.style.animation = '';
			}, 1000);

		}
	}

	searching.onblur = function () {

	}
}
if (document.querySelector(".searching::after"))
	document.querySelector(".searching::after").onclick = function () {
		console.log(this.textContent)
	}
//#endregion





// #region //!  Bottom nav
const synchronize = document.getElementById('synchronize'),
	settings = document.getElementById('settings');
top.nav.settings = settings;
top.nav.synchronize = synchronize;
// 同步
if (synchronize)
	synchronize.onclick = function (e) {
		this.children[0].style.animation = 'rotate360 1s linear infinite ';
	}

// 设置
if (settings)
	settings.onclick = function (e) {
		if (top.maxWindowIframe.src != createUrlString('settings'))
			top.maxWindowIframe.src = createUrlString('settings');
		showMaxIframe();
	}
//#endregion