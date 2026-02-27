const express = require('express');
const {createTodo, getAllTodos} = require("../controllers/todoController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/create', protect, createTodo);
router.get('/all', protect, getAllTodos);

module.exports = router;