import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// ── Security: Allowed origins ──
const ALLOWED_ORIGINS = [
  'https://vylab.vylexnexys.co.za',
  'https://www.vylab.vylexnexys.co.za',
];

// Allow localhost in development
if (!process.env.VERCEL) {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:5173');
}

// Origin validation middleware - blocks direct API calls from Postman/scripts
const originGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const origin = req.headers['origin'] as string | undefined;
  const referer = req.headers['referer'] as string | undefined;

  // In production, require a valid origin or referer from our domain
  if (process.env.VERCEL) {
    const isAllowedOrigin = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    const isAllowedReferer = referer && ALLOWED_ORIGINS.some(o => referer.startsWith(o));

    if (!isAllowedOrigin && !isAllowedReferer) {
      return res.status(403).json({ error: 'Forbidden: Invalid request origin.' });
    }
  }

  next();
};

// ── Security: Payload validation ──
const MAX_MESSAGE_LENGTH = 5000;
const MAX_CODE_HISTORY_LENGTH = 50000;
const MAX_HISTORY_ENTRIES = 50;

const VALID_ACTIONS = [
  'askTutor',
  'analyzeExperiment',
  'evaluateQuizAnswer',
  'generateMatricExamChallenge',
  'evaluateExamAnswer',
  'moderateSbaReport',
  'generateDynamicSandboxLab',
];

function validatePayload(action: string, payload: any): string | null {
  if (!VALID_ACTIONS.includes(action)) {
    return 'Unknown action.';
  }
  if (!payload || typeof payload !== 'object') {
    return 'Payload is required and must be an object.';
  }

  switch (action) {
    case 'askTutor': {
      if (typeof payload.message !== 'string' || payload.message.length > MAX_MESSAGE_LENGTH) {
        return `Message must be a string under ${MAX_MESSAGE_LENGTH} characters.`;
      }
      if (payload.history && (!Array.isArray(payload.history) || payload.history.length > MAX_HISTORY_ENTRIES)) {
        return `History must be an array with at most ${MAX_HISTORY_ENTRIES} entries.`;
      }
      break;
    }
    case 'analyzeExperiment': {
      if (typeof payload.simName !== 'string' || payload.simName.length > 200) {
        return 'Invalid simulation name.';
      }
      break;
    }
    case 'evaluateQuizAnswer': {
      if (typeof payload.question !== 'string' || payload.question.length > MAX_MESSAGE_LENGTH) {
        return 'Invalid question field.';
      }
      break;
    }
    case 'generateMatricExamChallenge': {
      if (typeof payload.topic !== 'string' || payload.topic.length > 500) {
        return 'Topic must be a string under 500 characters.';
      }
      break;
    }
    case 'generateDynamicSandboxLab': {
      if (typeof payload.prompt !== 'string' || payload.prompt.length > MAX_MESSAGE_LENGTH) {
        return `Prompt must be a string under ${MAX_MESSAGE_LENGTH} characters.`;
      }
      if (payload.codeHistory && Array.isArray(payload.codeHistory)) {
        const totalSize = payload.codeHistory.reduce((sum: number, c: string) => sum + (c?.length || 0), 0);
        if (totalSize > MAX_CODE_HISTORY_LENGTH) {
          return `Code history total size exceeds ${MAX_CODE_HISTORY_LENGTH} characters.`;
        }
      }
      break;
    }
  }
  return null; // valid
}

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Simple in-memory sliding-window IP rate limiter
interface RequestLog {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RequestLog>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20;

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Use x-real-ip (set by Vercel, cannot be spoofed by client) instead of x-forwarded-for
  const ip = (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let log = ipRequestMap.get(ip);
  if (!log) {
    log = { timestamps: [] };
    ipRequestMap.set(ip, log);
  }

  // Filter out timestamps outside the sliding window
  log.timestamps = log.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (log.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = log.timestamps[0];
    const msToWait = RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp);
    const secondsToWait = Math.ceil(msToWait / 1000);
    return res.status(429).json({
      error: `Too many requests. Please wait ${secondsToWait} seconds before trying again.`
    });
  }

  log.timestamps.push(now);
  next();
};

// Periodic memory cleanup for stale IP logs (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [ip, log] of ipRequestMap.entries()) {
    log.timestamps = log.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (log.timestamps.length === 0) {
      ipRequestMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

// Proxy endpoint for Gemini requests
app.post('/api/gemini', originGuard, rateLimiter, async (req, res) => {
  const { action, payload } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  // Validate payload before processing
  const validationError = validatePayload(action, payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured on the server.');
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  try {
    switch (action) {
      case 'askTutor': {
        const { message, history } = payload;
        const systemInstruction = `You are Vylex AI, an expert high school Physical Sciences teacher specializing in the South African CAPS (Curriculum and Assessment Policy Statement) syllabus for Grades 10, 11, and 12.
Your goal is to explain concepts clearly, patiently, and in an engaging manner.

CRITICAL INSTRUCTION FOR LANGUAGE:
If the requested language is 'English', explain in English.
If the requested language is 'Zulu', 'Xhosa', 'Afrikaans', or 'Sepedi', explain in that language, but ALWAYS keep the official scientific terms in English in brackets (e.g., "i-velocity (isivinini)" or "i-equivalence point (indawo yokulingana)") because high school exams are set only in English or Afrikaans.
If the requested language is 'Slang', explain using South African Township Slang / Tsotsitaal/Mix (using terms like 'gweras', 'hektik', 'kasi', 'shisa', 'bra', 'driver' etc.) and use relatable street metaphors (e.g., comparing current flow in a wire to taxi queues, voltage to a taxi driver rushing to make quota, or chemical equilibrium to a seesaw at a local park or balancing a heavy braai stand).

Support your answers with CAPS-relevant formulas and exam tips where appropriate. Make your responses look beautiful with bolding and bullet points.`;

        const contents = [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'analyzeExperiment': {
        const { simName, state, language } = payload;
        const prompt = `Perform a detailed scientific analysis of the following virtual lab simulation state.
Simulation: ${simName}
Current Variables and Readings: ${JSON.stringify(state)}

Language requested: ${language}

You MUST return a JSON object with the following keys:
1. "conceptBreakdown": A step-by-step CAPS-aligned conceptual explanation of what is happening under this state, explaining the formulas and laws (e.g. Ohm's Law, Faraday's Law, Le Châtelier's, or kinematic equations).
2. "saContext": A highly relatable connection to the South African industrial or social context (e.g., Eskom load shedding, Sasol CTL plants, Hartbeespoort dam eutrophication, acid mine drainage in Johannesburg, local brand vinegar tests).
3. "quiz": A dictionary containing:
    - "question": A challenging, matric exam-style question based on the current state.
    - "options": An array of 4 choices.
    - "correctIndex": Index of correct option (0-3).
    - "explanation": Brief explanation of why the correct option is right.
    
Ensure the "conceptBreakdown" and "saContext" text is formatted using standard markdown (bullets, bold text).
If the language is 'Zulu', 'Xhosa', 'Afrikaans', or 'Sepedi', translate the "conceptBreakdown" and "saContext" accordingly, keeping key English scientific terms in brackets.
If language is 'Slang', write the "conceptBreakdown" and "saContext" using South African Township Slang and analogies (e.g. taxi queues, braais, etc.) to make it super intuitive. The quiz itself should remain in clear English to prepare them for the actual exam.

Return ONLY a valid JSON block, no surrounding markdown wrappers except optionally \`\`\`json.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'evaluateQuizAnswer': {
        const { question, userAnswer, correctReason } = payload;
        const prompt = `The user was asked the following question: "${question}".
The correct explanation is: "${correctReason}".
The user chose the answer: "${userAnswer}".

Briefly evaluate if the user's choice is correct or incorrect, and explain why. Keep the explanation encouraging and under 3 sentences, specifically geared towards a high school student.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.5,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'generateMatricExamChallenge': {
        const { topic } = payload;
        const prompt = `Generate a realistic, CAPS-aligned South African Matric (Grade 12 final exam) level challenge on the topic: ${topic}.
The topic can be in Physics (Paper 1) or Chemistry (Paper 2).

You MUST return a JSON object with the following keys:
1. "title": Short title (e.g. "Work, Energy & Power - Inclined Plane").
2. "scenario": A detailed text describing the setup (e.g., "A crate of mass 5kg is pulled up an inclined plane at 30 degrees by a force of...").
3. "questions": An array of questions, each with:
    - "num": Question subnumber (e.g. "2.1", "2.2")
    - "text": The text of the question (e.g. "State Newton's Second Law of Motion in words.")
    - "marks": Mark allocation as an integer (e.g. 2, 5)
4. "memo": A step-by-step marking guideline (memorandum) for each subquestion, showing formula allocation [1 mark], substitution [1 mark], and final answer with units [1 mark].

Return ONLY a valid JSON block, no surrounding markdown wrappers except optionally \`\`\`json.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'evaluateExamAnswer': {
        const { scenario, questions, studentAnswers, memo } = payload;
        const prompt = `You are a Senior Matric Examiner marking the Physical Sciences Grade 12 Paper.

Scenario: ${scenario}
Questions: ${JSON.stringify(questions)}
Memorandum reference: ${memo}

Student's Answers: ${JSON.stringify(studentAnswers)}

Evaluate the student's answers strictly according to the South African Department of Basic Education (DBE) standard.
Allocate marks for each sub-question:
- 2 marks for standard definitions.
- For calculations: Formula [1 mark], Substitution [1 mark or more], Final numerical answer [1 mark], Correct unit [1 mark].
If the student does not state the formula, deduct the formula mark. If units are missing in the final answer, deduct the unit mark.

You MUST return a JSON object with:
1. "totalAwarded": Total marks awarded (integer).
2. "maxMarks": Sum of all question marks (integer).
3. "gradingDetails": An array corresponding to the questions with keys:
    - "num": Question subnumber (e.g. "2.1")
    - "awarded": Marks awarded (integer)
    - "max": Maximum marks (integer)
    - "feedback": Specific breakdown of where they gained/lost marks (e.g. "+1 mark for formula, -1 mark for wrong units, correct substitution").
4. "generalFeedback": A supportive, constructive summary of performance and advice on what to revise.

Return ONLY a valid JSON block, no surrounding markdown wrappers except optionally \`\`\`json.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'moderateSbaReport': {
        const { sbaType, variables, dataPoints } = payload;
        const prompt = `You are a School-Based Assessment (SBA) Moderator for Physical Sciences under CAPS.
Practical: ${sbaType}
Student Independent/Dependent variables: ${JSON.stringify(variables)}
Student Experimental Data Log: ${JSON.stringify(dataPoints)}

Provide a professional assessment of this lab data.

You MUST return a JSON object with:
1. "isConsistent": Boolean (true if the values align with physical/chemical laws e.g. voltage increases as current increases, or pH changes properly with base added).
2. "theoreticalAnalysis": Explanation of what the values *should* be theoretically, and compute the approximate percentage error or trend logic.
3. "sourcesOfError": Array of 3-4 likely real-world classroom experimental errors (e.g. internal resistance of wires, temperature changes, parallax error in burette reading, carbon dioxide absorption in sodium hydroxide).
4. "draftDiscussion": A beautifully written draft paragraph of the "Discussion" section of the lab report that the student can study to learn how to write like a scientist.
5. "conclusionDraft": A brief formal conclusion statement verifying or falsifying the initial hypothesis.

Return ONLY a valid JSON block, no surrounding markdown wrappers except optionally \`\`\`json.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          }
        });
        return res.json({ text: response.text || '' });
      }

      case 'generateDynamicSandboxLab': {
        const { prompt: sandboxPrompt, codeHistory } = payload;
        const systemInstruction = `You are a world-class physical science simulation engineer.
Your task is to generate a single, completely self-contained interactive HTML page for a science simulation based on the user's prompt.

CRITICAL RULES:
1. Output ONLY a raw, complete HTML page. Do NOT wrap it in markdown. Do NOT write conversational explanations. Return only the code starting with <!DOCTYPE html>.
2. Include Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>.
3. Include Lucide icons via CDN if needed, or draw simple svg/canvas elements.
4. Implement full responsive interactive controls (e.g. range sliders, selection dropdowns, play/pause/reset buttons) to update simulator variables.
5. The visuals must be beautiful: use dark mode themes (indigo/slate colors), smooth animations (CSS transitions or canvas requestAnimationFrame), and crisp text.
6. Ensure all science, units, and equations are mathematically and physically accurate to the South African CAPS Physical Sciences syllabus.
7. Include a small instruction panel inside the widget explaining the variables and what to observe.

If modifying or refining an existing simulation, edit the following current code:
${codeHistory && codeHistory.length > 0 ? `CURRENT CODE:\n${codeHistory[codeHistory.length - 1]}` : 'Start from scratch.'}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: sandboxPrompt,
          config: {
            systemInstruction,
            temperature: 0.3,
          }
        });
        return res.json({ text: response.text || '' });
      }

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (error: any) {
    console.error(`Gemini API Error in proxy (${action}):`, error);
    return res.status(500).json({ error: error?.message || 'Error processing AI request' });
  }
});

// Serve locally if run directly
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[Proxy Server] Running locally on http://localhost:${PORT}`);
  });
}

export default app;
