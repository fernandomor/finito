const express = require('express');
const router  = express.Router();
const User = require('../models/User.model.js')
const Rituales = require('../models/Rituales.model.js')
const Record = require('../models/Record.model.js')
const InitRitu = require('../models/Init.model.js')
const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]


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

  res.render("rituales/select-rituales",{ritualesSelect} )
})


router.get("/daily" ,(req,res,next)=>{
  //Logica de los dias 
  //Cuales aparecen los que selecciono- boton de iniciar y de terminar se postea en el record
  res.render("rituales/retos-diarios")
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




module.exports = router;