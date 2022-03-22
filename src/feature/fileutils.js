const https = require('https')
const fs = require('fs')

async function createIfNotExist(path) {
  return fs.promises
    .access(path)
    .then(() => true)
    .catch(e => fs.promises.mkdir(path, { recursive: true }))
}

async function createFile(path, content) {
  return fs.promises.writeFile(path, content)
}

async function createFileFromUrl(path, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path)

    https
      .get(url, function (response) {
        response.pipe(file)
        file.on('finish', function () {
          file.close(resolve)
        })
      })
      .on('error', function (err) {
        // Handle errors
        fs.unlink(path)
        reject(err)
      })
  })
}

module.exports = {
  createIfNotExist,
  createFile,
  createFileFromUrl,
}
