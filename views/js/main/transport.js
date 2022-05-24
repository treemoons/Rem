
export function savingParagraph(content) {
	if (top.settings['regular-settings']['draft-saving']) {
		top.ipcRenderer.send('save-paragraph', content);
	}
}
