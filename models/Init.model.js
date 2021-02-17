const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const initialRitualSchema = new Schema({
  nombreRitual: String,
  img: String ,
  pregunta:String
})


module.exports = model("init",initialRitualSchema) 