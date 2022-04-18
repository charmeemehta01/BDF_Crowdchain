const express = require('express')
const cors = require('cors')
const next = require('next')
const mail = require('./routes/mail')    
const jwt = require('./routes/jwt')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
    
app.prepare()
.then(() => {
  const server = express()
  //allow cors
  server.use(cors())  
  // parse application/x-www-form-urlencoded
  server.use(express.urlencoded({ extended: true }));

// parse application/json
  server.use(express.json());
  server.get('*', (req, res) => {
    return handle(req, res)
  })
// Mail
  server.use('/mail', mail)
// JWT
  server.use('/jwt', jwt)
    
  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})