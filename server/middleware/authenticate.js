const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const UserModel = require("../models/Users");

dotenv.config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        try {
            const decoded = jwt.verify(token, process.env.jwtPrivateKey);
            req.user = decoded._id;
            console.log(req.user) ;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Check if token is within a grace period (e.g., 5 minutes)
                const gracePeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
                if (decoded.exp - Date.now() <= gracePeriod) {
                  // Token is within grace period, allow access but suggest refresh
                  req.user = decoded._id;
                  next();
                } else {
                  return res.status(401).json({ error: "Unauthorized: Token expired" });
                }
              } else {
                // Other error handling
              }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = authenticate;
