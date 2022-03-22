const { exec } = require('child_process')

function nginxReload() {
  return new Promise((resolve, reject) => {
    exec('sudo systemctl reload nginx', (error, stdout, stderr) => {
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
