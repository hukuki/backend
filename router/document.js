const express = require('express');
const { mockDocumentData } = require('./util/mock');

const router = express.Router();

router.get('/:id', (req, res) => {
    // #swagger.summary = Get the content of a specific document.
    res.send(mockDocumentData);
});

module.exports = router;