import { v4 as uuidv4 } from 'uuid';
import { Quiz } from 'src/entities/quiz.entity';
import { Collection } from '@mikro-orm/core';
import {Version} from 'src/entities/version.entity';
import {Question} from 'src/entities/question.entity';
import {Answer} from 'src/entities/answer.entity';

interface QuizFromGemini {
    auth_id: string;
    title: string;
    description?: string;
    num_play_times: string;
    num_questions: string;
    questions: {
        index: string;
        question: string;
        time_limit: string;
        allow_powerups: string;
        answers: {
            index: string;
            answer: string;
            is_correct: string;
        }[];
    }[];
}

export { QuizFromGemini}
export class QuizAdapter {
    private quizFromGemini: QuizFromGemini;

    constructor(jsonstring: string) {
        this.quizFromGemini = JSON.parse(jsonstring) as QuizFromGemini;
    }

    private parseBooleanString(value: string): boolean {
        if (value === 'true') {
            return true;
        }
        return false;

    }

    public adaptToQuizEntity(): Quiz {
        const quiz = new Quiz();
        const version = new Version();

        quiz.quiz_id = uuidv4(); // Assuming quiz_id is generated using uuid
        quiz.auth_id = this.quizFromGemini.auth_id;
        quiz.created_at = new Date();
        quiz.num_play_times = parseInt(this.quizFromGemini.num_play_times);
        quiz.published = version;
        for (let question of this.quizFromGemini.questions) {
            const newQuestion = new Question();
            newQuestion.version = version;
            newQuestion.question_id = uuidv4(); // Assuming question_id is generated using uuid
            newQuestion.index = parseInt(question.index);
            newQuestion.question = question.question;
            newQuestion.time = parseInt(question.time_limit);
            newQuestion.allow_powerups = this.parseBooleanString(question.allow_powerups);
            newQuestion.answers = new Collection<Answer>(newQuestion);
            for (let newAnswer of question.answers) {
                const answer = new Answer();
                answer.question = newQuestion;
                answer.index = parseInt(newAnswer.index);
                answer.answer = newAnswer.answer;
                answer.is_correct = this.parseBooleanString(newAnswer.is_correct);
                newQuestion.answers.add(answer);
                
            }
            quiz.published.questions.add(newQuestion);
        }

        // print the quiz.published.questions
        console.log(quiz.published.questions);

        console.log('okay');
        
        return quiz;
    }
}
