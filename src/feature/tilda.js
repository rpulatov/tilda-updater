const path = require('path')
const { TildaClient } = require('tilda-client')

const { createIfNotExist, createFile, createFileFromUrl } = require('./fileutils')
const { htconvert } = require('./htconvert')

async function updateSite(projectsPath, { pageid, projectid, publickey }) {
  const tilda = new TildaClient(publickey, process.env.TILDA_SECRET_KEY)

  const project = await tilda.getProjectExport(projectid)

  const CSS_PATH = project.export_csspath ? project.export_csspath : 'css'
  const JS_PATH = project.export_jspath ? project.export_jspath : 'js'
  const IMG_PATH = project.export_imgpath ? project.export_imgpath : 'images'
  const PROJECT_PATH = path.join(projectsPath, project.customdomain)

  await createIfNotExist(path.join(PROJECT_PATH, CSS_PATH))
  await createIfNotExist(path.join(PROJECT_PATH, JS_PATH))
  await createIfNotExist(path.join(PROJECT_PATH, IMG_PATH))

  for (let { from, to } of project.css) {
    await createFileFromUrl(path.join(PROJECT_PATH, CSS_PATH, to), from)
    console.info('updated -> ', path.join(CSS_PATH, to))
  }

  for (let { from, to } of project.js) {
    await createFileFromUrl(path.join(PROJECT_PATH, JS_PATH, to), from)
    console.info('updated -> ', path.join(JS_PATH, to))
  }

  for (let { from, to } of project.images) {
    await createFileFromUrl(path.join(PROJECT_PATH, IMG_PATH, to), from)
    console.info('updated -> ', path.join(IMG_PATH, to))
  }

  await createFile(path.join(PROJECT_PATH, '.htaccess'), project.htaccess)
  console.info('updated -> ', '.htaccess')

  await createFile(path.join(PROJECT_PATH, 'nginx-tilda.conf'), htconvert(project.htaccess))
  console.info('updated -> ', 'nginx-tilda.conf')

  // await createFileFromUrl(path.join(PROJECT_PATH, 'favicon.ico'), project.favicon)

  if (pageid) {
    const page = await tilda.getPageFullExport(pageid)
    console.log(`${page.title} page has been loaded.`)

    for (let { from, to } of page.css) {
      await createFileFromUrl(path.join(PROJECT_PATH, CSS_PATH, to), from)
      console.info('updated -> ', path.join(CSS_PATH, to))
    }

    for (let { from, to } of page.js) {
      await createFileFromUrl(path.join(PROJECT_PATH, JS_PATH, to), from)
      console.info('updated -> ', path.join(JS_PATH, to))
    }

    for (let { from, to } of page.images) {
      await createFileFromUrl(path.join(PROJECT_PATH, IMG_PATH, to), from)
      console.info('updated -> ', path.join(IMG_PATH, to))
    }

    await createFile(path.join(PROJECT_PATH, page.filename), page.html)
    console.info('updated -> ', page.filename)
  }
}

module.exports = {
  updateSite,
}
