const jwt = require('jsonwebtoken');

const JWT_SECRET = "reactexam";

function verifyToken(req, res, next) {
    try {
        const token = req.headers.token;
        console.log(token);

        if (!token) throw 'Unauthorized';

        let payload = jwt.verify(token, JWT_SECRET);
        

        if (!payload) throw 'Unauthorized';
        req.authUser = payload;
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send('error');
    }
}

module.exports = {
    verifyToken,
    getSignedToken: (payload) => jwt.sign(payload, JWT_SECRET)
};
