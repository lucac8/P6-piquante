const express = require('express');
const router = express.Router(); //Pour creer une route avec middleware , complet

const userCtrl = require('../controllers/CtrlUser');
const password = require('../middleware/password')

router.post('/signup', password , userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;  //On exporte les routes 