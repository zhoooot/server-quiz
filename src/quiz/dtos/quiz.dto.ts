export type QuizReturnDto = {
  quiz_id: string;
  auth_id: string;
  title: string;
  description?: string;
  num_play_times: number;
  is_public: boolean;
  created_at: number;
  num_questions: number;
  has_draft: boolean;
  questions: {
    index: number;
    question: string;
    time_limit: number;
    allow_powerups: boolean;
    answers: {
      index: number;
      answer: string;
      is_correct: boolean;
    }[];
  }[];
};
