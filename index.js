//express
const express = require('express')
const app = express()

// CORS middleware
const cors = require('cors')
app.use(cors())

//json-parser
app.use(express.json())

// Application Requests Logger - https://github.com/expressjs/morgan
const morgan = require('morgan')
app.use(morgan('tiny'))

morgan.token('postData',function(req,res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

// express middleware to serve static content
app.use(express.static('dist'))

let Person = require('./Models/person')

app.get('/',(req,res)=> {
    res.send('<h1>PhoneBook App</h1>')
})

app.get('/api/persons',(req,res)=>{
    Person.find({})
    .then(persons=>{
        res.json(persons)
    })
})

app.get('/info', async (req, res,next) => {
    try {
        const count = await Person.countDocuments({});
        const datetime = new Date();
        res.send(`
            <p>Phonebook has info for ${count} people</p><br>
            ${datetime}
        `);
    } catch (error) {
        next(error)
    }
});

app.get('/api/persons/:id',(req,res,next)=>{
    Person.findById(req.params.id)
        .then(person=>res.json(person))
        .catch(err=>next(err))
})

app.post('/api/persons',(req,res)=>{
    const body = req.body
    if (!body.name){
        return res.status(400).json({error:'Name is missing'})
    } else if (!body.phoneNumber){
        return res.status(400).json({error:'phoneNumber is missing'})
    } 
    // else if (Person.findOne({name:body.name})){
    //     return res.status(400).json({error:'name must be unique'})
    // }
    const person = new Person({
            name:body.name,
            phoneNumber:body.phoneNumber
        }) 
    person.save().then(savedPerson => {
        console.log(`
            added ${savedPerson.new_name} number ${savedPerson.phoneNumber} to phonebook\n`
        )
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res,next) => {
    const id  = req.params.id;
    const updatedPerson = req.body;
    Person.findByIdAndUpdate(id, updatedPerson, { new: true })
        .then(updatedPerson =>  res.json(updatedPerson))
        .catch(error => next(error))
});

app.delete('/api/persons/:id', async (req, res,next) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error)
    }
});

const errorHandler = (error,req,res,next) =>{
    console.log(error.message)

    if (error.name = 'CastError'){
        return res.status(400).send({ error: 'invalid id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})
