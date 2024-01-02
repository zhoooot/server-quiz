import { z } from 'zod';

export const quizDto = z.object({
  quiz_id: z.string().optional(), // if there is no quiz_id, it will be generated
  auth_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  num_play_times: z.number().optional(),
  is_public: z.boolean(),
  created_at: z.number().optional(),
  questions: z.array(
    z.object({
      index: z.number(),
      question: z.string(),
      time_limit: z.number(),
      allow_powerups: z.boolean(),
      answers: z.array(
        z.object({
          index: z.number(),
          answer: z.string(),
          is_correct: z.boolean(),
        }),
      ),
    }),
  ),
});

export type QuizDto = z.infer<typeof quizDto>;
