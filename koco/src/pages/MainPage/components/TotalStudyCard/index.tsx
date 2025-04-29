import Card from '@/components/ui/Card';

const TotalStudyCard = () => (
  <Card className="p-4 flex justify-between">
    <p className="text-text-primary text-bold-16">나의 공부량</p>
    <div className="w-80 h-40 bg-border rounded-md flex items-center justify-center text-xs text-text-disabled">
      차트 ..
    </div>
  </Card>
);

export default TotalStudyCard;
