const Joi = require('joi')

const bodySchema = Joi.object({
    bookmarks: Joi.array().required()
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const addBookmarkValidator = validator.body(bodySchema)


module.exports = addBookmarkValidator