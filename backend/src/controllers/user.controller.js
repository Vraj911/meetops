const { User, Workspace, Meeting } = require("../config/mongoose");
const mongoose = require("mongoose");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("workspaces");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

// Create user
exports.createUser = async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    const user = await User.create({ email, name, role });
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    return next(error);
  }
};
