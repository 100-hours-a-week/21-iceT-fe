import PageHeader from '@/components/layout/PageHeader';
import Calendar from './components/Calendar';
import ProblemItem from './components/ProblemItem';
import MOCK_PROBLEM_DATA from '@/temp/mock/dateProblem.json';

const ProblemListPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="문제 해설" />
      <Calendar />
      <hr className="border-border" />
      {MOCK_PROBLEM_DATA.problems.map(problem => (
        <ProblemItem
          key={problem.problemId}
          problemId={problem.problemId}
          title={problem.tier}
          tier={problem.tier}
        />
      ))}
    </div>
  );
};

export default ProblemListPage;
