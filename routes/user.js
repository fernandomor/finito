const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt")
const User = require('../models/User.model.js')
const InitRitu = require('../models/Init.model.js')
const saltRounds = 10


router.get("/login" ,(req,res,next)=>{
  console.log(req.session.currentUser)
  if(!req.session.currentUser){
    res.render("user/login")
  }else{
    res.redirect("/daily")
  }
  
})

router.post("/login" , async (req,res,next)=>{
  const {email , password } = req.body
    
    if(!email||!password){
        res.render("user/login",{errorMessage : "TODOS LOS CAMPOS PORFAVOR"})
    }

    const userDB = await User.findOne({email})
    if(!userDB){
        res.render("user/login",{errorMessage: "Este usuario no existe"})
    }
    const match = await bcrypt.compareSync(password , userDB.passwordHash)
    console.log(match)
    if(match){
        res.redirect("/login")
    }else{
        res.render("user/login",{ errorMessage : "Contraseña incorrecta"})
    }  

  
})


router.get("/signup" ,async (req,res,next)=>{
  const rituales = await InitRitu.find({})
  res.render('user/registro' ,{userInSession: req.session.currentUser,rituales})
})

router.post("/signup" , async (req,res,next)=>{
  const {name, edad, email, password} = req.body
  console.log(name,edad,email,password)
  try{
      const genResult = await bcrypt.genSalt(saltRounds)
      const passwordHash = await bcrypt.hash(password,genResult)
      const newUser = await User.create({name, edad, email, passwordHash})
      console.log(`The user ${newUser} was created`)
      req.session.currentUser = newUser
      console.log("esta es la cookie",req.session.currentUser)
      res.redirect("/login")
  }
  catch(error){
      console.log(error)
  }
})
  
router.get("/logout" , async (req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;