const axios = require('axios');
const express = require("express");
const router = express.Router();

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
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;