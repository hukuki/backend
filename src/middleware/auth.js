const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const User = require('../model/user');
const Organization = require('../model/organization');
const serviceAccount = require("../../cred/cred.json");


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
        return res.status(401).send({ message: 'Unauthorized' });
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
