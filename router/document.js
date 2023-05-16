const express = require('express');
const s3 = require('../s3');
const { mockDocumentData } = require('./util/mock');
const {Utf8ArrayToStr} = require('./util/uint8');

const router = express.Router();

router.get('/:id', async (req, res) => {
    // #swagger.summary = Get the content of a specific document.

    const file = await s3.getFile('mevzuat_json/'+req.params.id+'.json');
    
    if(!file) return res.status(404).send({message: 'Document not found.'} );
    
    const str = Utf8ArrayToStr(file);

    res.send(str);
});

module.exports = router;