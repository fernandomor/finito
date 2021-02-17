const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const fraseSchema = new Schema({
  frase:String,
  autor:String
})


module.exports = model("frase",fraseSchema) 