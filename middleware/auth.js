const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const User = require('../model/user');
const Organization = require('../model/organization');

const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": new Buffer(process.env.FIREBASE_PRIVATE_KEY, 'base64').toString('ascii'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = async (req, res, next) => {
    /* #swagger.autoHeaders=false */
    
    /*  #swagger.security = [{
            "bearerAuth": []
    }] */
    const bearer = req.headers.authorization;
    console.log(req.headers);

    if (!bearer || !bearer.startsWith('Bearer '))
        return res.status(401).send({ message: 'Unauthorized' });

    const accessToken = bearer.split(' ')[1];

    let userInfo;
    try {
        userInfo = await admin.auth().verifyIdToken(accessToken);
    } catch (e) {
        return res.status(401).send({ message: 'Unauthorized hello' });
    }

    // We do not pass the user object retrieved from the third party auth provider.
    // We create a new user object (in our database) with the uid and email from the third party auth provider,
    // then pass it to the next functions.

    req.user = await User.findOne({
        auth_provider_id : userInfo.uid
    });

    if (req.user) return next();
    
    // If not registered (meaning the user is signed up from the third party auth provider
    // but not yet encoutered in the backend) : create a new user in our database.

    // Find the organization that matches the domain of the user's email address.
    const domain = userInfo.email.split('@')[1];

    let organization = await Organization.findOne({
        domain: domain,
    });

    if (!organization)
        organization = await Organization.create({
            domain: domain,
        });
    
    req.user = await User.create({ email: userInfo.email, organization: organization._id, auth_provider_id: userInfo.uid });
    
    next();
}
