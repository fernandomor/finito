const express = require('express');
const router  = express.Router();
const User = require('../models/User.model.js')
const Rituales = require('../models/Rituales.model.js')
const Record = require('../models/Record.model.js')
const InitRitu = require('../models/Init.model.js');
const { format } = require('morgan');
const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]

function formatAMPM(d) {
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am'    
    return hours+':'+minutes+ampm;
}

function diaDelAno(fecha){
  let now = fecha
  let start = new Date(now.getFullYear(), 0, 0);
  let diff = now - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day
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
  //Tambien falta agregar nuevos rituales 
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
  const idRitual = req.params.id
  const obtenerRelacion = await Rituales.find({_id:idRitual}).populate("record")
  const recordsDelRitual = await obtenerRelacion[0].record
  const diaQueQuieroPublicar = diaDelAno(today)
  const loQuePublicoHoy = []
  const yFueALas = 0
  let deTiDepende = []
  const verSiPublica = obtenerRelacion.forEach(e=>{
    const dateInit = e.record
    dateInit.forEach(ed=>{
      if(diaDelAno(ed.dateInit)===diaQueQuieroPublicar){
        deTiDepende = false
        loQuePublicoHoy.push(ed)
      }else{
        deTiDepende = true
      }
    })
  })
  console.log(deTiDepende)

  if(!recordsDelRitual[0]||deTiDepende[0]){
    console.log("esta vacio y la consolola lo sabe")
    const horaInit = await Record.create({dateInit:today})
    const idRitualDB = await Rituales.findByIdAndUpdate(idRitual,{$push : {record:horaInit}})
    let hora = formatAMPM(horaInit.dateInit)
    console.log("se publico :", "la horaInit",horaInit,"la idRitualDB",idRitualDB,"la hora",hora)
    res.render("rituales/iniciar-ritual",{idRitualDB,hora})
  }else{
    const mientras = await Rituales.find({_id:idRitual})
    const {ritualName,numMax,numActual,_id} = mientras[0]
    let hora = formatAMPM(loQuePublicoHoy[0].dateInit)
    console.log("aun no",hora,ritualName,numMax,numActual)
    res.render("rituales/iniciar-ritual",{_id,ritualName,numMax,numActual,hora})
  }
    
    
    
//se puede optimizar si desde el principio traes de la base de datos la informacióon y guardas unicamente los que pertenezcan al dia de hoy , creo 
//solo puuedes enviar una vez la hora de inicio al día
  
})

router.post("/finalizar/:id", async (req,res,next)=>{
  let today = new Date()
  const id = req.params.id
  const ritual = await Rituales.find({_id:id}).populate("record")
  const hoy = diaDelAno(today)
  console.log(hoy)
  // console.log(hoy)
  const verSiPublica = ritual.forEach( e=> {
    const dateInit = e.record
    dateInit.forEach(async ed=>{
      console.log(ed)
      if(diaDelAno(ed.dateInit)===hoy){

        // quiitar el if del dia - y cambiarlo por un if si hay dato en dateInit y dateFinal
         const updateDateFinit = await Record.findByIdAndUpdate(ed._id,{dateFinal:today ,dateInit:ed.dateInit},{ new: true })
         const horaFinal = formatAMPM(today)
         const hora = formatAMPM(ed.dateInit)
         const {ritualName,numMax,numActual,_id} = ritual[0]
         console.log("asi sale la hora final",horaFinal)
        res.render("rituales/iniciar-ritual",{horaFinal,hora,ritualName,numMax,numActual,_id})
      }
    })
  })
})

//hacer dashbpard de hora final menos inicial - despues cambiar el condicional de finalizar - cambiar diseño - agregar lo de frases para ahi tener el crud completo o poner en agregar o editar los rituales pero me da miedo el checkbox

router.get("/dashboard", async(req,res,next)=>{
  if(req.session.currentUser){
    const {_id,rituales} = req.session.currentUser
    let tiempoTotal = 0
    const ritualesPopulados = await User.find({_id}).populate({
      path:"rituales",
      populate:{
        path :"record",
        model : "record"
      }
    })

    const userrituales = ritualesPopulados[0].rituales
    const nuevoArr = []

    for(let i =0;i<userrituales.length;i++){
      userrituales[i].record[0].tiempoUsado = userrituales[i].record[0].dateFinal - userrituales[i].record[0].dateInit


      console.log("uno",userrituales[i])
      
    }
    console.log("dos",userrituales[0])
    
   
    
    
    
    res.render("rituales/dashboard-finito",{userrituales})
  }else{
    res.redirect("/login")
  }


  //los rituales correspondientes al usuario , osea al usuario
  //traer los finalizados de la DB que contengan dateInit y dateFinal

  //restar fecha uno y fecha dos 
  //enviar los datos a la vista 



})


module.exports = router;