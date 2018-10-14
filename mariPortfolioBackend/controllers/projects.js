import Project from '../models/project';

// Hardcode the days for the sake of simplicity
const author = "Marianna";

export const index = (req, res, next) => {
  // Find all projects and return json response
  Project.find().lean().exec((err, projects) => res.json(
    // Iterate through each project
    { projects: projects.map(project => ({
      ...project
    }))}
  ));
};