const express = require('express');
const router  = express.Router();
const User = require('../models/User.model.js')
const Rituales = require('../models/Rituales.model.js')
const Record = require('../models/Record.model.js')
const InitRitu = require('../models/Init.model.js')
const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]

function formatAMPM(d) {

    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am'    
    return hours+':'+minutes+ampm;
}



router.get("/select-rituals" , async (req,res,next)=>{
  const {interes , _id} = req.session.currentUser
  const ritualesSelect = await InitRitu.find({nombreRitual:{ $in : interes}})
  const validacion = await User.find({_id})
  console.log(validacion)
  res.render("rituales/select-rituales",{ritualesSelect} )
})


router.post("/select-rituals" , async (req,res,next)=>{
  const {interes , _id} = req.session.currentUser
  const ritualesSelect = await InitRitu.find({nombreRitual:{ $in : interes}})
  const validacion = await User.find({_id})
  const valRitual = validacion[0].rituales
  console.log(valRitual)
  if(valRitual != 0){
    res.redirect("/daily")
  }else{
    res.render("rituales/select-rituales" ,{
      errorMessage :"Selecciona almenos uno",
      ritualesSelect
   })
  }
  // aqui hay un error cuando vuelver a seleccionar un ritual - no se sobreescribe, se hace uno nuevo y traera problemas
  //hay que prohibir que pueda volver a picarle o hacer una validación de editar :(
  res.render("rituales/select-rituales",{ritualesSelect} )
})


router.get("/daily" , async (req,res,next)=>{
  let today = new Date()
  let indiceDia = today.getDay()
  
  const {name , email} = req.session.currentUser
  console.log("en daily",req.session.currentUser)
  const userDB = await User.find({email}).populate("rituales")
  const ritualesIdDb = userDB[0].rituales //los rituales relacionados al user
  let arrayFiltrado = []
  ritualesIdDb.forEach(e=>{
    if(e.dias.includes(dias[indiceDia])){
      arrayFiltrado.push(e)
    }
  })
  
  console.log("aqui las pruebas",arrayFiltrado)
  if(!req.session.currentUser){
    res.redirect("/login")
  }else{ 
    res.render("rituales/retos-diarios",{name,arrayFiltrado})
  }
  //si el arrayFiltrado esta vacio poner que es dia de descanso 
})


router.get("/newRitual/:name" , async (req,res,next)=>{
  const nombre = req.params.name
  const match = await InitRitu.find({nombreRitual:nombre})  
  const objMatch = match[0]
  console.log(objMatch)
  res.render("rituales/individual-ritual" , { objMatch , dias })
})

router.post("/newRitual/:name" , async (req,res,next)=>{
  const nombre = req.params.name
  const {dias , valorNum} = req.body
  const {_id } = req.session.currentUser
  try{
    let newRitualDB = await Rituales.create({
    ritualName:nombre,
    numMax: valorNum,
    dias,
    })
    const postNewRitual = await User.findByIdAndUpdate(_id,{$push: {rituales: newRitualDB.id}})
    console.log("lo que imprime", postNewRitual)
    res.redirect("/select-rituals")
  }catch(error){
    console.log(error)
  }  
})

router.get("/editar/:id" ,(req,res,next)=>{
  res.send("falta aqui ver que onda")
})

router.get("/iniciar/:id" ,async (req,res,next)=>{
  
  let today = new Date()
  try{
    const idRitual = req.params.id
    const idRitualDB = await Rituales.find({_id:idRitual})
    // const acceder = idRitualDB[0]
    const horaInit = await Record.create({dateInit:today})
    
    console.log(acceder)
    let hora = formatAMPM(horaInit.dateInit)
    console.log(hora)
    // res.render("rituales/iniciar-ritual",{acceder,hora})
  }catch(error){
    console.log(error)
  }
//solo puuedes enviar una vez la hora
  
})



module.exports = router;