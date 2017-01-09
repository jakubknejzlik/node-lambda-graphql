'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const graphqlHTTP = require('express-graphql')

module.exports = (options) => {

  let app = express()

  app.use(graphqlHTTP(options))

  let server = awsServerlessExpress.createServer(app)

  process.on('exit',() => {
    server.close()
  })

  return (event, context) => {
    return awsServerlessExpress.proxy(server, event, context)
  }
}
