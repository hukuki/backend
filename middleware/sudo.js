/* 
    This middleware is used to check if the user is a super user or not.
    If the user is not a super user, then it returns a 403 status code.
*/

module.exports = (req, res, next) => {
    if (!req.user.isSuper) 
        return res.status(403).send('Access denied.');
    
    next();
}