import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});

// Virtual field for summary (computed field for completed and total todos)
projectSchema.virtual('summary').get(function () {
    const completedTodos = this.todos.filter(todo => todo.status === 'completed').length;
    const totalTodos = this.todos.length;
    return `${completedTodos} / ${totalTodos} completed`;
});

// Static method to update the project title
projectSchema.statics.updateTitle = async function (projectId, newTitle) {
    return await this.findByIdAndUpdate(projectId, { title: newTitle }, { new: true });
};

// Instance method to add a todo (to handle adding references to todos)
projectSchema.methods.addTodo = async function (todoId) {
    if (!this.todos.includes(todoId)) {
         this.todos.push(todoId);
         await this.save();
    }
};

/*// Instance method to remove a todo
projectSchema.methods.removeTodo = async function (todoId) {
    this.todos = this.todos.filter(todo => todo.toString() !== todoId.toString());
    await this.save();
};*/

projectSchema.methods.removeTodo = async function (todoId) {
    const index = this.todos.indexOf(todoId);
    if (index !== -1) {
        this.todos.splice(index, 1);
        await this.save();
    }
};

export default mongoose.model('Project', projectSchema);
