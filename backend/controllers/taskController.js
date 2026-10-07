import mongoose from "mongoose";
import Task, { normalizeStatus, STATUS_VALUES, PRIORITY_VALUES } from "../models/Task.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Fields the create/update endpoints are permitted to accept.
// All other client-supplied fields (createdBy, assignedTo, isCompleted,
// _id, createdAt, updatedAt) are explicitly ignored to prevent mass assignment.
const ALLOWED_TASK_FIELDS = ["title", "description", "status", "priority", "dueDate"];

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

const isValidObjectId = (value) =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

// Resolve the creator id whether createdBy is a populated User document or a
// raw ObjectId (depends on whether the query used .populate()).
const getOwnerId = (task) => {
  const createdBy = task.createdBy;
  if (createdBy && typeof createdBy === "object" && createdBy._id) {
    return createdBy._id;
  }
  return createdBy;
};

const isTaskOwner = (task, userId) => {
  const ownerId = getOwnerId(task);
  return (
    ownerId !== undefined &&
    ownerId !== null &&
    ownerId.toString() === userId.toString()
  );
};

// Admins may access any task; everyone else must own it.
const canAccessTask = (task, user) => {
  if (!task) return false;
  return user.role === "admin" || isTaskOwner(task, user._id);
};

const buildPagination = (page, limit, total) => {
  const cappedLimit = Math.min(limit, MAX_LIMIT);
  const totalPages = total === 0 ? 0 : Math.ceil(total / cappedLimit);
  return {
    page,
    limit: cappedLimit,
    total,
    totalPages,
  };
};

// @desc    Get paginated/filtered tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private (own tasks only; admins see all)
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority } = req.query;

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_LIMIT;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new ApiError(
      400,
      "Invalid pagination parameters: page and limit must be positive integers"
    );
  }

  const cappedLimit = Math.min(limit, MAX_LIMIT);

  const filter = {};

  // Ownership scoping: normal users only see their own tasks.
  if (req.user.role !== "admin") {
    filter.createdBy = req.user._id;
  }

  // Case-insensitive search across title and description.
  if (search) {
    const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
    ];
  }

  // Status filter (normalized to canonical stored values).
  if (status) {
    const normalizedStatus = normalizeStatus(status);

    if (!STATUS_VALUES.includes(normalizedStatus)) {
      throw new ApiError(400, "Invalid status");
    }

    filter.status = normalizedStatus;
  }

  if (priority) {
    if (!PRIORITY_VALUES.includes(priority)) {
      throw new ApiError(400, "Invalid priority");
    }

    filter.priority = priority;
  }

  const total = await Task.countDocuments(filter);
  const pagination = buildPagination(page, cappedLimit, total);
  const skip = (page - 1) * cappedLimit;

  const tasks = await Task.find(filter)
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(cappedLimit);

  const response = new ApiResponse(200, tasks, "Tasks fetched successfully");
  response.pagination = pagination;
  return res.status(200).json(response);
});

// @desc    Get a single task by id
// @route   GET /api/tasks/:id
// @access  Private (own task only; admins may view any)
export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  const task = await Task.findById(id)
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  if (!canAccessTask(task, req.user)) {
    // 404 (not 403) to avoid leaking task existence to non-owners.
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (authenticated user)
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || (typeof title === "string" && title.trim().length === 0)) {
    throw new ApiError(400, "Task title is required");
  }

  // Explicitly set createdBy from the authenticated user and ignore any
  // client-supplied createdBy / assignedTo / isCompleted / id / timestamps.
  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate: dueDate ?? null,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedTask, "Task created successfully"));
});

// @desc    Update an existing task (partial update, field-restricted)
// @route   PUT /api/tasks/:id
// @access  Private (owner or admin)
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  const task = await Task.findById(id);

  if (!canAccessTask(task, req.user)) {
    throw new ApiError(404, "Task not found");
  }

  // Build an explicit allow-list of updates — never pass req.body directly.
  const updates = {};
  for (const field of ALLOWED_TASK_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  Object.assign(task, updates);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (owner or admin)
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  const task = await Task.findById(id);

  if (!canAccessTask(task, req.user)) {
    throw new ApiError(404, "Task not found");
  }

  const deletedId = task._id.toString();
  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, { id: deletedId }, "Task deleted successfully"));
});

// @desc    Assign/unassign a task (enterprise feature, admin only)
// @route   PUT /api/tasks/:id/assign
// @access  Private/Admin
export const assignTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  const { userId } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can assign tasks");
  }

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.assignedTo = userId || null;
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task assigned successfully"));
});
