const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: {type:String, required:true, maxlength:150},
    description: {type:String, required:true, maxlength:500},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {timestamps: true});

todoSchema.pre("save", function() {
    if (this._creator) {
        this.createdBy = this._creator;
    }
});

module.exports = mongoose.model("Todo", todoSchema)