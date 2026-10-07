import mongoose from "mongoose";

const STATUS_VALUES = ["pending", "in-progress", "completed"];
const PRIORITY_VALUES = ["Low", "Medium", "High"];

// Normalize assignment-facing status values into the canonical stored form.
// Accepts: Pending / In Progress / Completed and any-case / spaced variants.
// Setters run before validators in Mongoose, so the enum below always sees
// a canonical value (or the raw value is rejected by the enum).
const normalizeStatus = (value) => {
  if (value === undefined || value === null || value === "") {
    return value;
  }
  const normalized = String(value)
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
  return STATUS_VALUES.includes(normalized) ? normalized : value;
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title must not exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Task description must not exceed 2000 characters"],
    },
    // Required link to the User who created the task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must have a creator"],
    },
    // Optional link for task assignment (enterprise field, preserved)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      // Internal lowercase enum preserved for frontend compatibility.
      // The setter normalizes assignment-facing title-case values
      // (Pending / In Progress / Completed) down to these before storage.
      enum: STATUS_VALUES,
      default: "pending",
      set: normalizeStatus,
    },
    priority: {
      type: String,
      enum: PRIORITY_VALUES,
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // Enterprise field, preserved. Server-managed; not exposed through
    // the assignment create/update endpoints.
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Create the model
const Task = mongoose.model("Task", taskSchema);

export default Task;
export { normalizeStatus, STATUS_VALUES, PRIORITY_VALUES };
