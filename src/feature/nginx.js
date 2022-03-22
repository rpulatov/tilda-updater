const path = require('path')
const { createFile } = require('./fileutils')

async function nginxReload(projectsPath) {
  const res = await createFile(path.join(projectsPath, 'nginx.reload'), 'Config updated')

  console.info('Task to restart nginx successfully created')

  return res
}

module.exports = {
  nginxReload,
}
