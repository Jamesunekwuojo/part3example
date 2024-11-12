// console.log('hello world')


// Created a simple web server, using the http module
const http = require('http')
const express = require('express')

const app = express()


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(notes))
// })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.get('/', (request, response) => {
  response.send('<h2>Hello world</h2>')
})