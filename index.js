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
        // console.log('phonebook:');
        // persons.forEach(person=>console.log(`${person.name} - ${person.phoneNumber}`))
    })
})

app.get('/info', async (req, res) => {
    try {
        const count = await Person.countDocuments({});
        const datetime = new Date();
        res.send(`
            <p>Phonebook has info for ${count} people</p><br>
            ${datetime}
        `);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
});

app.get('/api/persons/:id',(req,res)=>{
    Person.findById(req.params.id).then(person=>res.json(person))
  
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
app.put('/api/persons/:id', (req, res) => {
    const id  = req.params.id;
    const updatedPerson = req.body;
    Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    res.json(updatedPerson); 
});

app.delete('/api/persons/:id', async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting person:', error);
    }
});

const PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})
