export type QuizReturnDto = {
  quiz_id: string;
  auth_id: string;
  title: string;
  description?: string;
  created_at: number;
  num_questions: number;
  questions: {
    index: number;
    question: string;
    time_limit: number;
    answers: {
      index: number;
      answer: string;
      is_correct: boolean;
    }[];
  }[];
};
