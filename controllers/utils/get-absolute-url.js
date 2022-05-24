module.exports = (urlstr, typeOfurl = 'URL') => {
	let url=
	(/:(\\|\/)[^\\\/]/g.test(urlstr)
		? new URL('file://' + urlstr.replace(/\\/g, '/'))
			: new URL(urlstr, 'file://' + __filename));
	switch (typeOfurl) {
		case 'URL':
			return url;
		case 'string':
			return url.href.replace(/^[^\:]+\:(\\\\\\|\/\/\/)/, '');
		default:
			throw TypeError(`Enum of typeOfURL must be 'URL' or 'string'`);
	}
}
