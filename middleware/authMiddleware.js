const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.protect =  async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            if (!token) return res.status(401).json({ message: "Not authorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if(!user) return res.status(401).json({ message: "Not authorized" })
        req.user = user;
        next()

    }catch(err){
        console.log(err);
    }
}