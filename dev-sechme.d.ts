
//#region 自定义添加系统内置原型变量
interface Window {
	readonly electron: typeof Electron;
	/** transform to web with Ajax */
	readonly ipcRenderer: Electron.IpcRenderer;
	/** document.HTMLElemnt of nav-icon */
	readonly nav: {
		articleListIcon: HTMLDivElement,
		newArticle: HTMLDivElement,
		search: {
			icon: HTMLDivElement,
			input: HTMLInputElement
		},
		today: HTMLDivElement,
		starred: HTMLDivElement,
		email: HTMLDivElement,
		planed: HTMLDivElement,
		draft: HTMLDivElement,
		archive: HTMLDivElement
		synchronize: HTMLDivElement,
		settings: HTMLDivElement,
	}
	readonly dataId: 'today' | 'starred' | 'email' | 'planed' | 'draft' | 'archive'
	readonly titleBar: {
		goback: HTMLDivElement,
		minWindow: HTMLDivElement,
		maxWindow: HTMLDivElement,
		closeWindow: HTMLDivElement
	}
	/**记录max-iframe中的history条数，用于最后退出max-iframe时做判断 */
	historyMaxIframeCount: number;
	/**用于article-list中focus背景以及列表的iframe-container的focus记录。 */
	historyArticle: HTMLDivElement[];
	readonly article: {

	}
	readonly theme: "light" | "dark"
	/** configurantion of settings */
	readonly settings: {
		"theme-settings": {
			"theme": "light" | "dark" | "auto",
			"default-background-img": "e:/treemoons/Pictures/Saved Pictures/OIP.jpg",
			"default-background-user-added": [
				"e:/treemoons/Pictures/Saved Pictures/OIP.jpg",
				"e:/treemoons/Pictures/Saved Pictures/psc.jpg"
			],
			"article-background": {
				"article1-id": "rgb(0,0,0,150)",
				"article2-id": "rgb(0,0,0,150)"
			}
		},
		"nav-icon": {
			"today": false,
			"archive": false,
			"starred": true,
			"email": true,
			"planed": false,
			"draft": false
		},
		"regular-settings": {
			"language": "zh-cn",
			"add-top": true,
			"delete-warning": true,
			"draft-saving": true,
			"overtiming-warning": true,
			"hidden-shown-acticle": true,
			"overtiming-color-records": {
				"light": {
					"overtiming-color": "rbg(255,255,255)",
					"overtiming-color-record": []
				},
				"dark": {
					"overtiming-color": "rbg(255,255,255)",
					"overtiming-color-record": []
				}
			},
			"auto-recycle-paragraph": false
		},
		"tray-settings": {
			"background-running": false
		},
		"article-list": {
			"list-width": number
		}
	}
	/**记录添加的OnListening，用于判断已经添加的cannel不再重复 */
	ipcRendererOnListenings: string[]
	/** 背景图element */
	readonly backgroundImgEle: HTMLImageElement;
	readonly languages: { 'us': {}, 'zh-cn': {} };
	/** 全屏的iframe，除了title-bar 其他都会被覆盖 */
	readonly maxWindowIframe: HTMLIFrameElement;
	/** 全屏的iframe 背景DIV */
	readonly maxWindowIframeBackground: HTMLDivElement;
	/** 右侧的内容iframe，用户选择article-list内容时src="../pages/content.html?[queryString]",queryString参数通常有[page=[]] */
	readonly iframeContainer: HTMLIFrameElement;
	readonly resizeArticleListEle: HTMLDivElement;
	readonly articleListMaxShrink: number;
}
declare namespace Electron {

	interface IpcRenderer {

		/**
			 * Listens to `channel`, when a new message arrives `listener` would be called with
			 * `listener(event, args...)`.
			 */
		topOn(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer;

	}
}
interface Date {
	formatDate(frm: 'yyyy-MM-dd HH:mm:ss.f' | 'yyyy/MM/dd HH:mm:ss.f' | 'yyyyMMddHHmmssf' | 'yyyy年MM月dd日 HH时mm分ss秒f毫秒'): string
}
interface String {

	/**
	 * To get an aboluste path from relavite path
	 */
	toPath(__dirname: string): string;
}
	//#endregion
//#region 自定义添加用户变量

//#endregion