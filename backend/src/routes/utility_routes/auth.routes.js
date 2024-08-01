var express = require('express');
var router = express.Router();
const AuthController = require('../../controller/auth_controller/authController')

// auth
router.post('/login', AuthController.login);


module.exports = router;