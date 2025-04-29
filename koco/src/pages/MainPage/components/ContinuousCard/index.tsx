import Card from '@/components/ui/Card';
import ContinuousIc from '@/assets/continuousIc.svg';

const ContinuousDayCard = () => (
  <Card className="p-4 flex items-center justify-around">
    <div className="flex items-center gap-2">
      <img src={ContinuousIc} />
      <p className="text-regular-14 text-text-secondary">연속 학습일</p>
    </div>
    <p className="text-bold-16 text-text-primary">3일</p>
  </Card>
);

export default ContinuousDayCard;
