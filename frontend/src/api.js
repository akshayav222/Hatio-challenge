import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Project-related API calls
export const fetchProjects = () => API.get('/projects');
export const createProject = (newProject) => API.post('/projects', newProject);

// Todo-related API calls
export const fetchTodos = (projectId) => API.get(`/todos/${projectId}`);
export const addTodo = (projectId, todo) => API.post('/todos', { projectId, ...todo });
export const deleteTodo = (todoId) => API.delete(`/todos/${todoId}`);