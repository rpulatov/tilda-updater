require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { TildaClient } = require('tilda-client')

const dev = process.env.NODE_ENV !== 'production'
const app = express({ dev })

app.use(cors({ origin: '*', methods: ['GET'], allowedHeaders: '*' }))

app.get('/tilda/update', (req, res) => {
  async function update() {


console.info(req.params)


    const tilda = new TildaClient(process.env.TILDA_PUBLIC_KEY, process.env.TILDA_SECRET_KEY)

    const projects = await tilda.getProjectsList()
    console.log(`${projects.length} projects have been loaded.`)

    for (const p of projects) {
      const project = await tilda.getProject(p.id)
      console.log(`${project.title} project has been loaded.`)

      const pages = await tilda.getPagesList(p.id)
      console.log(`${pages.length} pages have been loaded.`)

      for (const pg of pages) {
        const page = await tilda.getPage(pg.id)
        console.log(`${page.title} page has been loaded.`)
      }
    }
  }
  update()
  res.send('ok')
})

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 3001

app.listen(port, host, err => {
  if (err) throw err
  console.info(`Ready on http://${host}:${port} ${process.env.NODE_ENV} mode`)
})
