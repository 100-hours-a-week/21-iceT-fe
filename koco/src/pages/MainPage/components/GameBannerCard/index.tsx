import Card from '@/components/ui/Card';
import ChunsikImage from '@/assets/chunsikImage.png';

const GameBannerCard = () => (
  <Card className="flex items-center bg-primary text-white p-4 justify-between">
    <div>
      <p className="text-bold-14">춘식이 키우기🍼</p>
      <p className="text-regular-14">열심히 코딩테스트를 풀며 춘식이를 키워봐요</p>
    </div>
    <div className="w-16 h-16 flex-shrink-0">
      <img src={ChunsikImage} />
    </div>
  </Card>
);

export default GameBannerCard;
