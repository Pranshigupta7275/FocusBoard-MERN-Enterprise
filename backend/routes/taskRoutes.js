import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  assignTask 
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all task routes
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);


router.route('/:id/assign')
  .put(protect, assignTask);

export default router;