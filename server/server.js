const PORT = process.env.PORT || 3000
const Koa = require('koa')
const getPageContent = require('./contentUpdate')

const app = new Koa()

app.use(async ctx => ctx.body = getPageContent())

app.listen(PORT, () => console.log(`Server started at port ${ PORT }`))