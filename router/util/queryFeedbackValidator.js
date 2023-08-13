const Joi = require('joi')

const queryFeedbackSchema = Joi.object({
    query: Joi.string().required(),
    resultId: Joi.string().required(),
    thumbsUp: Joi.boolean().required()
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const queryFeedbackValidator = validator.body(queryFeedbackSchema)


module.exports = queryFeedbackValidator