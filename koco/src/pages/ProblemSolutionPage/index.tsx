import BottomNav from '@/components/layout/BottomNav';
import PageHeader from '@/components/layout/PageHeader';
import ProblemDetailSection from './components/ProblemDetailSection';

const ProblemSolutionPage = () => {
  return (
    <div>
      <PageHeader title="문제 해설" />
      <div className="flex justify-between items-center text-sm shadow-md">
        <ProblemDetailSection />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProblemSolutionPage;
