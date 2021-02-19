const express = require('express');
const router  = express.Router();
const Frases = require('../models/Frases.model.js')

/* GET home page */
//aqui salen todas las frases 
router.get('/comunidad', async (req, res, next) => {
  let dependeDeTi = false
  if(req.session.currentUser){
    dependeDeTi = true
  }
  console.log(dependeDeTi,req.session.currentUser)
  const frasesDb = await Frases.find({})
  res.render("frases/frases",{frasesDb})
});

//aqui añades frases
router.get("/nuevaFrase", async (req,res,next)=>{
  res.render("frases/nueva")
})

router.post("/nuevaFrase", async (req,res,next)=>{
  const frase = req.body.frase 
  const fraseDB = await Frases.create({frase})
  console.log(fraseDB)
  res.redirect("/comunidad")
})

//aqui borras 
router.get("/borrar/:id", async (req,res,next)=>{
  const id = req.params.id
  if(req.session.currentUser){
    await Frases.findByIdAndRemove(id)
    res.redirect("/comunidad")
  }else{
    res.redirect("/login")
  }
})

//aqui editas 
router.get("/frase/:id", async (req,res,next)=>{
  const id = req.params.id
  if(req.session.currentUser){
    const fraseDb = await Frases.find({_id:id})
    const frase = fraseDb[0]
    res.render("frases/editar", frase)
  }else{
    res.redirect("/login")
  }
})

router.post("/frase/:id", async (req,res,next)=>{
  const id = req.params.id
  const fraseup = req.body.frase
  const newFrase = await Frases.findByIdAndUpdate(id,{frase:fraseup})
  console.log(newFrase)
  res.redirect("/comunidad")

})

module.exports = router;
//solo puedes borrar/editar  si estas registrado