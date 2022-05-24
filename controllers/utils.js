

/**
 *
 * @param {string} str
 * @param {boolean} whiteSpace
 * @returns {string}
 */
exports.removeJsonComment = (str, whiteSpace) => require('./utils/remove-json-comment')(str, whiteSpace);
/**
 *
 * @param {string} urlString
 * @param {'URL'|'string'} typeOfURL
 * @returns URL
 */
exports.getFileAbsoluteURL = (urlString, typeOfURL) => require('./utils/get-absolute-url')(urlString, typeOfURL)
/**
 *
 * @param {number} timeout
 * @returns Promise
 */
exports.sleep = (timeout) => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res()
		}, timeout);
	})
}

/**
 * date default now (all values are '0')
 * @param {{ year:number, month:number, day:number,hours:number , minutes:number,seconds:number, milliseconds:number }}
 */
exports.getSpanDate = (
	{ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {}) => {
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

// console.log(utils.getFileAbsoluteURL('d:/treemoons/user/out/HelloWorld-win32-x64/vulkan-1.dll'))
