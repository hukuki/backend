const Joi = require('joi')


const bodySchema = Joi.object({
    role: Joi.string().required().valid("manager", "observer", "editor")
})

const querySchema = Joi.string().required()

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const changeRoleInSpaceValidator = (validator.query(querySchema), validator.body(bodySchema))


module.exports = changeRoleInSpaceValidator