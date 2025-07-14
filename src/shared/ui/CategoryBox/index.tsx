import { convertEnglishCategoryToKorean } from '@/shared/utils/doMappingCategories';

interface ICategoryBox {
  name: string;
}

export const CategoryBox = ({ name }: ICategoryBox) => {
  return (
    <div
      key={name}
      className="flex items-center gap-1 bg-secondary text-white px-3 py-1 rounded-full text-sm whitespace-nowrap"
    >
      <span> {convertEnglishCategoryToKorean(name)}</span>
    </div>
  );
};
