import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const json = await req.json();
  const { action, data } = json;

  switch (action) {
    case 'generate_questions': {
      const { content, pages, difficulty } = data;
      
      const difficultyInstructions = {
        easy: 'Generate simple questions that test basic understanding and recall.',
        medium: 'Generate questions that require analysis and explanation.',
        hard: 'Generate complex questions that require synthesis, evaluation, and deep understanding.',
      };

      const prompt = `Based on the following content from pages ${pages.join(', ')} of a document:

${content}

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.medium}

Generate exactly 5 questions. For each question, also provide an ideal answer.

Format your response as JSON:
[
  {"text": "Question 1", "idealAnswer": "Answer 1"},
  {"text": "Question 2", "idealAnswer": "Answer 2"},
  {"text": "Question 3", "idealAnswer": "Answer 3"},
  {"text": "Question 4", "idealAnswer": "Answer 4"},
  {"text": "Question 5", "idealAnswer": "Answer 5"}
]

Respond ONLY with valid JSON, no additional text.`;

      const result = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
      });

      try {
        const text = result.text;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return Response.json({ questions });
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }

      return Response.json({
        questions: [
          { text: 'What is the main topic of the selected content?', idealAnswer: 'The main topic is...' },
          { text: 'Explain a key concept from the content.', idealAnswer: 'The key concept is...' },
          { text: 'What conclusions can be drawn from this content?', idealAnswer: 'The conclusions are...' },
          { text: 'Describe an important detail mentioned.', idealAnswer: 'The important detail is...' },
          { text: 'How does this content relate to the overall document?', idealAnswer: 'It relates by...' },
        ],
      });
    }

    case 'evaluate_answer': {
      const { userAnswer, idealAnswer, question } = data;

      const prompt = `You are an AI tutor evaluating a student's answer.

Question: ${question}

Student's Answer: ${userAnswer}

Ideal Answer: ${idealAnswer}

Evaluate the student's answer and provide:
1. A score from 0-10
2. Constructive feedback

Respond as JSON:
{"score": 7, "feedback": "Your answer covers the main points but could be more detailed..."}`;

      const result = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
      });

      try {
        const text = result.text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json({
            score: Math.min(10, Math.max(0, parsed.score)),
            feedback: parsed.feedback || 'Good attempt!',
          });
        }
      } catch (e) {
        console.error('Failed to parse evaluation:', e);
      }

      return Response.json({
        score: 5,
        feedback: 'Your answer has been submitted for review.',
      });
    }

    default:
      return Response.json({ error: 'Invalid action' }, { status: 400 });
  }
}
