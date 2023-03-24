const axios = require('axios');
const express = require("express");
const router = express.Router();

const haystack_url = process.env.HAYSTACK_URL;


router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${haystack_url}/query`, req.body);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = router;