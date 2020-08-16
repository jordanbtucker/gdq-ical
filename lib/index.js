const app = require('./app')

app().catch(err => {
  console.error(err)
  process.exitCode = 1
})
