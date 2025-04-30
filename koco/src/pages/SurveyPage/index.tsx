// pages/SurveyPage.tsx
import React, { useEffect, useState } from 'react';
import QuestionCard from './components/QuestionCard';
import MOCK_DATA from '@/temp/mock/dateProblem.json';
import Button from '@/components/ui/Button';
import backArrowIc from '@/assets/backArrowIc.svg';
import { useNavigate } from 'react-router-dom';
//import { useGetProblemList } from '@/hooks/useGetProblemList';

interface ISurveyData {
  problemId: number;
  isSolved: boolean | null;
  difficultyLevel: string;
}

type Problem = {
  problemId: number;
  title: string;
  tier: string;
};

export interface IProblemSetResponse {
  date: string;
  problemSetId: number;
  isAnswered: boolean;
  problems: Problem[];
}

const SurveyPage = () => {
  //const today = new Date().toISOString().split('T')[0];
  //const { data: problems = [], isLoading } = useGetProblemList(today);
  const problems = MOCK_DATA.problems;
  const [surveyData, setSurveyData] = useState<ISurveyData[]>([]);

  const navigate = useNavigate();

  const allAnswered = surveyData.every(
    item => item.isSolved !== null && item.difficultyLevel !== ''
  );

  const handleQuestionChange = (
    problemId: number,
    data: { isSolved?: boolean; difficultyLevel?: string }
  ) => {
    setSurveyData(prev =>
      prev.map(item => (item.problemId === problemId ? { ...item, ...data } : item))
    );
  };

  const handleSubmitSurvey = () => {
    console.log(surveyData);
    navigate('/problems');
  };

  useEffect(() => {
    if (problems.length > 0) {
      const initialSurveyData = problems.map((problem: Problem) => ({
        problemId: problem.problemId,
        isSolved: null,
        difficultyLevel: '',
      }));
      setSurveyData(initialSurveyData);
    }
  }, [problems]);

  return (
    <div className="bg-background min-h-screen px-4 py-6">
      <div className="flex gap-6 mb-10">
        <img src={backArrowIc} onClick={() => navigate(-1)} />
        <h1 className="text-xl mb-4">문제 해설</h1>
      </div>

      {problems.map((problem: Problem) => (
        <QuestionCard
          key={problem.problemId}
          problemId={problem.problemId}
          title={problem.title}
          onChange={handleQuestionChange}
          solvedState={surveyData.find(d => d.problemId === problem.problemId)?.isSolved ?? null}
          difficultyState={
            surveyData.find(d => d.problemId === problem.problemId)?.difficultyLevel ?? ''
          }
        />
      ))}

      <Button className="mt-6 w-full" disabled={!allAnswered} onClick={handleSubmitSurvey}>
        오늘의 해설집 확인하기
      </Button>
    </div>
  );
};

export default SurveyPage;
