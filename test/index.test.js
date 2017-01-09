'use strict'

const assert = require('assert')
const graphql = require('graphql')
const lambdaGraphql = require('../index')

const schema = graphql.buildSchema(`
  type Query {
    hello(foo: String): String
  }
`)

const root = { hello: (params) => 'Hello world! ' + (params.foo || '') }

const handler = lambdaGraphql({
  schema: schema,
  rootValue: root
})

describe('handler', () => {
  it('should handle get request',(done) => {
    let event = {
      "path": "/",
      "httpMethod": "GET",
      queryStringParameters: {
        query: encodeURIComponent('query ($blah: String){hello(foo:$blah)}'),
        variables: '{"blah":"test"}'
      }
    }
    handler(event,{
      succeed: (result) => {
        assert.equal(result.statusCode,200)
        let body = JSON.parse(result.body)
        assert.equal('Hello world! test', body.data.hello)
        done()
      },
      failed: done
    })
  })
})
