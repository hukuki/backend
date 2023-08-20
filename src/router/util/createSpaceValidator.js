const Joi = require('joi')

const spaceSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const createSpaceValidator = validator.body(spaceSchema)


module.exports = createSpaceValidator