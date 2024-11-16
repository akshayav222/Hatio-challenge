import React from 'react';

function ProjectList({ projects, onSelectProject }) {
  return (
    <div className="project-list">
      <h2>Projects</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div
            key={project._id}
            className="project"
            onClick={() => onSelectProject(project._id)}
          >
            {project.name}
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default ProjectList;
