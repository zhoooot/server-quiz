export type QuizReturnDto = {
  quiz_id: string;
  auth_id: string;
  title: string;
  description?: string;
  created_at: number;
  num_questions: number;
  image?: string;
  questions: {
    index: number;
    question: string;
    time_limit: number;
    image?: string;
    answers: {
      index: number;
      answer: string;
      is_correct: boolean;
    }[];
  }[];
};
