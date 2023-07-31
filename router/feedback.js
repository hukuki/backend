const express = require("express");
const Feedback = require("../model/feedback");
const { feedbackValidator, notLoggedInFeedbackValidator } = require("./util/feedbackValidator");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, feedbackValidator, async (req, res) => {

    const { category, feedback } = req.body;

    try {
        const feedback_obj = new Feedback({ category, feedback, user: req.user, ip_address: req.socket.remoteAddress, });
        await feedback_obj.save();
        res.send("Feedback submitted successfully");

    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/notLoggedIn", notLoggedInFeedbackValidator, async (req, res) => {

    const { email, category, feedback } = req.body;

    try {
        const feedback_obj = new Feedback({ category, feedback, email, ip_address: req.socket.remoteAddress, });
        await feedback_obj.save();
        res.send("Feedback submitted successfully");

    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;