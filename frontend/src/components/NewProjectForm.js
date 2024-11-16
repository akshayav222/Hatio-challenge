import React, { useState } from 'react';

function NewProjectForm({ onAddProject }) {
  const [newProject, setNewProject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProject.trim()) {
      onAddProject(newProject);
      setNewProject(''); // Clear the input after submitting
    }
  };

  return (
    <div className="task-input-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="Create a new project"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button className="add-task-btn" type="submit">
          Add Project
        </button>
      </form>
    </div>
  );
}

export default NewProjectForm;
