const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.MONGODB_URI 

mongoose.set('strictQuery',false)

console.log('Connnecting to database ...')
mongoose.connect(url,{
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,        
    family: 4 
}).then(result=>console.log('connected to db'))
  .catch(err=>console.log('error connecting to db',err.message))

const personSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength:3,
        required:true
    },
    phoneNumber:{
        type:String,
        minLength:8,
        validate:{
            validator: function(v){
                return /^\d{2,3}-\d{5,}$/.test(v)
            },
             message:props => `${props.value} is not a valid phone number`
        }
    } 
})
personSchema.set('toJSON',{
    transform:(doc,obj)=>{
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports=mongoose.model('Person',personSchema)