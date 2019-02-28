"use strict";

const assert = require("assert");
const graphql = require("graphql");
const lambdaGraphql = require("../index");

const schema = graphql.buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: function() {
    return "Hello world!";
  },
};

const app = lambdaGraphql({
  schema: schema,
  rootValue: root,
});

describe("handler", () => {
  it("should handle get request", done => {
    let event = {
      path: "/",
      httpMethod: "GET",
      queryStringParameters: {
        query: "{hello}",
      },
    };
    app.handler(event, {
      succeed: result => {
        assert.equal(result.statusCode, 200);
        let body = JSON.parse(result.body);
        assert.equal("Hello world!", body.data.hello);
        done();
        app.close();
      },
      failed: done,
    });
  });
});
