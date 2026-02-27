const express = require('express');
const {createTodo, getAllTodos, updateTodo} = require("../controllers/todoController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/create', protect, createTodo);
router.get('/all', protect, getAllTodos);
router.put('/update/:id', protect, updateTodo);

module.exports = router;