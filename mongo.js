const mongoose = require('mongoose')

if (process.argv.length<5) {
    console.log('Please provide enough argument\neg. node mongo.js <yourpassword> "John Doe" 12345-67')
    process.exit(1)
}
const [password, new_name, new_phoneNumber] = [process.argv[2], process.argv[3], process.argv[4]];

const url = `mongodb+srv://davismuchiri21:${password}@cluster1.om7qdwb.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster1`

mongoose.set('strictQuery',false)
mongoose.connect(url,{
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,        
    family: 4 
})

const personSchema = new mongoose.Schema({name: String,phoneNumber: String})
const Person = mongoose.model('Person',personSchema)
const record = new Person({name:new_name,phoneNumber:new_phoneNumber})

record.save().then(console.log(`added ${new_name} number ${new_phoneNumber} to phonebook\n`))

Person.find({})//all people records
    .then(persons=>{
        console.log('phonebook:');
        persons.forEach(person=>console.log(`${person.name} - ${person.phoneNumber}`))
        mongoose.connection.close()
    })