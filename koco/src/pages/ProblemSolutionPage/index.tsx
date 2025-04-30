import BottomNav from '@/components/layout/BottomNav';
import PageHeader from '@/components/layout/PageHeader';
import ProblemDetailSection from './components/ProblemDetailSection';
import ProblemSolutionSection from './components/ProblemSolutionSection';
import MOCK_SOLUTION_DATA from '@/temp/mock/solution.json';

const ProblemSolutionPage = () => {
  return (
    <div>
      <PageHeader title="문제 해설" />
      <div className=" shadow-md">
        <ProblemDetailSection />
        <ProblemSolutionSection
          explanation={MOCK_SOLUTION_DATA.explanation}
          solutionCode={MOCK_SOLUTION_DATA.solutionCode}
        />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProblemSolutionPage;
