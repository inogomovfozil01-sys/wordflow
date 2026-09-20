import { GoogleGenAI } from '@google/genai';
import { CefrLevel } from '@/types';

// Initialize the Google GenAI SDK
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export interface AiWordExplanation {
  simpleExplanation: string;
  memoryHook: string;
  cefrExamples: Array<{
    english: string;
    translationRu: string;
    translationUz: string;
  }>;
  commonMistake: string;
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

/**
 * Generates an educational breakdown and memory hook for a vocabulary word.
 */
export async function explainWordWithAi(
  word: string,
  userLevel: CefrLevel = 'B1'
): Promise<AiWordExplanation> {
  const ai = getGeminiClient();

  if (!ai) {
    // Intelligent educational fallback when API key is not yet configured
    return {
      simpleExplanation: `"${word}" is an important English word. At your ${userLevel} level, focus on its natural context, collocations, and pronunciation.`,
      memoryHook: `Associate "${word}" with an emotional image or a personal real-life story to make it unforgettable.`,
      cefrExamples: [
        {
          english: `I always try to use "${word}" whenever I speak English with colleagues.`,
          translationRu: `Я всегда стараюсь использовать "${word}", когда говорю по-английски с коллегами.`,
          translationUz: `Men har doim hamkasblarim bilan inglizcha gaplashganda "${word}" soʻzini ishlatishga harakat qilaman.`,
        },
      ],
      commonMistake: `Don't translate "${word}" word-for-word into your native language; pay attention to prepositions.`,
      miniQuiz: {
        question: `What is the best way to remember "${word}"?`,
        options: [
          'Memorize it once and never review',
          'Use spaced repetition and practice with sentences',
          'Translate it through multiple languages',
          'Ignore it',
        ],
        correctIndex: 1,
        explanation: 'Spaced repetition reinforces neural pathways for long-term retention.',
      },
    };
  }

  try {
    const prompt = `You are WordFlow's expert AI English Tutor.
Explain the word "${word}" for an English learner at CEFR level ${userLevel}.

Output MUST be strictly valid JSON matching this exact structure:
{
  "simpleExplanation": "Clear, friendly definition tailored to ${userLevel} level",
  "memoryHook": "A vivid mnemonic, imagery, or associative memory trick to remember this word easily",
  "cefrExamples": [
    {
      "english": "Example sentence 1 in English suitable for ${userLevel}",
      "translationRu": "Russian translation of sentence 1",
      "translationUz": "Uzbek translation of sentence 1"
    },
    {
      "english": "Example sentence 2 in English",
      "translationRu": "Russian translation of sentence 2",
      "translationUz": "Uzbek translation of sentence 2"
    },
    {
      "english": "Example sentence 3 in English",
      "translationRu": "Russian translation of sentence 3",
      "translationUz": "Uzbek translation of sentence 3"
    }
  ],
  "commonMistake": "A typical error foreign learners make with this word (e.g. wrong preposition or false friends)",
  "miniQuiz": {
    "question": "A multiple-choice question testing understanding or usage of ${word}",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why the correct answer is right"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text) as AiWordExplanation;
  } catch (error) {
    console.error('Error generating AI word explanation with Gemini:', error);
    // Return fallback rather than failing
    return {
      simpleExplanation: `"${word}" is a key term in English vocabulary.`,
      memoryHook: `Create a mental picture linking "${word}" to its meaning.`,
      cefrExamples: [
        {
          english: `Practice saying "${word}" out loud every day.`,
          translationRu: `Практикуйтесь произносить "${word}" вслух каждый день.`,
          translationUz: `Har kuni "${word}" soʻzini ovoz chiqarib aytishni mashq qiling.`,
        },
      ],
      commonMistake: `Be mindful of spelling and pronunciation.`,
      miniQuiz: {
        question: `Is "${word}" a useful word to master?`,
        options: ['Yes, highly recommended', 'No', 'Maybe never', 'Not sure'],
        correctIndex: 0,
        explanation: 'Expanding your active vocabulary accelerates fluency.',
      },
    };
  }
}

/**
 * Handles conversational queries with the AI Tutor.
 */
export async function getAiTutorResponse(
  userMessage: string,
  userLevel: CefrLevel = 'B1',
  currentWord?: string
): Promise<string> {
  const ai = getGeminiClient();

  if (!ai) {
    return `Hello! I am your WordFlow AI Tutor.

You asked: "${userMessage}"

At your **${userLevel}** level, remember that consistency and active recall are the secrets to vocabulary mastery.
(Tip: When an administrator configures \`GEMINI_API_KEY\`, I will provide full dynamic interactive conversational practice, grammar comparisons, and customized exercises powered by Gemini 3.8 Flash!)`;
  }

  try {
    const systemPrompt = `You are WordFlow's friendly, pedagogical, and encouraging English Tutor.
The user is at CEFR Level: ${userLevel}.
${currentWord ? `They are currently studying or inquiring about the word: "${currentWord}".` : ''}

Guidelines:
1. Speak in accessible English matched to the user's level (${userLevel}).
2. Provide simple definitions, practical example sentences, and helpful contrast if they ask about differences between words.
3. If relevant, include translations in Russian or Uzbek when clarifying nuances.
4. Keep explanations concise, structured with bullet points, and actionable.
5. Conclude with a quick 1-sentence mini challenge or question for the user to try.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemPrompt}\n\nUser Question:\n${userMessage}`,
    });

    return response.text || 'I could not generate a response. Please try asking in a different way.';
  } catch (error) {
    console.error('Gemini AI Tutor Error:', error);
    return 'I apologize, the AI Tutor is temporarily experiencing high traffic. Please try asking again in a moment.';
  }
}
