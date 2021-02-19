const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const recordSchema = new Schema({
  dateInit:{
    type : Date,
  },
  dateFinal:{
    type : Date,
  },
  tiempoUsado:{
    type:String,
  }
})


module.exports = model("record",recordSchema) 