const Joi = require('joi')

const feedbackSchema = Joi.object({
    category: Joi.string().valid('general', 'bug', 'feature-request').required(),
    feedback: Joi.string().required(),
})

const notLoggedInFeedbackSchema = Joi.object({
    email: Joi.string().email().required(),
    category: Joi.string().valid('general', 'bug', 'feature-request').required(),
    feedback: Joi.string().required(),
})

const validator = require('express-joi-validation').createValidator({
    passError: true
  });

const notLoggedInFeedbackValidator = validator.body(notLoggedInFeedbackSchema)

const feedbackValidator = validator.body(feedbackSchema)


module.exports = {feedbackValidator, notLoggedInFeedbackValidator}