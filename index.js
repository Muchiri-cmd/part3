const express = require('express')
const app = express()

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

app.use(express.json())//json-parser

morgan.token('postData',function(req,res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phoneNumber": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phoneNumber": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phoneNumber": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phoneNumber": "39-23-6423122"
    }
]

const generateId = () => {
    return String(Math.round(Math.random()* 10000))
}
app.get('/',(req,res)=> {
    res.send('<h1>PhoneBook App</h1>')
})

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    const entries = persons.length
    const datetime = new Date()
    res.send(`
            <p>Phonebook has info for ${entries} people</p><br>
            ${datetime}
        `)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    person = persons.find(person => person.id == id)
    if (person){
        console.log("person",person);
        res.json(person)
    } else {
        res.status(404).end()
    }
  
})

app.post('/api/persons',(req,res)=>{
    const body = req.body
    if (!body.name){
        return res.status(400).json({error:'Name is missing'})
    } else if (!body.phoneNumber){
        return res.status(400).json({error:'phoneNumber is missing'})
    } else if (persons.find(person=> person.name == body.name)){
        return res.status(400).json({error:'name must be unique'})
    }
    const person = {
        id:generateId(),
        name:body.name,
        phoneNumber:body.phoneNumber
    }
    persons = persons.concat(person)
    // console.log(person);
    res.json(person)

})

app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    persons = persons.filter(person=> person.id!=id )
    res.status(204).end()
})


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})
