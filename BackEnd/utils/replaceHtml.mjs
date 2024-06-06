export const replaceHtml = function (html, arr) {
	arr.forEach((v) => {
		html = html.replace(v[0], v[1])
	})

	return html
}
