const express = require('express');
const {
  createInterview,
  submitAnswer,
  getInterviewById,
  getHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').post(createInterview).get(getHistory);
router.route('/:id').get(getInterviewById);
router.route('/:id/answer').post(submitAnswer);

module.exports = router;
