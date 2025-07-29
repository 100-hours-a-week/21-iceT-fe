// src/features/post/components/PostForm.tsx
import useAlgorithmDropdown from '@/shared/hooks/useAlgorithmDropdown';
import useInput from '@/shared/hooks/useInput';
import useSubmitButton from '@/shared/hooks/useSubmitButton';
import AlgorithmDropdown from '@/shared/ui/AlgorithmDropdown';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { convertKoreanToEnglish } from '@/shared/utils/doMappingCategories';
import MDEditor from '@uiw/react-md-editor';
import { useMemo, useState } from 'react';
import { convertEnglishToKorean } from '@/shared/utils/doMappingCategories';
import { Category } from '../types/Category';
import Helpertext from '@/shared/ui/Helpertext';

export type Post = {
  problemNumber: number;
  title: string;
  content: string;
  category: string[];
};

export interface IPostFormData {
  post: Post;
}

export type PostFormInitialData = {
  problemNumber: number;
  title: string;
  content: string;
  category: Category[];
};

export interface IPostFormInitialData {
  post: PostFormInitialData;
}

interface IPostFormProps {
  initialData?: IPostFormInitialData;
  onSubmit: (post: IPostFormData) => Promise<void> | void;
  submitButtonText: string;
  isLoading?: boolean;
}

const PostForm = ({
  initialData,
  onSubmit,
  submitButtonText,
  isLoading = false,
}: IPostFormProps) => {
  const [content, setContent] = useState(initialData?.post.content || '');
  const { value: title, onChange: titleOnChange } = useInput(initialData?.post.title || '');
  const { value: problemNumber, onChange: problemNumberOnChange } = useInput(
    initialData?.post.problemNumber?.toString() || ''
  );
  const categoryNames = initialData?.post.category
    ? Object.values(initialData.post.category).map(item => item.categoryName)
    : [];

  const { selectedAlgorithmTypes, handleToggleAlgorithmType, handleClearAllTypes } =
    useAlgorithmDropdown(convertEnglishToKorean(categoryNames));

  // 문제 번호 유효성 검사
  const problemNumberErr = useMemo(() => {
    if (!problemNumber) return '문제 번호를 입력해주세요.';
    if (problemNumber.length < 1 || problemNumber.length > 6) {
      return '문제 번호는 1-6자리 숫자여야 합니다.';
    }
    if (!/^\d+$/.test(problemNumber)) {
      return '숫자만 입력 가능합니다.';
    }

    return null;
  }, [problemNumber]);

  // 제목 유효성 검사
  const titleErr = useMemo(() => {
    if (!title) return '제목을 입력해주세요';
    if (title.length < 1 || title.length > 30) {
      return '제목은 1-30자까지 입력 가능합니다.';
    }

    return null;
  }, [title]);

  // 마크다운 유효성 검사
  const markdownErr = useMemo(() => {
    if (!content) return '내용을 입력해주세요';
    if (content.length < 1 || content.length > 10000)
      return '게시글은 최대 10,000자까지 작성 가능합니다';

    return null;
  }, [content]);

  const submitErr = problemNumberErr || titleErr || markdownErr;
  const { isDisabled, buttonText } = useSubmitButton({
    submitErr,
    isLoading,
    submitText: submitButtonText,
    loadingText: '처리 중...',
  });

  const handleSubmit = async () => {
    if (submitErr) return;

    const category = convertKoreanToEnglish(selectedAlgorithmTypes);
    const postData = {
      post: {
        problemNumber: Number(problemNumber),
        title,
        content,
        category: category,
      },
    };

    await onSubmit(postData);
  };

  return (
    <div className="p-4">
      <div className="flex space-y-2 gap-4 items-center">
        <label className="text-sm font-medium text-text-primary">문제 번호</label>
        <Input value={problemNumber} onChange={problemNumberOnChange} className="w-[100px]" />
      </div>

      <AlgorithmDropdown
        selectedTypes={selectedAlgorithmTypes}
        onToggleType={handleToggleAlgorithmType}
        onClearAll={handleClearAllTypes}
      />

      <div className="mt-4">
        <label className="mt-2">제목</label>
        <Input value={title} onChange={titleOnChange} className="w-full" />
        <div className="h-4 mt-1">{titleErr && <Helpertext text={titleErr} />}</div>
      </div>

      <div className="mt-4">
        <label>내용</label>
        <MDEditor
          value={content}
          onChange={(value: string | undefined) => setContent(value || '')}
          height={600}
        />
      </div>
      <div className="h-4 mt-1">{markdownErr && <Helpertext text={markdownErr} />}</div>

      <div className="mt-6 text-center">
        <Button onClick={handleSubmit} disabled={isDisabled}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PostForm;
