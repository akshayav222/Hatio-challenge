import React from 'react';

function TaskList({ todos, onDeleteTodo }) {
  return (
    <ul className="task-list">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <li key={todo._id} className="task-item">
            <label>{todo.task}</label>
            <button
              className="delete-task-btn"
              onClick={() => onDeleteTodo(todo._id)}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </li>
        ))
      ) : (
        <p>No todos available for this project.</p>
      )}
    </ul>
  );
}

export default TaskList;
