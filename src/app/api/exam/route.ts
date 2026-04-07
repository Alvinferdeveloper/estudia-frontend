import { generateText } from 'ai';
import { QuestionType, buildGenerateQuestionsPrompt, buildEvaluateAnswerPrompt, EXAM_ACTIONS } from '@/app/api/exam/prompts/buildPrompt';
import { generateFallbackQuestions } from '@/app/api/exam/prompts/fallbacks';
import { AI_MODELS } from '@/app/api/lib/ai/models';

export type { QuestionType } from './prompts/buildPrompt';

const USE_FALLBACK_ONLY = process.env.USE_FALLBACK_ONLY === 'true';

export async function POST(req: Request) {
  const json = await req.json();
  const { action, data } = json;

  switch (action) {
    case EXAM_ACTIONS.GENERATE_QUESTIONS: {
      const { content, pages, difficulty, questionType, numQuestions = 5 } = data;

      if (questionType === 'mixed') {
        if (USE_FALLBACK_ONLY) {
          const fallback = generateFallbackQuestions('mixed', numQuestions);
          return Response.json({ questions: fallback });
        }

        const types = ['open', 'multiple_choice', 'true_false', 'fill_blank'];
        const questionsPerType = Math.floor(numQuestions / types.length);
        const remainder = numQuestions % types.length;

        let allQuestions: any[] = [];

        for (let i = 0; i < types.length; i++) {
          const type = types[i] as Exclude<QuestionType, 'mixed'>;
          const count = questionsPerType + (i < remainder ? 1 : 0);

          if (count === 0) continue;

          const prompt = buildGenerateQuestionsPrompt({
            content,
            pages,
            difficulty,
            type,
            count
          });

          try {
            const result = await generateText({
              model: AI_MODELS.exam,
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

      if (USE_FALLBACK_ONLY) {
        const fallback = generateFallbackQuestions(questionType as QuestionType, numQuestions);
        return Response.json({ questions: fallback });
      }

      const prompt = buildGenerateQuestionsPrompt({
        content,
        pages,
        difficulty,
        type: questionType as Exclude<QuestionType, 'mixed'>,
        count: numQuestions
      });

      const result = await generateText({
        model: AI_MODELS.exam,
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

    case EXAM_ACTIONS.EVALUATE_ANSWER: {
      const { userAnswer, idealAnswer, question, questionType } = data;

      const isClosedType = ['multiple_choice', 'true_false', 'fill_blank'].includes(questionType);

      if (isClosedType) {
        const isCorrect = userAnswer.toLowerCase().trim() === idealAnswer.toLowerCase().trim();
        return Response.json({
          score: isCorrect ? 10 : 0,
          feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${idealAnswer}`,
        });
      }

      if (USE_FALLBACK_ONLY) {
        return Response.json({
          score: 5,
          feedback: 'Dev mode: Using fallback evaluation. In production, this would be evaluated by AI.',
        });
      }

      const prompt = buildEvaluateAnswerPrompt({
        question,
        userAnswer,
        idealAnswer,
      });

      const result = await generateText({
        model: AI_MODELS.exam,
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
