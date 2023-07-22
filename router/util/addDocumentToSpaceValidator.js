const Joi = require('joi')

const bodySchema = Joi.object({
    documents: Joi.array().required()
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const addDocumentToSpaceValidator = validator.body(bodySchema)


module.exports = addDocumentToSpaceValidator