import { useState } from 'react';

const useFileInput = () => {
  const [preview, setPreview] = useState<string>(''); // 미리보기 URL
  const [file, setFile] = useState<File | null>(null);

  /* 파일 업로드 */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (!chosen) {
      // 선택 안 하고 닫으면 → 이미지 제거
      setFile(null);
      setPreview('');

      return;
    }
    if (chosen.size > 5_000_000) {
      alert('5 MB 이하 이미지만 업로드 가능합니다.');
      e.target.value = '';

      return;
    }
    if (!/\/(jpe?g|png|gif)$/i.test(chosen.type)) {
      alert('jpg, jpeg, png, gif 형식만 가능합니다.');
      e.target.value = '';

      return;
    }
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  return { preview, file, onChange };
};

export default useFileInput;
