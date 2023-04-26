const Space = require('../../model/space.js');

const findOneSpace = async ({ space, user }) => {
    /* Get the space which user has created, or has been added to. */

    return await Space.findOne({ _id: space })
        .or([{ user: user }, { "people": user }]);
}

const findSpaces = async ({ user }) => {
    /*  Gets all the spaces that user have access to, i.e. 
        all spaces created by the user, or spaces that the user is added to. 
    */

    return await Space.find()
        .or([{ user: user }, { "people": user }])
        .populate('people')
        .populate('user');
}

module.exports = {
    findOneSpace,
    findSpaces
}