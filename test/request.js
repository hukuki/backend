const supertest = require("supertest");
const defaults = require('superagent-defaults');

const app = require("../src/app");
const request = defaults(supertest(app));

module.exports = request;