const {Utf8ArrayToStr} = require('./uint8');
const s3 = require('../../s3');

const getDocument = async (id) => {
    const file = await s3.getFile('tree/'+id+'.json');
    
    if(!file) return null;
    
    const str = Utf8ArrayToStr(file);
    const document = JSON.parse(str);

    document._id = id;
    return document;
}

module.exports = {getDocument};