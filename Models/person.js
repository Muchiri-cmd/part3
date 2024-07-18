const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.MONGODB_URI 

mongoose.set('strictQuery',false)
mongoose.connect(url,{
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,        
    family: 4 
}).then(result=>console.log('connected to db'))
  .catch(err=>console.log('error connecting to db',err.message))

const personSchema = new mongoose.Schema({name: String,phoneNumber: String})
personSchema.set('toJSON',{
    transform:(doc,obj)=>{
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports=mongoose.model('Person',personSchema)