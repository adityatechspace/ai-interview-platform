const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const setupInterviewSchema = z.object({
  role: z.enum([
    'Frontend',
    'Backend',
    'Full Stack',
    'Software Engineer',
    'Machine Learning',
    'HR',
    'Behavioral',
  ]),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  language: z.string().default('English'),
  interviewType: z.enum(['Technical', 'Behavioral', 'Mixed']),
  duration: z.union([z.literal(10), z.literal(20), z.literal(30)]),
});

const submitAnswerSchema = z.object({
  answer: z.string().min(1, 'Answer cannot be empty'),
});

module.exports = {
  registerSchema,
  loginSchema,
  setupInterviewSchema,
  submitAnswerSchema,
};
