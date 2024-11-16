import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import NewProjectForm from './components/NewProjectForm';

function App() {
  const [projects, setProjects] = useState([]); // List of projects
  const [todos, setTodos] = useState([]); // List of todos for the selected project
  const [newProject, setNewProject] = useState(''); // New project name
  const [newTodo, setNewTodo] = useState(''); // New todo for the selected project
  const [selectedProject, setSelectedProject] = useState(null); // Currently selected project
  const [error, setError] = useState('');

  // Fetch the list of projects from the backend
  useEffect(() => {
    axios
      .get('/api/projects') // Your project API route
      .then((response) => setProjects(response.data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  // Fetch todos for the selected project
  useEffect(() => {
    if (selectedProject) {
      axios
        .get(`/api/todos/${selectedProject}`) // Fetch todos for the selected project
        .then((response) => setTodos(response.data))
        .catch((error) => console.error('Error fetching todos:', error));
    }
  }, [selectedProject]);

  // Create a new project
  const handleAddProject = () => {
    if (newProject.trim()) {
      axios
        .post('/api/projects', { name: newProject })
        .then((response) => {
          setProjects([...projects, response.data]);
          setNewProject('');
        })
        .catch((error) => console.error('Error creating project:', error));
    }
  };

  // Create a new todo for the selected project
  const handleAddTodo = () => {
    if (newTodo.trim() && selectedProject) {
      axios
        .post('/api/todos', { projectId: selectedProject, task: newTodo })
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo('');
        })
        .catch((error) => console.error('Error creating todo:', error));
    }
  };

  // Delete a todo by its ID
  const handleDeleteTodo = (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
    axios
      .delete(`/api/todos/${todoId}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== todoId));
      })
      .catch((error) => console.error('Error deleting todo:', error));
    }
  };

  // Handle selecting a project
  const handleSelectProject = (projectId) => {
    setSelectedProject(projectId);
  };

  return (
    <div className="container">
      <h1>To-Do List <i className="fas fa-pencil-alt"></i></h1>
      {error && <div className="error">{error}</div>} {/* Display error message */}

      {/* New Project Form */}
      <NewProjectForm
        newProject={newProject}
        setNewProject={setNewProject}
        handleAddProject={handleAddProject}
      />

      {/* List Projects */}
      <ProjectList
        projects={projects}
        selectedProject={selectedProject}
        handleSelectProject={handleSelectProject}
      />

      {/* New Todo for Selected Project */}
      {selectedProject && (
        <div>
          <div className="task-input-container">
            <input
              type="text"
              className="task-input"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button className="add-task-btn" onClick={handleAddTodo}>
              Add Todo
            </button>
          </div>

          {/* List Todos for the Selected Project */}
          <TaskList
            todos={todos}
            handleDeleteTodo={handleDeleteTodo}
          />
        </div>
      )}
    </div>
  );
}

export default App;
