const admin = require('firebase-admin');
const serviceAccount = require("../cred/hukuki-dc783-firebase-adminsdk-46yr9-7624ff4406.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = async (req, res, next) => {
    const bearer = req.headers.authorization;
    
    if (!bearer || !bearer.startsWith('Bearer '))
        return res.status(401).send({message: 'Unauthorized'});

    const accessToken = bearer.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(accessToken);
        req.user = decodedToken;
    } catch (err) {
        console.log(err);
        return res.status(401).send({message: 'Unauthorized'});
    }
    
    next();
}