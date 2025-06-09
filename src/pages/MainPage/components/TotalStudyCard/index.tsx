import Card from '@/components/ui/Card';
import RadarChart from './components/RadarChart';

interface IStudyStat {
  categoryId: number;
  categoryName: string;
  correctRate: number;
}

interface ITotalStudyCardProps {
  studyStats: IStudyStat[];
}

const TotalStudyCard = ({ studyStats }: ITotalStudyCardProps) => (
  <Card className="p-4 flex justify-between">
    <p className="text-text-primary text-md">나의 공부량</p>
    <div className="w-100 h-60 rounded-md flex items-center justify-center text-xs text-text-disabled">
      {studyStats.length > 0 ? <RadarChart studyStats={studyStats} /> : <p>풀이 기록이 없습니다</p>}
    </div>
  </Card>
);

export default TotalStudyCard;
