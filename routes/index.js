const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("Sesión",req.session.currentUser)
  res.render('index');
});

module.exports = router;
