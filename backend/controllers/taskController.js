import Task from '../models/Task.js';

// 1. Existing getTasks function
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add your createTask function right here:
export const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      createdBy: req.user._id, // Ensure this matches your User ID field
      assignedTo: assignedTo || null,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Update an existing task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role boundary: Allow update if user owns it OR user is an admin
    const isOwner = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: 'User not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task from collection
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role boundary: Allow delete if user owns it OR user is an admin
    const isOwner = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: 'User not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, id: req.params.id }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a task to a user
// @route   PUT /api/tasks/:id/assign
export const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admins only (Requires req.user.role to be populated by authMiddleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can assign tasks' });
    }

    // Update assignment
    task.assignedTo = userId || null; 
    await task.save();

    // Fetch and return the updated task with populated name for immediate UI update
    const updatedTask = await Task.findById(task._id).populate('assignedTo', 'name');

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};