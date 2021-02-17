const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const userSchema = new Schema({
name: {
    type: String,
    required: [true,"Password is required"]
},
edad: Number,
email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},
passwordHash:{
    type: String,
    required: [true,"Password is required"]
},
interes:[String],
rituales:[{ type: Schema.Types.ObjectId, ref: 'Rituales' }]
});

module.exports = model("user",userSchema) 