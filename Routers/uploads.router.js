var router = require("express").Router();
const TokenAuth = require('../Middleware/token');

const fileUpload = require("../Controllers/extras/fileupload");
const upload = fileUpload("image");

let uploadController = require('../Controllers/UploadController');
let uploadControllers = new uploadController()

router.post("/create",TokenAuth,upload.single('file'),uploadControllers.upload);

router.get("/getall",TokenAuth,uploadControllers.getAll);
router.get("/download/:url",uploadControllers.download);


module.exports = router;
