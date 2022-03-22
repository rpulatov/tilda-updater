require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { updateSite } = require('./feature/tilda')
const { nginxReload } = require('./feature/nginx')

const dev = process.env.NODE_ENV !== 'production'
const app = express({ dev })

app.use(cors({ origin: '*', methods: ['GET'], allowedHeaders: '*' }))

app.get('/update', (req, res) => {
  console.info('incoming', req.query)

  updateSite(req.query)
    .then(() => console.info('Update successfully'))
    .then(() => nginxReload())
    .then(stdout => console.info('Nginx reloaded -> ', stdout))
    .catch(error => console.info('Error', error.message))

  res.send('ok')
})

app.get('*', function (req, res) {
  res.status(404).send('Not found')
})

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 3001

app.listen(port, host, err => {
  if (err) throw err
  console.info(`Ready on http://${host}:${port} ${process.env.NODE_ENV} mode`)
})
