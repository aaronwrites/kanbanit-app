const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, data) => {
            if (err) {
                return res.status(500).json({
                    msg: "Token Error",
                    error: err
                })
            }
            else {
                req.userId = data.id;
                next();
            }
        });
    }
    else {
        return res.status(498).send("Invalid Token");
    }
}

module.exports = userMiddleware;