const Joi = require('joi')

const userSchema = Joi.object({
    user: Joi.string().required(),
    role: Joi.string().optional()
})

const bodySchema = Joi.object({
    people: Joi.array().required().items(userSchema)
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const addPeopleToSpaceValidator = validator.body(bodySchema)


module.exports = addPeopleToSpaceValidator