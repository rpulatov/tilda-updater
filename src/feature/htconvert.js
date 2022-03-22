const fs = require('fs').promises

const matchCases = [
  [/;?\s*\n/gm, ';\n'],
  [/DirectoryIndex/gm, 'index'],
  [/ErrorDocument/gm, 'error_page'],
  [/RewriteEngine.*$/gm, ''],
  [
    /RewriteRule\s+\^?([A-Za-z\/\-0-9]+)\$?\s+(\S+)/gm,
    'location = /$1 {\n  rewrite ^(.*)$ /$2\n}\n',
  ],
]

function htconvert(text) {
  let result = text
  for (let expr of matchCases) {
    result = result.replace(expr[0], expr[1])
  }
  return result
}

module.exports = {
  htconvert,
}
