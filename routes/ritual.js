const express = require('express');
const router  = express.Router();
const User = require('../models/User.model.js')
const Rituales = require('../models/Rituales.model.js')
const Record = require('../models/Record.model.js')
const InitRitu = require('../models/Init.model.js')
const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]


router.get("/select-rituals" , async (req,res,next)=>{
  const ritualesInit = await InitRitu.find({})
  res.render("rituales/select-rituales" , {ritualesInit})
})

router.get("/daily" ,(req,res,next)=>{
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
  try{
    let newRitualDB = await Rituales.create({
    ritualName:nombre,
    numMax: valorNum,
    dias,
    })
    res.redirect("/select-rituals")
    
  }catch(error){
    console.log(error)
  }  
})




module.exports = router;