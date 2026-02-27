const Todo = require('../models/Todo')

exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ ok: false, message: "Title & description required" });
        }
        const todoExists = await Todo.findOne({title: title})
        if (todoExists) {
            return res.status(400).json({message: 'todo already exists'});
        }
        const todo = new Todo({ title, description });
        todo._creator = req.user._id;
        await todo.save();

        return res.status(201).json({ ok: true, message: "Todo created", todo });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try{
        let filter = {}
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        const todos = await Todo.find(filter).populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({ ok: true, todos });

    }catch (e) {
        return res.status(500).json({ ok: false, message: e.message });
    }
}
exports.updateTodo = async (req, res) => {
    try{
        const { title, description } = req.body;
        const id = req.params.id;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({
                ok: false,
                message: "Todo not found",
            });
        }
        if(req.user.role !== 'admin' && req.user._id.toString() !== todo.createdBy) {
            return res.status(403).json({
                ok: false,
                message: "Not authorized to update this todo",
            });
        }
        if(title) todo.title = title;
        if(description) todo.description = description;
        await todo.save();
        return res.status(200).json({
            ok: true,
            message: 'Todo updated successfully',
        })
    }catch (err){
        return res.status(500).json({ ok: false, message: err.message });
    }
}