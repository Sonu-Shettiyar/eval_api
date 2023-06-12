const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {

        const decoded = jwt.verify(token, process.env.secret_key)
        if (token) {
            req.body.userID = decoded.userID
            req.body.userName = decoded.userName
            next();
        } else {
            res.status(200).json({ "msg": "Not Authorized" })
        }

    } catch (error) {
        res.status(400).json({ errore: error.message })
    }

}
module.exports = {
    auth
}