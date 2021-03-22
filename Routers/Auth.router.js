var router = require("express").Router();

let AuthController = require('../Controllers/AuthController');
let Controllers = new AuthController()

router.post("/create",Controllers.createUser);

router.post('/login',Controllers.Auth);

router.get('/verify',Controllers.refreshToken)

module.exports = router;
