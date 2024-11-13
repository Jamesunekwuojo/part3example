// console.log('hello world')


// Created a simple web server, using the http module
const http = require('http')
const express = require('express')

const app = express()

// Express Middleware 
app.use(express.json()) // Without json web server  data will not be passes and req.body will be undefined 

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": "1"
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": "2"
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": "3"
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": "4"
  }
  ]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
  response.send('<h2>Hello world</h2>')
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})



app.post('/api/persons/:id', (req, res) => {
  const note = req.body
  console.log(note)
  res.json(note)
  

})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


