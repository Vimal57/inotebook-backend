const jwt = require('jsonwebtoken');
const USER_SECRET = 'usersecret';
const User = require("../models/User");

const isLoggedIn = async (req, res, next) => {
    // get the user from the jwt token and append id to the req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(200).json({
            msg: 'Please pass the token!',
            data: {},
        });
    }

    const data = jwt.verify(token, USER_SECRET);
    const user = await User.findOne({ _id: data.user.id }).select("-password");
    req.me = user;
    next();
}


module.exports = isLoggedIn;