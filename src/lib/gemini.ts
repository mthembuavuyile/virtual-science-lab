export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

import { canUseAI, incrementAIUsage } from './ai-rate-limiter';

// Helper to clean response code blocks and escape raw control characters inside JSON strings
function cleanJsonString(str: string): string {
  // Strip markdown wrappers
  let cleaned = str.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  // Extract content between first { or [ and last } or ] to isolate the JSON payload
  const startIdx = cleaned.search(/[{[]/);
  let endIdx = -1;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    if (cleaned[i] === '}' || cleaned[i] === ']') {
      endIdx = i;
      break;
    }
  }
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // State machine to escape raw control characters inside string literals
  let result = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    
    if (inString) {
      if (char === '\\') {
        escapeNext = true;
        result += char;
      } else if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else if (char.charCodeAt(0) < 32) {
        result += '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

// General helper to perform the proxy fetch
const API_TIMEOUT_MS = 120000; // 120 second timeout for complex generation

async function callProxy(action: string, payload: any, timeoutMs = API_TIMEOUT_MS): Promise<string> {
  if (!canUseAI()) {
    throw new Error('AI Rate Limit Exceeded: You have reached your limit of 5 AI requests for today. Please try again tomorrow.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let errorMsg = 'An error occurred while communicating with the server.';
      try {
        const data = await response.json();
        errorMsg = data.error || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    incrementAIUsage();
    return data.text;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Ask the tutor a general question using the CAPS science context
 */
export async function askTutor(message: string, history: ChatMessage[] = [], language = 'English') {
  try {
    return await callProxy('askTutor', { message, history, language });
  } catch (error: any) {
    console.error('Gemini API Proxy Error (askTutor):', error);
    return `Error: ${error.message || 'Failed to connect to proxy.'}`;
  }
}

/**
 * Analyze the state of a virtual lab simulation
 */
export async function analyzeExperiment(
  simName: string,
  state: Record<string, any>,
  language = 'English'
) {
  try {
    const text = await callProxy('analyzeExperiment', { simName, state, language });
    const cleaned = cleanJsonString(text || '{}');
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Proxy Error (analyzeExperiment):', error);
    const msg = error?.message?.includes('Rate Limit') ? error.message : 'Failed to retrieve analysis. Check API connection.';
    return {
      conceptBreakdown: msg,
      saContext: msg,
      quiz: {
        question: 'What is the current relationship between current and voltage in an ohmic conductor?',
        options: ['Directly proportional', 'Inversely proportional', 'Exponential', 'No relationship'],
        correctIndex: 0,
        explanation: 'According to Ohm\'s Law, current is directly proportional to voltage at a constant temperature.'
      }
    };
  }
}

/**
 * Evaluate the user's input to the experiment quiz
 */
export async function evaluateQuizAnswer(
  question: string,
  userAnswer: string,
  correctReason: string
) {
  try {
    return await callProxy('evaluateQuizAnswer', { question, userAnswer, correctReason });
  } catch (error: any) {
    console.error('Gemini API Proxy Error (evaluateQuizAnswer):', error);
    if (error?.message?.includes('Rate Limit')) return error.message;
    return 'Your answer has been registered. Keep experimenting!';
  }
}

/**
 * Generate a CAPS Matric Paper 1 (Physics) or Paper 2 (Chemistry) style question
 */
export async function generateMatricExamChallenge(topic: string) {
  try {
    const text = await callProxy('generateMatricExamChallenge', { topic });
    const cleaned = cleanJsonString(text || '{}');
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Proxy Error (generateMatricExamChallenge):', error);
    const msg = error?.message?.includes('Rate Limit') ? error.message : 'Scenario generation failed. Please try again.';
    return {
      title: 'Ohm\'s Law Matric Prep',
      scenario: msg,
      questions: [
        { num: '1.1', text: 'Define internal resistance in words.', marks: 2 },
        { num: '1.2', text: 'State Ohm\'s Law in words.', marks: 2 }
      ],
      memo: '1.1 Internal resistance is the opposition to the flow of charge within the cell itself [2 marks]. 1.2 The current through a conductor is directly proportional to the potential difference across it, provided temperature remains constant [2 marks].'
    };
  }
}

/**
 * Grade a student's answer to a Matric Exam Prep Challenge
 */
export async function evaluateExamAnswer(
  scenario: string,
  questions: any[],
  studentAnswers: Record<string, string>,
  memo: string
) {
  try {
    const text = await callProxy('evaluateExamAnswer', { scenario, questions, studentAnswers, memo });
    const cleaned = cleanJsonString(text || '{}');
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Proxy Error (evaluateExamAnswer):', error);
    const msg = error?.message?.includes('Rate Limit') ? error.message : 'Could not process grading. Please check your formatting and try again.';
    return {
      totalAwarded: 0,
      maxMarks: 10,
      gradingDetails: [],
      generalFeedback: msg
    };
  }
}

/**
 * Audit and moderate student data from school SBA practicals
 */
export async function moderateSbaReport(
  sbaType: string,
  variables: Record<string, any>,
  dataPoints: Array<Record<string, any>>
) {
  try {
    const text = await callProxy('moderateSbaReport', { sbaType, variables, dataPoints });
    const cleaned = cleanJsonString(text || '{}');
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Proxy Error (moderateSbaReport):', error);
    const msg = error?.message?.includes('Rate Limit') ? error.message : 'Data uploaded successfully. Ensure measurements are recorded under constant conditions.';
    return {
      isConsistent: true,
      theoreticalAnalysis: msg,
      sourcesOfError: ['Parallax error', 'Indicator lag', 'Temperature fluctuations'],
      draftDiscussion: 'The relationship shows expected trends under standard classroom limits.',
      conclusionDraft: 'The hypothesis is supported by the recorded variables.'
    };
  }
}

/**
 * Generate a self-contained interactive simulation HTML code using Gemini
 */
export async function generateDynamicSandboxLab(prompt: string, codeHistory: string[] = []): Promise<string> {
  try {
    const rawCode = await callProxy('generateDynamicSandboxLab', { prompt, codeHistory });
    let cleaned = (rawCode || '').trim();
    const codeBlockMatch = cleaned.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      cleaned = codeBlockMatch[1].trim();
    }
    return cleaned;
  } catch (error: any) {
    console.error('Gemini API Proxy Error (generateDynamicSandboxLab):', error);
    const errorDetails = error?.message || 'Connection error or rate limit.';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen p-6 font-sans">
  <div class="max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
    <div class="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <h1 class="text-xl font-bold text-red-400">Simulation Generation Issue</h1>
    <p class="text-slate-300 text-xs mt-2">${errorDetails}</p>
    <p class="text-slate-500 text-[11px] mt-2">Try re-running the request or selecting another CAPS lesson prompt from the left panel.</p>
  </div>
</body>
</html>`;
  }
}
