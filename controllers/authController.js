const User = require('../models/User')
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            ok:false,
            message: 'All fields are required',
        })
    }
    try {
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(400).json({
                ok:false,
                message: 'User already exists',
            })
        }
        await User.create({name, email, password})
        return res.status(200).json({
            ok: true,
            message: 'User created successfully',
        })

    }catch(err) {
        return res.status(500).json({
            ok: false,
            message: err.message,
        })
    }
}
exports.login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            ok:false,
            message: 'All fields are required',
        })
    }
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                ok:false,
                message: 'user not found',
            })
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                ok:false,
                message: 'password not match',
            })
        }
        const token = getToken(user._id)
        setCookies(res, token, 7);
        return res.status(200).json({
            ok: true,
            message: "Login successful",
        });

    }catch (err){
        return res.status(500).json({
            ok:false,
            message: err.message,
        })
    }
}
exports.isAuthenticate = async (req, res) => {
    res.json({
        ok: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    })
}
const getToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}
const setCookies = (res, token, days) =>{
    const maxAge = days * 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
        maxAge,
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    })
}