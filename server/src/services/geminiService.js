const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Extracts the first valid JSON object/array from a raw text blob.
 * Gemini sometimes wraps JSON in markdown code fences or adds prose.
 */
const extractJSON = (rawText) => {
  const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBracket = cleaned.search(/[[{]/);
  if (firstBracket === -1) {
    throw new Error('No JSON found in AI response');
  }
  const lastBracket = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  const jsonSlice = cleaned.slice(firstBracket, lastBracket + 1);
  return JSON.parse(jsonSlice);
};

/**
 * Generates a fixed set of interview questions tailored to the setup config.
 */
const generateQuestions = async ({ role, difficulty, interviewType, language, totalQuestions = 8 }) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `You are an expert technical interviewer creating a structured interview.

Generate exactly ${totalQuestions} interview questions for the following configuration:
- Role: ${role}
- Interview type: ${interviewType}
- Difficulty: ${difficulty}
- Language: ${language}

Rules:
- Questions should progress logically, starting easier and increasing in depth.
- If interview type is "Technical", focus on role-specific technical/problem-solving questions.
- If interview type is "Behavioral", focus on past-experience, teamwork, and situational questions.
- If interview type is "Mixed", alternate between technical and behavioral questions.
- Each question must be self-contained (no reference to "the previous question").
- Do not number the questions in the text itself.
- Respond in ${language}.

Respond with ONLY a JSON array of ${totalQuestions} strings, nothing else. Example format:
["Question 1 text", "Question 2 text", ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const questions = extractJSON(text);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('AI did not return a valid list of questions');
  }

  return questions.slice(0, totalQuestions);
};

/**
 * Generates final feedback and scoring based on the full conversation transcript.
 */
const generateFeedback = async ({ role, difficulty, interviewType, language, conversation }) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const transcript = conversation
    .map((msg) => `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
    .join('\n\n');

  const prompt = `You are an expert interview evaluator reviewing a completed mock interview.

Interview configuration:
- Role: ${role}
- Interview type: ${interviewType}
- Difficulty: ${difficulty}
- Language: ${language}

Full transcript:
${transcript}

Evaluate the candidate's performance honestly and constructively. Respond in ${language}.

Respond with ONLY a JSON object in this exact shape, nothing else:
{
  "overallScore": <integer 0-100>,
  "strengths": ["short strength 1", "short strength 2", "short strength 3"],
  "weaknesses": ["short weakness 1", "short weakness 2", "short weakness 3"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "feedback": "2-4 sentence overall summary of the candidate's performance"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const feedback = extractJSON(text);

  return {
    overallScore: Math.max(0, Math.min(100, Number(feedback.overallScore) || 0)),
    strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
    weaknesses: Array.isArray(feedback.weaknesses) ? feedback.weaknesses : [],
    suggestions: Array.isArray(feedback.suggestions) ? feedback.suggestions : [],
    feedback: feedback.feedback || '',
  };
};

module.exports = {
  generateQuestions,
  generateFeedback,
};
