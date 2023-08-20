const axios = require('axios');
const express = require("express");
const router = express.Router();
const logRequest = require("./util/logRequest");
const auth = require("../middleware/auth");
const queryFeedbackValidator = require("./util/queryFeedbackValidator");

const haystack_bm25_url = process.env.HAYSTACK_BM25_URL;
const haystack_ai_url = process.env.HAYSTACK_AI_URL;


router.post('/', async (req, res) => {
    /*  #swagger.requestBody = {
            in: 'body',
            required: true,
            description: 'This endpoint receives the question as a string and allows the requester to set additional parameters that will be passed on to the Haystack pipeline.',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/QueryRequest' }
                }
            }
    } 
    #swagger.summary = 'Search for a document.'
    */
    const haystack_url = req.query.model === 'ai' ? haystack_ai_url : haystack_bm25_url;
    
    try {
        console.log(req.body);
        const response = await axios.post(`${haystack_url}/query`, req.body);
        res.send(response.data);
        
        results = response.data.documents?.map(doc => doc.id);
        logRequest(req, res, results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
    }
});

router.post('/feedback', auth, queryFeedbackValidator, async (req, res) => {
    /*  #swagger.requestBody = {
            in: 'body',
            required: true,
            description: 'This endpoint allows users to provide feedback on the results of a query.',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/QueryFeedbackRequest' }
                }
            }
    }
    #swagger.summary = 'Provide feedback on the results of a query.'
    */
    try {
        logRequest(req, res, "");
        res.send('Feedback received.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;