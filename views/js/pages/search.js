import { getQueryString } from "../main/utils.js";
const searchKeyWords = await getQueryString('searching', decodeURI(location.search), '&');
const searchInput = document.getElementById('searching-words');
if (searchInput)
	searchInput.value = searchKeyWords;

top.ipcRenderer.send('searching-history', searchKeyWords);
top.ipcRenderer.topOn('searching-result', (event, args) => {
});
