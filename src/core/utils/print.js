'use strict'
export function printImage(url) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const defaultOptions = Object.assign(
    {
      name: '_blank',
      specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
      replace: true,
      styles: [],
    },
    options
  )

  let name = defaultOptions.name,
    specs = defaultOptions.specs

  specs = specs.length > 0 ? specs.join(',') : ''

  let html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Document</title>
			</head>
			<body>
				<img style="width:100%" src="${url}">
			</body>
		</html>
	`

  let win = window.open('', name, specs)
  win.document.write(html)

  const img = new Image()
  img.src = url
  img.onload = function() {
    setTimeout(function() {
      win.document.close()
      win.focus()
      win.print()
      win.close()
    }, 100)
  }
}
