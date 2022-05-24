import { createUrlString, getAjaxData } from "./utils.js";

/**
 *	synchronize size of background image with parentElement
 * @param {HTMLImageElement} backgroundimg
 * @param {HTMLDivElement} prarentEle
 */
export function loadBackgroundSize(backgroundimg, prarentEle) {
	let windowHeight = window.getComputedStyle(prarentEle).height.replace('px', '');
	let backimgHeight = window.getComputedStyle(backgroundimg).height.replace('px', '');
	let windowWidth = window.getComputedStyle(prarentEle).width.replace('px', '');
	let backimgWidth = window.getComputedStyle(backgroundimg).width.replace('px', '');
	let rateHeight = windowHeight / backimgHeight;
	let rateWidth = windowWidth / backimgWidth;
	if (rateHeight < rateWidth) {

		let suitWidthSize = window.getComputedStyle(backgroundimg).width.replace('px', '') * rateWidth;
		// console.log(suitWidthSize)
		backgroundimg.style.width = suitWidthSize + 'px';

	}
	else {
		let suitWidthSize = window.getComputedStyle(backgroundimg).width.replace('px', '') * rateHeight;
		// console.log(suitWidthSize)
		backgroundimg.style.width = suitWidthSize + 'px';

	}
}

//#region  change theme color
export function switchThemeColor(themeColor) {
	if (themeColor != 'dark') {
		changeThemeColor('light')
	}
	else {
		changeThemeColor('dark')
	}
}

/**!!
 *!!
 * @param {document} doc
 * @param {[data:{},id:string,attribute:string]} id
 */
function setAttributeDataToInnerText(doc, ...[data, id, attribute]) {
	let allSystemWorlds = doc.querySelectorAll(`[${attribute}]`);
	for (const ele of allSystemWorlds) {
		let AttributeValue = ele.getAttribute(attribute);
		ele.innerText = data[id][AttributeValue];
	}
}

/**
 *
 * @param {{ id:{attributeValue:string}}} data
 * @param {string} id
 * @param {string} attribute
 */
export function setAttributeRelativeDataToInnerText(data, id, attribute) {
	updateAllIframe([data, id, attribute], setAttributeDataToInnerText)
}

/**
 *
 * @param {Document} doc
 * @param {string} cssname
 * @param {string} cssid
 */
export function appendCSSLink(doc, cssname, cssid) {
	let existCSSLink = doc.getElementById(cssid);
	let themeCSSlink = cssid == 'theme' ? `../../css/theme/${cssname}.css` : `../../css/${cssname}.css`;
	if (existCSSLink && existCSSLink.href != themeCSSlink) {
		existCSSLink.href = themeCSSlink;
		existCSSLink.rel = "stylesheet";
		// console.log(themeEle)
	} else if (!existCSSLink) {
		let newCSSLink = document.createElement('link');
		newCSSLink.id = cssid;
		newCSSLink.rel = "stylesheet";
		newCSSLink.href = themeCSSlink;
		doc.head.prepend(newCSSLink);
	}
}
/**
 *
 * @param {Document} doc
 * @param {string} theme
 */
function appendThemeCSSLink(doc, theme) {
	appendCSSLink(doc, theme, 'theme');
}
/**@type {number} */
let themeTimeout;
/**
 *
 * @param {'light'|'dark'} theme
 * @param {(...themeArgs)=>void} callback
 * @param {any[]} args
 */
export function changeThemeColor(theme) {

	appendCSSLink(document, theme, 'theme');
	updateAllIframe([theme], appendThemeCSSLink);

}
export function changeThemeChildIframeColor(theme) {
	updateChildrenIframe(window, appendThemeCSSLink, theme)
}

/**
 *
 * @param {document} doc
 * @param {{}}langData
 * @param {'title'|'placleholder'|'value'} attr
 */
function changAtrrLanguage(doc, langData, attr) {
	let eles = doc.querySelectorAll(`[data-lang-${attr}]`);
	if (eles)
		eles.forEach(ele => {
			if (langData[attr][ele.getAttribute(`data-lang-${attr}`)])
				ele.setAttribute(attr, langData[attr][ele.getAttribute(`data-lang-${attr}`)])
		});
}
/**
 *
 * @param {document} doc
 * @param {{
	"innertext": {},
	"title": {},
	"placleholder": {
		"searching": "输入关键词后回车"
	}
	,"value":{}
}} langData
 */
export function changeLanguage(doc, langData) {
	if (langData['innertext']) {
		let docs = doc.querySelectorAll('[data-lang-innertext]');
		docs.forEach(v => {
			v.innerText = langData['innertext'][v.getAttribute('data-lang-innertext')]
		})
	}
	if (langData['placleholder']) {
		changAtrrLanguage(doc, langData, 'placleholder')
	}
	if (langData['title']) {
		changAtrrLanguage(doc, langData, 'title')
	}
	if (langData['value']) {
		changAtrrLanguage(doc, langData, 'value')
	}
}

/**
 *
 * @param {object} lang
 */
export function changeLanguageAllDisplay(lang) {
	if (top['settings']['regular-settings']['language'] != lang) {
		getAjaxData({
			url: `../../../config/language/${lang}.json`,
			success: langData => {
				debugger
				updateAllIframe([JSON.parse(langData)], changeLanguage);
			}
		});
	}
}
/**
 * update all iframe with a key
 * @param {*[]} key
 * @param {(doc:Document,key:any[])=>void} update
 * @param {Window} win current window
 */
function updateAllIframe([...key], update, win = window) {
	updateParentsIframe(win, update, ...key);
	updateChildrenIframe(win, update, ...key);
}

/**
 *
 * @param {Window} win
 * @param {(doc:Document,key:any)=>void} update
 * @param {*[]} key
 */
function updateParentsIframe(win, update, ...key) {
	let parent = win.parent.document;
	let parentIfr = parent.getElementsByTagName('iframe');
	update(parent, ...key);
	if (parent != win.document) {
		for (let iframe of parentIfr) {
			update(iframe.contentDocument, ...key);
			if (top.document != iframe.contentDocument) {
				updateChildrenIframe(iframe.contentWindow, update, ...key)
			}
			if (iframe.contentWindow != win) {
				updateParentsIframe(iframe.contentWindow.parent, update, ...key);
			} else {
				updateParentsIframe(win.parent, update, ...key);
			}
		}
	}
}
/**
 *
 * @param {Window} win
 * @param {(doc:Document,key:any)=>void} update
 * @param {*} key
 */
function updateChildrenIframe(win, update, ...key) {
	let children = win.document.getElementsByTagName('iframe');
	for (const ifr of children) {
		update(ifr.contentDocument, ...key);
		updateChildrenIframe(ifr.contentWindow, update, ...key)
	}
}

export function saveThemeSettings(...value) {
	top.ipcRenderer.send('save-theme-settings', ...value)
}

//#endregion

/**
 *
 * @param {boolean} show default true
 */
export function showWaitDot(show = true) {
	top.document.querySelector('.header-waiting').style.display = show ? 'block' : 'none';
}

/**
 *
 * @param {HTMLDivElement} parentEle
 * @param {{dotSize:'7px'|string,	frameSize: '50px'|string,dotColor: 'var(--user-theme-color)'|string}} param1
 */
export function initialProgressRing(parentEle, { dotSize = '7px',
	frameSize = '50px',
	dotColor = 'var(--user-theme-color)' }) {
	parentEle.innerHTML = `<div class="waitring-frame"
	 style='--waitring-size: ${dotSize};
	--waitring-frame-size: ${frameSize};
	--waitring-color: ${dotColor};' >
		<div class="waitring-bar1">
			<div class="waitring1 waitrings"></div>
		</div>
		<div class="waitring-bar2">
			<div class="waitring2 waitrings"></div>
		</div>
		<div class="waitring-bar3">
			<div class="waitring3 waitrings"></div>
		</div>
		<div class="waitring-bar4">
			<div class="waitring4 waitrings"></div>
		</div>
		<div class="waitring-bar5">
			<div class="waitring5 waitrings"></div>
		</div>
	</div>`
}

/**
 *
 * @param {HTMLDivElement} ele
 * @param {'block'|'inline-block'|'inline'|'contents'|'flex'|'inline-flex'|'collapse'|'hidden'|'visible'|'none'|number} display
 */
export function displayDiv(ele, display) {
	switch (display) {
		case 'inline':
		case 'block':
		case 'inline-block':
		case 'flex':
		case 'inline-flex':
		case 'none':
			ele.style.display = display;
			break;
		case 'visible':
		case 'collapse':
		case 'hidden':
			ele.style.visibility = display;
			break;
		case typeof display == 'number':
			ele.style.opacity = display;
			break;
	}
}

/**
 * ARTICLE LIST 根据文字多少确定长度	// 最长70个字母 // 中文16个
 */
export class AutoArticleListWidth {
	/** */
	static articleListMaxWidth = 0;
	/** */
	static getArticleListAutoWidth() {
		// 最长70个字母
		// 中文16个
		if (this.articleListMaxWidth == 0) {
			let tempWidth = 0;
			for (const span of document.querySelectorAll('.article-list li span+span')) {
				let spanContentCount = span.textContent.length;
				let zhWords = span.textContent.match(/[\u0391-\uFFE5]/g);
				if (zhWords) {
					tempWidth = (zhWords.length * 20 + (spanContentCount - zhWords.length) * 10)
				} else {
					tempWidth = span.textContent.length * 10;
				}
				// console.log(this.articleListMaxWidth)
				if (tempWidth > this.articleListMaxWidth) {
					this.articleListMaxWidth = tempWidth < 200 ? 200 : tempWidth;
				}
				// console.log(this.articleListMaxWidth)
			}
		}
	}
	static getArticleListDefaultWidth() {
		if (top.settings['article-list']['list-width']) {
			this.articleListMaxWidth = top.settings['article-list']['list-width'];
		} else {
			this.getArticleListAutoWidth();
		}
	}
}


/**
 *
 * @param {HTMLDivElement} pageEle
 * @param {Boolean} isHiddenArticle
 */
export function navShowOrArticleShow(pageEle, isHiddenArticle) {

	// load nav-icon
	let canHiddenNavIconEle = pageEle.querySelectorAll('.top-list li:not([readonly])');
	if (canHiddenNavIconEle) {
		canHiddenNavIconEle.forEach(v => {


			if (!top.settings["nav-icon"][v.id]) {
				v.style.display = 'none';
			}
			else {
				v.removeAttribute('style');
				////	console.log('.article-system-list li[nav-id="' + v.id + '"]')

			}
		})
	} else console.error('canHiddenNavIconEle is null')

	// load article lists

	let canHiddenArticleEle = pageEle.querySelectorAll('.article-system-list li');
	if (canHiddenArticleEle) {
		canHiddenArticleEle.forEach(v => {
			if (top.settings["nav-icon"][v.getAttribute('nav-id')] && isHiddenArticle) {
				v.style.display = 'none';
			}
			else {
				v.removeAttribute('style');
			}
		})
	} else console.error('canHiddenArticleEle is null')
}


export class ArticleListCurrrentActive {
	/** 当前显示的article
	 * @type {HTMLDivElement} */
	static ActiveEle;
	/**
	 * 改变focus的显示
	 * @param {HTMLDivElement} preFocusEle
	 */
	static changeActiveClass(preFocusEle, className = 'active-article') {

		if (this.ActiveEle) {
			this.ActiveEle.classList.remove(className);
		}
		this.ActiveEle = preFocusEle;
		preFocusEle.classList.add(className);

	}
	/**
	 * 添加article分类的标签点击事件
	 * @param {NodeListOf<HTMLDivElement>} articleListALLLi
	 */
	static addClickListening(articleListALLLi) {
		if (articleListALLLi.length > 0) {
			articleListALLLi.forEach(v => {	/**@type {typeof top.dataId} */
				let systemNavId = v.parentElement.getAttribute('nav-id');
				// /**@type {NodeListOf <HTMLDivElement>} */
				// let navIconEle = pageEle.querySelectorAll('.top-list li[id="'+systemNavId+'"]:not([readonly])');
				v.oncontextmenu = function (ev) {
					ev.preventDefault();
					// 设置CONTEXTMENU
				}
				v.onclick = function (ev) {
					if (v != ArticleListCurrrentActive.ActiveEle) {
						if (top.titleBar.goback.style.visibility == 'hidden') {
							top.titleBar.goback.style.visibility = 'visible';
						}
						showWaitDot();
						if (ArticleListCurrrentActive.ActiveEle)
							top.historyArticle.push(ArticleListCurrrentActive.ActiveEle);
						ArticleListCurrrentActive.changeActiveClass(v, 'active-article');
						if (systemNavId) {
							top.iframeContainer.src = createUrlString(systemNavId);

						} else {
							let query = {};
							v.getAttributeNames().forEach(attr => {
								query[attr] = v.getAttribute(attr);
							})

							top.iframeContainer.src = createUrlString('content', query);
						}
					}
					// top.iframeContainer.src = `../../html/pages/${v.getAttribute('data-id')}.html`;
				}
			});

			let canHiddenNavIconEle = top.document.querySelectorAll('.top-list li:not([readonly])');
			if (canHiddenNavIconEle) {
				canHiddenNavIconEle.forEach(v => {
					v.onclick = e => top.document.querySelector('.article-system-list li[nav-id="' + v.id + '"]>div')?.click();
				});
			}
		}
	};
}
export function showMaxIframe() {
	setTimeout(() => {
		top.maxWindowIframeBackground.style.display = 'block';
		// top.maxWindowIframe.style.opacity = '0.1';
		top.titleBar.goback.style.visibility = 'visible';
		// console.log(top.historyCount)
	}, 100);
	top.titleBar.goback.classList.add('goback-max');
	top.historyMaxIframeCount++;
}


/**
 *
 * @param {HTMLDivElement} resizeBar
 */
export function onResizeArticleList(resizeBar) {
	let articleList = top.document.getElementById('article-lists');
	// if (!minWidth) minWidth = top.articleListMinWidth;
	resizeBar.onmousedown = e => {
		resizeBar.style.width = '90%';
		resizeBar.style.left = '50px';
		articleList.style.transition = 'none'
		resizeBar.onmousemove = e => {
			if (e.buttons === 0) {
				console.log(e.buttons)
				resizeBar.onmouseup();
				return;
			}
			let maxWidth = parseInt(getComputedStyle(document.body).width.replace('px').trim()) / top.articleListMaxShrink;

			let minWidth = 200;
			// maxWidth = maxWidth < minWidth ? minWidth : maxWidth;
			// console.log(e.clientX)
			// between minWidth and maxWidth
			if ((e.clientX - 50 - minWidth) >= 0 && (e.clientX - 50 - maxWidth) <= 0) {
				let width = (e.clientX - 50);
				articleList.style.width = `${width}px`
			}
			else {
				if (e.clientX < minWidth + 50) {
					articleList.style.width = minWidth + 'px';
				}
				if (e.clientX > maxWidth + 50) {
					articleList.style.width = maxWidth + 'px';
					// console.log(e.clientX)
				}
			}
		}
	}
	resizeBar.onmouseup = e => {
		resizeBar.style.removeProperty('width');
		resizeBar.style.removeProperty('left');
		articleList.style.removeProperty('transition');
		resizeBar.onmousemove = undefined;
	}
}


/**
 *
 * @param {HTMLUListElement} articleUserList
 */
export function onSerialArticleLi() {
	let articleUserList = document.getElementById('article-user-list');
	let serialAttr = 'data-serial';
	/**@type {HTMLDivElement} */
	let articleDragged;
	/**@type {HTMLDivElement} */
	let articleEnterLast;
	let initial = true;
	let lastLeave;
	/* events fired on the draggable target */
	// document.ondrag = function (event) {
	// 	// console.log(event.clientX)
	// }

	articleUserList.ondragstart = function (event) {
		// store a ref. on the articleDragged elem
		articleDragged = event.target;
		articleEnterLast = articleDragged.parentElement;
		// make it half transparent
		articleDragged.style.opacity = 0.05;
		// top.ipcRenderer.send('drag-start')

	}

	articleUserList.ondragend = function (event) {
		// reset the transparency
		articleDragged.setAttribute(serialAttr, articleDragged.parentElement.getAttribute(serialAttr));
		articleDragged.removeAttribute('style');
		articleDragged = null;
		articleEnterLast = null;
		// articleEnterLast.appendChild(articleDragged);
	}

	/* events fired on the drop targets */
	articleUserList.ondragover = function (event) {
		// prevent default to allow drop
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	articleUserList.ondragenter = function (e) {
		e.preventDefault();
		if (!articleDragged) return;
		// highlight potential drop target when the draggable element enters it
		/**@type {HTMLDivElement} */
		let enter;
		if (initial) {
			initial = false; return;
		}
		// debugger
		if (e.target.parentElement.className == "dropzone") {
			enter = e.target.parentElement;
			// if (lastLeave != enter) {
			// 	lastLeave.style.background = "";
			// }
			// enter.style.background = "purple";
			if (enter == articleEnterLast) return;
			// enterChild.style.visibility = 'hidden';
			let enterSerial = parseInt(enter.getAttribute('data-serial'));
			let draggedSerial = parseInt(articleEnterLast.getAttribute('data-serial'));
			/**@type {HTMLDivElement[]} */
			let allSerialEles = document.querySelectorAll('.dropzone')
			if (enterSerial < draggedSerial) {
				// 上移

				async function serialTime(number) {
					let last = allSerialEles[number - 1].children[0];
					let current = allSerialEles[number].children[0];
					// last.style.visibility = 'hidden';
					// await sleep(100)

					current?.remove();
					allSerialEles[number].appendChild(last);
					last.setAttribute(serialAttr, allSerialEles[number].getAttribute(serialAttr));
					// last.removeAttribute('style');
					if (--number > enterSerial - 1) {
						serialTime(number);
					}
				}
				serialTime(draggedSerial - 1);
			} else {

				async function serialTime(number) {
					let last = allSerialEles[number + 1].children[0];
					let current = allSerialEles[number].children[0];
					// last.style.visibility = 'hidden';

					// await sleep(100)

					// setTimeout( () => {
					current?.remove();
					allSerialEles[number].appendChild(last);
					last.setAttribute(serialAttr, allSerialEles[number].getAttribute(serialAttr));
					// last.removeAttribute('style');
					if (++number < enterSerial - 1) {
						serialTime(number);
					}
					// }, 400);
				}
				serialTime(draggedSerial - 1);
			}
			articleEnterLast = enter;
		}
	}

	articleUserList.ondragleave = function (event) {
		if (!articleDragged) return;
		// e.preventDefault();
		// reset background of potential drop target when the draggable element leaves it
		if (event.target.parentElement.className == "dropzone") {
			if (lastLeave != event.target.parentElement) {
				lastLeave = event.target.parentElement;
			}
			articleEnterLast.appendChild(articleDragged);
		}

	};

	articleUserList.ondrop = function (event) {
		// prevent default action (open as link for some elements)
		event.preventDefault();
		if (!articleDragged) return;
		// move articleDragged elem to the selected drop target
		if (event.target.parentElement.className == "dropzone") {
			event.target.parentElement.style.background = "";
			// articleDragged.parentNode.removeChild(articleDragged);
		}
	};

}
