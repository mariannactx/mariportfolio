import mongoose, { Schema } from 'mongoose';

// Define movie schema
var projectSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  thumb: String,
  url: String,
  description: String,
  stack: Array,
  created: Date,
  author: String
});

// Export Mongoose model
export default mongoose.model('project', projectSchema);