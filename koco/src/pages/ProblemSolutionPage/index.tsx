import BottomNav from '@/components/layout/BottomNav';
import PageHeader from '@/components/layout/PageHeader';
import ProblemDetailSection from './components/ProblemDetailSection';
import ProblemSolutionSection from './components/ProblemSolutionSection';

const ProblemSolutionPage = () => {
  return (
    <div>
      <PageHeader title="문제 해설" />
      <div className=" shadow-md">
        <ProblemDetailSection />
        <ProblemSolutionSection />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProblemSolutionPage;
