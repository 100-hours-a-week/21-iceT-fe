import { formatBaekjoonTier } from '@/features/problemSet/utils/convertTier';
import { getTierColor } from '@/shared/utils/getTierColor';
import { getTierRank } from '@/shared/utils/getTierRank';

interface IProblemItemProps {
  problemNumber: number;
  title: string;
  tier: string;
  onClick: () => void;
}

const ProblemItem = ({ problemNumber, title, tier, onClick }: IProblemItemProps) => {
  const tierWithSublevel = formatBaekjoonTier(tier);
  const tierRank = getTierRank(tierWithSublevel);
  const tierColor = getTierColor(tierRank);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100 rounded-md"
    >
      <div className="flex items-center gap-2">
        <div
          className="text-white text-xs px-2 py-1 rounded-md font-bold"
          style={{ backgroundColor: tierColor }}
        >
          {tierWithSublevel}
        </div>
        {/* <div className={`${tierClassName} text-white text-xs px-2 py-1 rounded-md font-bold`}>
          {tier}
        </div> */}
        <div className="flex flex-col">
          <span className="font-bold text-sm">#{problemNumber}번</span>
          <span className="text-sm">{title}</span>
        </div>
      </div>
      <span className="text-gray-400 text-xl">{'>'}</span>
    </div>
  );
};

export default ProblemItem;
