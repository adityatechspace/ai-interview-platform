const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { registerSchema, loginSchema } = require('../utils/validators');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isGuest: user.isGuest,
  createdAt: user.createdAt,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }
  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

// @desc    Create a temporary guest account
// @route   POST /api/auth/guest
// @access  Public
const guestLogin = asyncHandler(async (req, res) => {
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const guestEmail = `guest_${Date.now()}_${randomSuffix}@guest.local`;
  const randomPassword = Math.random().toString(36).slice(2, 12);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomPassword, salt);

  const user = await User.create({
    name: 'Guest',
    email: guestEmail,
    password: hashedPassword,
    isGuest: true,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

module.exports = { register, login, guestLogin, getMe };
