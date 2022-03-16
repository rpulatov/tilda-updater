require('dotenv').config()

const https = require('https')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { TildaClient } = require('tilda-client')

const PROJECTS_PATH = path.join(__dirname, '../projects')

const dev = process.env.NODE_ENV !== 'production'
const app = express({ dev })

app.use(cors({ origin: '*', methods: ['GET'], allowedHeaders: '*' }))

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

app.get('/update', (req, res) => {
  console.info('incoming', req.query)

  async function update({ pageid, projectid, publickey }) {
    const tilda = new TildaClient(publickey, process.env.TILDA_SECRET_KEY)

    const project = await tilda.getProjectExport(projectid)

    const CSS_PATH = project.export_csspath ? project.export_csspath : 'css'
    const JS_PATH = project.export_jspath ? project.export_jspath : 'js'
    const IMG_PATH = project.export_imgpath ? project.export_imgpath : 'images'
    const PROJECT_PATH = path.join(PROJECTS_PATH, project.customdomain)

    await createIfNotExist(path.join(PROJECT_PATH, CSS_PATH))
    await createIfNotExist(path.join(PROJECT_PATH, JS_PATH))
    await createIfNotExist(path.join(PROJECT_PATH, IMG_PATH))

    for (let { from, to } of project.css) {
      await createFileFromUrl(path.join(PROJECT_PATH, CSS_PATH, to), from)
    }

    for (let { from, to } of project.js) {
      await createFileFromUrl(path.join(PROJECT_PATH, JS_PATH, to), from)
    }

    for (let { from, to } of project.images) {
      await createFileFromUrl(path.join(PROJECT_PATH, IMG_PATH, to), from)
    }

    await createFile(path.join(PROJECT_PATH, '.htaccess'), project.htaccess)

    // await createFileFromUrl(path.join(PROJECT_PATH, 'favicon.ico'), project.favicon)

    if (pageid) {
      const page = await tilda.getPageFullExport(pageid)
      console.log(`${page.title} page has been loaded.`)

      for (let { from, to } of page.css) {
        await createFileFromUrl(path.join(PROJECT_PATH, CSS_PATH, to), from)
      }

      for (let { from, to } of page.js) {
        await createFileFromUrl(path.join(PROJECT_PATH, JS_PATH, to), from)
      }

      for (let { from, to } of page.images) {
        await createFileFromUrl(path.join(PROJECT_PATH, IMG_PATH, to), from)
      }

      await createFile(path.join(PROJECT_PATH, page.filename), page.html)
    }

    console.info('Finish')
  }
  update(req.query).catch(e => {
    console.info('error', e.message)
  })

  res.send('ok')
})

app.get('*', function(req, res){
  console.log(req.originalUrl)
  res.send('Not found', 404);
});

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 3001

app.listen(port, host, err => {
  if (err) throw err
  console.info(`Ready on http://${host}:${port} ${process.env.NODE_ENV} mode`)
})
