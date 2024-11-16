import Project from '../models/Project.js';
import Todo from '../models/Todo.js';
import axios from 'axios'; // To make HTTP requests (e.g., to GitHub API)
import mongoose from 'mongoose';


export const createProject = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const newProject = new Project({ title });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('todos');
        if (projects.length === 0) {
            return res.status(404).json({ message: "No projects found" });
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific project by id
export const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID" });
        }

        const project = await Project.findById(req.params.id).populate('todos');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update project title
export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title } = req.body;
                
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID" });
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const updatedProject = await Project.updateTitle(req.params.id, title);
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID" });
        }

        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a todo to a project
export const addTodoToProject = async (req, res) => {
    try {
        const { todoId } = req.body;
        const projectId = req.params.id;
        
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        const existingTodo = project.todos.find(todo => todo.toString() === todoId);
        if (existingTodo) {
        return res.status(400).json({ message: 'Todo already added to this project' });
        }

        await project.addTodo(todoId);
        res.status(200).json({ message: "Todo added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export project summary as a Gist (markdown format)
export const exportProjectSummary = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid Project ID" });
        }

        const project = await Project.findById(projectId).populate('todos');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Generate the markdown content
        const completedTodos = project.todos.filter(todo => todo.status === 'completed').length;
        const totalTodos = project.todos.length;

        let markdownContent = `# ${project.title}\n\n`;
        markdownContent += `### Summary: ${completedTodos} / ${totalTodos} completed\n\n`;

        // Pending todos
        markdownContent += '## Pending Todos\n';
        project.todos.filter(todo => todo.status === 'pending').forEach(todo => {
            markdownContent += `- [ ] ${todo.description}\n`;
        });

        // Completed todos
        markdownContent += '## Completed Todos\n';
        project.todos.filter(todo => todo.status === 'completed').forEach(todo => {
            markdownContent += `- [x] ${todo.description}\n`;
        });

        // Now you can either send this markdownContent to the GitHub API to create a Gist,
        // or simply return the content to be saved locally.

        // For simplicity, assuming you're exporting the markdown locally:
        // You would typically save this markdown file locally and/or upload to GitHub.

        // If you want to create a Gist via GitHub API, you'd use axios or any HTTP client.
        const gistPayload = {
            description: `Project Summary for ${project.title}`,
            public: false,
            files: {
                [`${project.title}.md`]: {
                    content: markdownContent,
                },
            },
        };

        // GitHub API request to create a Gist
        // You can add your GitHub personal access token in headers for authentication
        // Handle GitHub API request errors
        // GitHub API request to create a Gist
        if (!process.env.GITHUB_TOKEN) {
            return res.status(500).json({ message: 'GitHub token is missing in environment variables' });
        }

        try {
            await axios.post('https://api.github.com/gists', gistPayload, {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`, // Make sure the token is valid and available
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error creating Gist on GitHub',
                error: error.response?.data || error.message,
            });
        }

        res.status(200).json({
            message: 'Project summary exported successfully as Gist',
            markdownContent,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};