const express = require('express');
const s3 = require('../s3');

const { getDocument } = require("./util/document");

const router = express.Router();

router.get('/:id', async (req, res) => {
    // #swagger.summary = Get the content of a specific document.

    const document = await getDocument(req.params.id);
    
    if(!document) return res.status(404).send({message: 'Document not found.'} );
    
    res.send(document);
});

module.exports = router;