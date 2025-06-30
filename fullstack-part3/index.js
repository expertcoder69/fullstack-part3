const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use((req, res, next) => {req.method === 'POST' ? morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next) : morgan('tiny')(req, res, next)
})

/*let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    console.log(persons);
    response.json(persons);
})

app.get('/info', (request, response) => {
    let count = persons.length
    console.log(count);
    const now = new Date();
    const date = now.toString()
    response.send(`<p>Phonebook has info for ${count} people <br /> ${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        console.log(person);
        response.json(person);
    }
    else {
        console.log("error");
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const find = persons.find(person => person.id === id)

    if (find) {
        persons = persons.filter(person => person.id !== id)
        console.log(persons);
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
})

const generateId = () => {
    let newId;
    do {
        newId = String(Math.floor(Math.random() * 10000));
    } while (persons.some(person => person.id === newId));
    return newId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body);

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if(persons.some(person=>person.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique !'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.status(201).json(person)
})*/

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    if (persons) {
      response.json(persons)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const { name, number } = request.body

  Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      }
      else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const now = new Date()
    response.send(`Phonebook has info for ${count} people. \n${now}`)
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})