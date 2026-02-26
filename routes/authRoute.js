const express = require('express');
const {login, isAuthenticate, createUser} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/me', protect, isAuthenticate);

module.exports = router;