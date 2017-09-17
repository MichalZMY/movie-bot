const recastai = require('recastai').default

const config = require('./config')

const client = new recastai(config.REQUEST_TOKEN)

module.exports = client
