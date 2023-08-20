const Log = require("../../model/log")

module.exports = function (req, res, data) {
    const log = new Log({
        user: req.user,
        ip_address: req.socket.remoteAddress,
        endpoint: req.originalUrl,
        params: req.params,
        http_query: req.query,
        request_body: req.body,
        response: data
    });
    log.save();
};