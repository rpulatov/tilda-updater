const shell = require('shelljs')
function nginxReload() {
  return new Promise((resolve, reject) => {
    shell.exec('sudo /usr/sbin/service nginx reload', (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      if (stderr) {
        return reject(new Error(`stderr: ${stderr}`))
      }
      resolve(stdout)
    })
  })
}

module.exports = {
  nginxReload,
}
