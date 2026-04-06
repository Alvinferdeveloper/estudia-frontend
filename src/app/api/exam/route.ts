import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export type QuestionType = 'open' | 'multiple_choice' | 'true_false' | 'fill_blank' | 'mixed';

export async function POST(req: Request) {
  const json = await req.json();
  const { action, data } = json;

  switch (action) {
    case 'generate_questions': {
      const { content, pages, difficulty, questionType, numQuestions = 5 } = data;
      
      const difficultyInstructions = {
        easy: 'Generate simple questions that test basic understanding and recall.',
        medium: 'Generate questions that require analysis and explanation.',
        hard: 'Generate complex questions that require synthesis, evaluation, and deep understanding.',
      };

      if (questionType === 'mixed') {
        const types = ['open', 'multiple_choice', 'true_false', 'fill_blank'];
        const questionsPerType = Math.floor(numQuestions / types.length);
        const remainder = numQuestions % types.length;
        
        let allQuestions: any[] = [];
        
        for (let i = 0; i < types.length; i++) {
          const type = types[i] as Exclude<QuestionType, 'mixed'>;
          const count = questionsPerType + (i < remainder ? 1 : 0);
          
          if (count === 0) continue;

          const typePrompts: Record<Exclude<QuestionType, 'mixed'>, string> = {
            open: 'Generate open-ended questions where the student must provide a detailed written answer.',
            multiple_choice: 'Generate multiple choice questions with 4 options (A, B, C, D). One option should be correct, others plausible but wrong. Include the correctAnswer field.',
            true_false: 'Generate true/false questions where students answer with "true" or "false". Include the correctAnswer field.',
            fill_blank: 'Generate fill-in-the-blank questions where students complete a sentence or answer with a short phrase. Include the correctAnswer field.',
          };

          const prompt = `Based on the following content from pages ${pages.join(', ')} of a document:

${content}

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.medium}

${typePrompts[type]}

Generate exactly ${count} ${type} questions.

${type === 'multiple_choice' ? `Format as JSON:
[
  {"text": "Question text?", "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "correctAnswer": "A", "type": "${type}"}
]` : type === 'true_false' ? `Format as JSON:
[
  {"text": "Statement to evaluate as true or false", "correctAnswer": "true", "type": "${type}"}
]` : type === 'fill_blank' ? `Format as JSON:
[
  {"text": "The capital of France is ___.", "correctAnswer": "Paris", "type": "${type}"}
]` : `Format as JSON:
[
  {"text": "Question 1", "idealAnswer": "Answer 1", "type": "${type}"}
]`}

Respond ONLY with valid JSON, no additional text.`;

          try {
            const result = await generateText({
              model: google('gemini-2.5-flash'),
              prompt,
            });
            
            const text = result.text;
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              allQuestions = [...allQuestions, ...parsed];
            }
          } catch (e) {
            console.error(`Failed to generate ${type} questions:`, e);
          }
        }

        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        return Response.json({ 
          questions: shuffled.map((q, i) => ({
            ...q,
            type: q.type || types[i % types.length],
            idealAnswer: q.correctAnswer || q.idealAnswer || '',
          }))
        });
      }

      const typePrompts: Record<Exclude<QuestionType, 'mixed'>, string> = {
        open: 'Generate open-ended questions where the student must provide a detailed written answer.',
        multiple_choice: 'Generate multiple choice questions with 4 options (A, B, C, D). One option should be correct, others plausible but wrong. Include the correctAnswer field.',
        true_false: 'Generate true/false questions where students answer with "true" or "false". Include the correctAnswer field.',
        fill_blank: 'Generate fill-in-the-blank questions where students complete a sentence or answer with a short phrase. Include the correctAnswer field.',
      };

      const questionTypeInstructions = typePrompts[questionType as Exclude<QuestionType, 'mixed'>] || typePrompts.open;
      const showCorrectAnswer = questionType !== 'open';

      const prompt = `Based on the following content from pages ${pages.join(', ')} of a document:

${content}

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.medium}

${questionTypeInstructions}

Generate exactly ${numQuestions} questions.

${questionType === 'multiple_choice' ? `Format as JSON:
[
  {"text": "Question text?", "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "correctAnswer": "A"}
]` : questionType === 'true_false' ? `Format as JSON:
[
  {"text": "Statement to evaluate as true or false", "correctAnswer": "true"}
]` : questionType === 'fill_blank' ? `Format as JSON:
[
  {"text": "The capital of France is ___.", "correctAnswer": "Paris"}
]` : `Format as JSON:
[
  {"text": "Question 1", "idealAnswer": "Answer 1"}
]`}

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
          const actualType = questionType === 'mixed' ? undefined : questionType;
          return Response.json({ 
            questions: questions.map((q: any) => ({
              ...q,
              type: q.type || actualType || 'open',
              idealAnswer: q.correctAnswer || q.idealAnswer || '',
            })) 
          });
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }

      const fallbackQuestions = generateFallbackQuestions(questionType as QuestionType, numQuestions);
      return Response.json({ questions: fallbackQuestions });
    }

    case 'evaluate_answer': {
      const { userAnswer, idealAnswer, question, questionType } = data;

      const isClosedType = ['multiple_choice', 'true_false', 'fill_blank'].includes(questionType);
      
      if (isClosedType) {
        const isCorrect = userAnswer.toLowerCase().trim() === idealAnswer.toLowerCase().trim();
        return Response.json({
          score: isCorrect ? 10 : 0,
          feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${idealAnswer}`,
        });
      }

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

function generateFallbackQuestions(type: QuestionType, count: number): any[] {
  if (type === 'mixed') {
    const types: Exclude<QuestionType, 'mixed'>[] = ['open', 'multiple_choice', 'true_false', 'fill_blank'];
    return Array.from({ length: count }, (_, i) => {
      const questionType = types[i % types.length];
      return generateSingleFallback(questionType, i + 1);
    });
  }
  return Array.from({ length: count }, (_, i) => generateSingleFallback(type as Exclude<QuestionType, 'mixed'>, i + 1));
}

function generateSingleFallback(type: Exclude<QuestionType, 'mixed'>, index: number): any {
  if (type === 'multiple_choice') {
    return {
      text: `Sample question ${index}?`,
      options: ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
      correctAnswer: 'A',
      type,
      idealAnswer: 'A',
    };
  }
  if (type === 'true_false') {
    return {
      text: `Statement ${index} for evaluation`,
      correctAnswer: index % 2 === 0 ? 'true' : 'false',
      type,
      idealAnswer: index % 2 === 0 ? 'true' : 'false',
    };
  }
  if (type === 'fill_blank') {
    return {
      text: `Complete: The answer to question ${index} is ___.`,
      correctAnswer: 'answer',
      type,
      idealAnswer: 'answer',
    };
  }
  return {
    text: `Sample question ${index}`,
    idealAnswer: 'Sample answer',
    type: 'open',
  };
}
