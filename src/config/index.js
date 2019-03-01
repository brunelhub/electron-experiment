/**
 * Each component should have a dedicated configuration file
 */
'use strict'

const common = require('./common')
const logger = require('./logger')
const api = require('./api')
const renderer = require('./renderer')

module.exports = Object.assign({}, common, logger, api, renderer)