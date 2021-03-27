const upload = require('../server/models').uploads;
const _ = require('lodash');
const Joi = require('joi');
var download = require('download-pdf')


class uploadController {

    upload = async (req, res) => {

        try {

            if (!req.body.title) {
                res.status(500).send({
                    message: "Title is Required"
                });
            }

            if(!req.file) return res.status(500).send({message : "File Is Required"});

            let schema = {
                title: req.body.title,
                file: req.file.path,
                userId: req.user.id
            }

            let uploads = await upload.create(schema);
            if (uploads) {
                res.send({
                    message: "Documents Uploaded",
                    data: uploads
                })
            }

        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }

    }

    getAll = async (req, res) => {
        try {

            let fileUpload = await upload.findAll();
            if (fileUpload.length) {
                res.send({
                    message: "success",
                    data: fileUpload
                })
            }

        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    }

    download = async (req, res) => {

        try {

            let url = "uploads/"+req.params.url
            res.download(url)

        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }

    }


}




module.exports = uploadController;