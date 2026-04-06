import { QuestionType as QT } from '@/app/api/exam/prompts/buildPrompt';

export function generateFallbackQuestions(type: QT, count: number): any[] {
  if (type === 'mixed') {
    const types: Exclude<QT, 'mixed'>[] = ['open', 'multiple_choice', 'true_false', 'fill_blank'];
    return Array.from({ length: count }, (_, i) => {
      const questionType = types[i % types.length];
      return generateSingleFallback(questionType, i + 1);
    });
  }
  return Array.from({ length: count }, (_, i) => generateSingleFallback(type as Exclude<QT, 'mixed'>, i + 1));
}

function generateSingleFallback(type: Exclude<QT, 'mixed'>, index: number): any {
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
