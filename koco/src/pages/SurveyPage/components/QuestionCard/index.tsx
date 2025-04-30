// components/QuestionCard.tsx
import Card from '@/components/ui/Card';
import React from 'react';

interface IQuestionCardProps {
  problemId: number;
  title: string;
  solvedState: boolean | null;
  difficultyState: string;
  onChange: (problemId: number, data: { isSolved?: boolean; difficultyLevel?: string }) => void;
}

const QuestionCard: React.FC<IQuestionCardProps> = ({
  problemId,
  title,
  solvedState,
  difficultyState,
  onChange,
}) => {
  const solvedOptions = [
    { label: '못 풀었어요', value: false },
    { label: '풀었어요', value: true },
  ];

  const difficultyOptions = [
    { label: '쉬웠어요', icon: '⭕' },
    { label: '적당했어요', icon: '△' },
    { label: '어려웠어요', icon: '❌' },
  ];

  return (
    <Card className="p-7 mb-4">
      <p className="text-xl mb-4 font-black">
        문제 {problemId} {title}
      </p>
      <div className="mt-4">
        <p>{problemId}번 문제 해결 하셨나요?</p>
        <div className="mt-4 flex gap-2">
          {solvedOptions.map(option => (
            <button
              key={option.label}
              onClick={() => onChange(problemId, { isSolved: option.value })}
              className={`flex-1 py-3 rounded-md text-sm font-semibold
              ${
                solvedState === option.value
                  ? 'bg-secondary text-white'
                  : 'bg-border text-text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="mb-2">{problemId}번 문제 난이도는 어땠나요?</p>
        <div className="flex gap-2 mt-4">
          {difficultyOptions.map(option => (
            <button
              key={option.label}
              onClick={() => onChange(problemId, { difficultyLevel: option.label })}
              className={`flex flex-col items-center justify-center flex-1 h-20 rounded-md border font-semibold text-regular-14
              ${
                difficultyState === option.label
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white border-border text-text-primary'
              }`}
            >
              <div className="mb-1 text-xl">{option.icon}</div>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
