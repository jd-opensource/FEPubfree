const { Bootstrap } = require('@midwayjs/bootstrap')
const { createLogger } = require('@midwayjs/logger')
const WebFramework = require('@midwayjs/koa').Framework

const logger = createLogger('logger', {
  dir: process.env.LOG_DIR || __dirname + '/logs',
  fileLogName: 'pubfree-server.log',
})
const webFramework = new WebFramework().configure({
  port: process.env.PORT || 7001,
  logger: logger,
})

Bootstrap.load(webFramework).run()