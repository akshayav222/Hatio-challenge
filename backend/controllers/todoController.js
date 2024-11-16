import Project from '../models/Project.js';
import Todo from '../models/Todo.js';

export const addTodo = async (req, res) => {
    try {
        const { projectId, description } = req.body;
        // Validate input fields
        if (!projectId || !description) {
            return res.status(400).json({ message: "Project ID and description are required" });
        }

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const todo = new Todo({ description });
        await todo.save();

        // Add the new todo to the project
        project.todos.push(todo._id);
        await project.save();

        // Return the updated project with the new todo
        const updatedProject = await Project.findById(projectId).populate('todos');

        //await Project.findByIdAndUpdate(projectId, { $push: { todos: todo._id } });
        res.status(201).json({ project: updatedProject, todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Todo (Description or Status)
export const updateTodo = async (req, res) => {
    try {
        const { todoId } = req.params;
        const { description, status } = req.body;

        // Validate input fields
        if (!description && !status) {
            return res.status(400).json({ message: "Description or status must be provided" });
        }

        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Update the todo's description and/or status
        if (description) todo.description = description;
        if (status) todo.status = status;

        // Update the `updatedDate` automatically
        todo.updatedDate = Date.now();
        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Todo
export const deleteTodo = async (req, res) => {
    try {
        const { todoId, projectId } = req.params;

        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Remove the todo from the project's todos array
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.todos = project.todos.filter(todo => todo.toString() !== todoId);
        await project.save();

        // Delete the todo
        await Todo.findByIdAndDelete(todoId);

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Todo as Completed
export const markTodoAsCompleted = async (req, res) => {
    try {
        const { todoId } = req.params;

        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Mark the todo as completed
        todo.status = 'completed';
        todo.updatedDate = Date.now();
        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Todo as Pending
export const markTodoAsPending = async (req, res) => {
    try {
        const { todoId } = req.params;

        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Mark the todo as pending
        todo.status = 'pending';
        todo.updatedDate = Date.now();
        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};