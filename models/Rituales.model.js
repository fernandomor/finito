const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const ritualSchema = new Schema({
  ritualName: {
    type:String
  },
  numInit:{
    type: Number,
    default : 0
  },
  numActual: {
    type: Number,
    default : 0
  },
  numMax:{
    type:Number
  },
  repSemana : {
    type: Number,
    default : 0
  },
  record: [{ type: Schema.Types.ObjectId, ref: 'record' }],
  dias:[{
    type:String,
    enum:["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]
  }]
})


module.exports = model("ritual",ritualSchema) 