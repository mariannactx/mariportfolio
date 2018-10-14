import express, { Router } from 'express';
// Import index action from projects controller
import { index } from './controllers/projects';

// Initialize the router
const router = Router();

// Handle /projects.json route with index action from projects controller
router.route('/projects.json')
  .get(index);

export default router;