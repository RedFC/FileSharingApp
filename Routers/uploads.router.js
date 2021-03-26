var router = require("express").Router();
const TokenAuth = require('../Middleware/token');

const fileUpload = require("../Controllers/extras/fileupload");
const upload = fileUpload("image");

let uploadController = require('../Controllers/UploadController');
let uploadControllers = new uploadController()

router.post("/create",TokenAuth,upload.fields([{
    name: 'image', maxCount: 1
  }, {
    name: 'pdfs', maxCount: 1
  }]),uploadControllers.upload)

router.get("/getall",TokenAuth,uploadControllers.getAll);
router.get("/download/:url",TokenAuth,uploadControllers.download);


module.exports = router;
