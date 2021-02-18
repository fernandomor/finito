const mongoose = require("mongoose");
const InitRitu = require('../models/Init.model.js');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://finito:finito@cluster0.ugtzm.mongodb.net/finito"

mongoose
.connect(MONGODB_URI, {
useCreateIndex: true,
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(x => console.log(`Connected to Mongo ONLINE! Database name: “${x.connections[0].name}“`))
.catch(err => console.error("Error connecting to mongo", err));

const ritualesInit = [
  {nombreRitual:"leer",img:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80", pregunta:"Pon el máximo de páginas diarias que deseas leer"},
  {nombreRitual:"ejercicio",img:"https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", pregunta:"¿Cuál es tu meta en tiempo de ejercicio diario?"},
  {nombreRitual:"comer-saludable",img:"https://images.unsplash.com/photo-1547592180-85f173990554?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", pregunta:"¿Quieres logar comer saludable en los 3 tiempos de comida?"},
  {nombreRitual:"despertar-temprano",img:"https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=633&q=80", pregunta:"¿A que hora quieres depertar?"},
  {nombreRitual:"dormir-temprano",img:"https://images.unsplash.com/photo-1487300001871-12053913095d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", pregunta:"¿A que hora quieres dormir?"}]

InitRitu.create(ritualesInit)
  .then(ritualsDB => {
    console.log(`Created ${ritualsDB.length} rituales`);
 
    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating rituals from the DB: ${err}`));