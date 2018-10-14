import mongoose from 'mongoose';
import Project from './models/project';

const projects = [
    {
        title: "Caatinga Viva",
        thumb: "http://mariannactx.com/caatingaviva/img/tv.gif",
        url: "http://mariannactx.com/caatingaviva",
        description: "In convallis scelerisque ex eget feugiat. Ut elementum tortor tortor.",
        stack: ["html", "css", "javascript"]
    },
    {
        title: "Caatinga Viva 2",
        thumb: "http://mariannactx.com/caatingaviva/img/tv.gif",
        url: "http://mariannactx.com/caatingaviva",
        description: "In convallis scelerisque ex eget feugiat. Ut elementum tortor tortor.",
        stack: ["html", "css", "javascript"]
    }
]

// Connect to MongoDB
mongoose.connect('mongodb://localhost/projects');

// Go through each project
projects.map(data => {
  // Initialize a model with project data
  const project = new Project(data);
  // and save it into the database
  project.save();
});