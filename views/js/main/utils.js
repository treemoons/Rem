
/**
 *
 *@param { { url: string, success: (text:string)=>void),
		failed ?: (text:string)=>void,
		data ?: string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array>,
		responseType:'text'|'blob'|'arrayBuffer'|'document'|'json',
		local:boolean,
		method ?: 'POST'|'GET'|'DELETE'|'PUT'|'OPTIONS'|'TRACE',
			httpheader ?:{"Content-Type"?:['application/x-www-form-urlencoded'|
			'multipart/form-data'|'text/plain'|
			'audio/mpeg'|'video/mpeg'|'image/pipeg'|
			'image/jpeg'|'image/x-icon']|'application/x-www-form-urlencoded'|
			'multipart/form-data'|'text/plain'|
			'audio/mpeg'|'video/mpeg'|'image/pipeg'|
			'image/jpeg'|'image/x-icon',"Set-Cookie"?:string},
		ajaxOtherEvent:(ajax:XMLHttpRequest)=>void } object  options
 */
export async function getAjaxData({
	url,
	success,
	failed = error => {
		console.log(`error of failed data : ${error}`);
	},
	local = false,
	data = '',
	responseType = '',
	method = 'POST',
	httpheader = { 'Content-Type': 'application/x-www-form-urlencoded' },
	ajaxOtherEvent = undefined
}) {
	// open(url,'_blank')
	var ajax = new XMLHttpRequest();
	if (local)
		url = require('path').resolve(__dirname, url);
	ajax.open(method, url);
	for (let key in httpheader) {
		if ((typeof httpheader[key]) == 'string')
			ajax.setRequestHeader(key, httpheader[key]);
		else {
			try {
				let values = '';
				httpheader[key].forEach(value => {
					values += value + ';';
				});
				values = values.substr(0, values.length - 1);
				ajax.setRequestHeader(key, values);
			} catch { console.error('err:isn`t array') }
		}
	}
	if (ajaxOtherEvent)
		ajaxOtherEvent(ajax);
	ajax.responseType = responseType;
	if ('onload' in ajax) {
		ajax.onload = function () {
			if (ajax.status == 200) {
				success(ajax.response);
			} else {
				failed(ajax.response);
			}
		}
	} else {
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if (ajax.status == 200) {
					success(ajax.response);
				} else {
					failed(ajax.response);
				}
			}
		}
	}
	ajax.send(data);
}

/**
 * 在指定格式(?)[key]=[value][splitMark]中，根据key找到value值，若没找到，返回空
 * @param {string} name search keywords
 * @param {string} purposeString results pool
 * @param {'&'|';'} splitMark
 */
export async function getQueryString(name, purposeString, splitMark = '&') {
	let reg = RegExp(`(?:${splitMark}|\\?|^)${name}=([^${splitMark}]*)`);
	reg.test(purposeString)
	return RegExp.$1;
}

/**
 *
 * @param {string} name
 * @param {string} value
 * @param {{year:number, month:number, day:number, hour:number,minutes:number,seconds:number, milliseconds:number }} param2 date default now (all values is '0')
 * @param {string} path
 * @param {true|false} httponly
 */
export async function buildCookie(name, value,
	{ year = 0, month = 0, day = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {},
	path = undefined, httponly = false) {
	let date;
	if (arguments[2]) {
		date = await getSpanDate({ year: year, month: month, day: day, hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds });
	}
	let cookie = `${name}=${value};${(arguments[2] ? `expires=${date.toUTCString()};` : '')}${(path ? `path = ${path};` : '')}${(httponly ? 'httponly' : '')}`;

	return encodeURI(cookie);
}

/**
 * date default now (all values are '0')
 * @param {{ year:number, month:number, day:number,hours:number , minutes:number,seconds:number, milliseconds:number }}
 */
export async function getSpanDate(
	{ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {}) {
	let date = new Date();
	if (years)
		date.setFullYear(date.getFullYear() + years);
	if (months)
		date.setMonth(date.getMonth() + months);
	if (days)
		date.setDate(date.getDate() + days);
	if (hours)
		date.setHours(date.getHours() + hours);
	if (minutes)
		date.setMinutes(date.getMinutes() + minutes);
	if (seconds)
		date.setSeconds(date.getSeconds() + seconds);
	if (milliseconds)
		date.setMilliseconds(date.getMilliseconds() + milliseconds);
	return date;
}

/**
 *
 * @param {{key:'value'}} obj
 * @param {'&'|';'} splitMark default '&'
 * @returns 类似‘key1=value1&key2=value2&...&keyn=valuen’
 */
export function transformToQueryStringFromObject(obj, splitMark = '&') {
	let result = '';
	for (let name in obj) {
		if (obj[name].includes('&')) console.error(`${name},value includes '&'`);
		result += name + '=' + obj[name] + splitMark;
	}
	return result.slice(0, result.length - 1);
}

/**
 *
 * @param {string} queryString
 * @param {'&'|';'} splitMark
 */
export function transformToObejctFromQueryString(queryString, splitMark = '&') {
	let obj = {};
	queryString.split(splitMark).forEach(query => {
		if (query != '') {
			let indexEqual = query.indexOf('=');
			obj[query.substr(0, indexEqual)] = query.substr(indexEqual + 1);
		}
	})
	return obj;
}

/**
 *
 * @param {'account'|'settings'|'search'|'new-article'|'planed'|'draft'|'email'|'starred'|'today'|'archive'|'content'}  hostname
 * @param {{key:string}} queryString
 * @returns {string}  ../../html/pages/${hostname}.html
 */
export function createUrlString(hostname, queryString) {
	return `../../html/pages/${hostname}.html?${(queryString == undefined ? '' : transformToQueryStringFromObject(queryString))}`;

}
/**
 * Convert color (rgb=>hex)
 * @param {string} RGBColor
 */
export function convertRGBColorToHex(RGBColor) {
	RGBColor = RGBColor.replace(/ /g, '')
	if (RGBColor.includes('rgb')) {
		let rr = Number.parseInt(RGBColor.match(/(?<=\()\d+/, RegExp.$1)[0]).toString(16);
		let gg = Number.parseInt(RGBColor.match(/(?<=\,)\d+(?=\,)/, RegExp.$1)[0]).toString(16);
		let bb = Number.parseInt(RGBColor.match(/(?<=\,)\d+(?=\))/, RegExp.$1)[0]).toString(16);
		let colorArr = [rr, gg, bb];
		colorArr.forEach((v, i, arr) => {
			if (v.length < 2) {
				arr[i] = "0" + v;
			}
		});
		let [r, g, b] = colorArr;
		return '#' + r + g + b;
	} else if (RGBColor.startsWith('#')) return RGBColor;
	else throw TypeError('不是rgb格式')
}
/**
 * must be async function
 * @param {number} timeout ms
 * @returns
 */
export function  sleep (timeout) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res()
		}, timeout);
	})
}