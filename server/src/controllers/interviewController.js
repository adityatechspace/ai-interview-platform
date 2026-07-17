const asyncHandler = require('express-async-handler');
const Interview = require('../models/Interview');
const { generateQuestions, generateFeedback } = require('../services/geminiService');
const { setupInterviewSchema, submitAnswerSchema } = require('../utils/validators');

const TOTAL_QUESTIONS = 8;

// @desc    Create a new interview: generate questions and return the first one
// @route   POST /api/interviews
// @access  Private (registered or guest)
const createInterview = asyncHandler(async (req, res) => {
  const parsed = setupInterviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }
  const { role, difficulty, language, interviewType, duration } = parsed.data;

  const questions = await generateQuestions({
    role,
    difficulty,
    interviewType,
    language,
    totalQuestions: TOTAL_QUESTIONS,
  });

  const interview = await Interview.create({
    user: req.user._id,
    role,
    difficulty,
    language,
    interviewType,
    duration,
    totalQuestions: questions.length,
    questions,
    conversation: [
      {
        role: 'ai',
        content: questions[0],
        questionNumber: 1,
      },
    ],
    status: 'in-progress',
  });

  res.status(201).json({
    success: true,
    interview: {
      id: interview._id,
      role: interview.role,
      difficulty: interview.difficulty,
      interviewType: interview.interviewType,
      duration: interview.duration,
      totalQuestions: interview.totalQuestions,
      currentQuestionNumber: 1,
      conversation: interview.conversation,
      status: interview.status,
    },
  });
});

// @desc    Submit an answer to the current question, get the next question or final result
// @route   POST /api/interviews/:id/answer
// @access  Private (registered or guest)
const submitAnswer = asyncHandler(async (req, res) => {
  const parsed = submitAnswerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }
  const { answer } = parsed.data;

  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (interview.status === 'completed') {
    res.status(400);
    throw new Error('This interview has already been completed');
  }

  const answeredCount = interview.conversation.filter((m) => m.role === 'user').length;
  const currentQuestionNumber = answeredCount + 1;

  interview.conversation.push({
    role: 'user',
    content: answer,
    questionNumber: currentQuestionNumber,
  });

  const isLastQuestion = currentQuestionNumber >= interview.totalQuestions;

  if (!isLastQuestion) {
    const nextQuestionNumber = currentQuestionNumber + 1;
    const nextQuestion = interview.questions[nextQuestionNumber - 1];

    interview.conversation.push({
      role: 'ai',
      content: nextQuestion,
      questionNumber: nextQuestionNumber,
    });

    await interview.save();

    return res.json({
      success: true,
      done: false,
      interview: {
        id: interview._id,
        currentQuestionNumber: nextQuestionNumber,
        totalQuestions: interview.totalQuestions,
        conversation: interview.conversation,
        status: interview.status,
      },
    });
  }

  // Last question answered -> generate feedback
  const result = await generateFeedback({
    role: interview.role,
    difficulty: interview.difficulty,
    interviewType: interview.interviewType,
    language: interview.language,
    conversation: interview.conversation,
  });

  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.result = result;

  const isGuest = req.user.isGuest;

  if (isGuest) {
    // Guests do not get persisted interview history
    const responsePayload = {
      id: interview._id,
      role: interview.role,
      difficulty: interview.difficulty,
      interviewType: interview.interviewType,
      duration: interview.duration,
      conversation: interview.conversation,
      status: interview.status,
      result: interview.result,
      completedAt: interview.completedAt,
      saved: false,
    };
    await Interview.deleteOne({ _id: interview._id });

    return res.json({
      success: true,
      done: true,
      interview: responsePayload,
    });
  }

  await interview.save();

  res.json({
    success: true,
    done: true,
    interview: {
      id: interview._id,
      role: interview.role,
      difficulty: interview.difficulty,
      interviewType: interview.interviewType,
      duration: interview.duration,
      conversation: interview.conversation,
      status: interview.status,
      result: interview.result,
      completedAt: interview.completedAt,
      saved: true,
    },
  });
});

// @desc    Get a single interview by id (for result page or history detail)
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }
  res.json({ success: true, interview });
});

// @desc    Get interview history for the logged-in user
// @route   GET /api/interviews
// @access  Private (registered users only, guests will simply have none)
const getHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id, status: 'completed' })
    .sort({ createdAt: -1 })
    .select('role difficulty interviewType duration result status createdAt completedAt');

  res.json({ success: true, interviews });
});

module.exports = { createInterview, submitAnswer, getInterviewById, getHistory };
