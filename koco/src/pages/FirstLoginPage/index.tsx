import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DEFAULT_IMG from '@/assets/defaultProfileImage.svg';
import useInput from '@/hooks/useInput';
import useFileInput from '@/hooks/useFileInput';
import Button from '@/components/ui/Button';

export default function FirstLoginPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const { value: nickname, onChange: onChangeNickname } = useInput();
  const { value: statusMessage, onChange: onChangeStatusMessage } = useInput();
  const { file, preview, onChange: onChangeFile } = useFileInput();

  /* 유효성 검사 로직 */
  const nicknameErr = useMemo(() => {
    if (!nickname) return '닉네임을 입력해주세요.';
    if (/\s/.test(nickname)) return '띄어쓰기를 없애주세요.';
    if (nickname.length < 2 || nickname.length > 15)
      return '닉네임은 최소 2자, 최대 15글자까지 작성 가능합니다.';

    return null;
  }, [nickname]);

  const statusErr =
    statusMessage.length > 50 ? '상태메세지는 최대 50자까지 작성 가능합니다.' : null;

  const canSubmit = !nicknameErr && !statusErr && nickname;

  /* 제출 */
  const handleSubmit = () => {
    if (!canSubmit) return;

    // const form = new FormData();
    // if (file) form.append('profile', file);
    // form.append('nickname', nickname);
    // form.append('status', status);
    // await api.post('/users', form);
    console.log(file);
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
      {/* 프로필 이미지 */}
      <div className="relative">
        <img
          src={preview || DEFAULT_IMG}
          alt="profile"
          className="w-40 h-40 rounded-full object-cover bg-[#EFEFEF]"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute right-0 bottom-0 w-8 h-8 flex items-center justify-center
                     rounded-full bg-black text-white"
        >
          ✎
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={onChangeFile}
          className="hidden"
        />
      </div>

      {/* 닉네임 */}
      <label className="mt-6 mb-4 w-full max-w-md text-bold-14">닉네임</label>
      <input
        value={nickname}
        onChange={onChangeNickname}
        placeholder="닉네임을 입력해주세요"
        className="bg-input w-full max-w-md rounded-lg  py-3 px-4 outline-none text-sm"
      />

      <p className="text-text-error text-xs w-full max-w-md py-3 px-4 h-8">
        {nicknameErr && nicknameErr}
      </p>

      {/* 상태메시지 */}
      <label className="mt-4 mb-4 w-full max-w-md text-bold-14">상태 메시지 (선택)</label>
      <input
        value={statusMessage}
        onChange={onChangeStatusMessage}
        placeholder="상태메세지를 작성해주세요"
        className="bg-input w-full max-w-md rounded-lg py-3 px-4 outline-none text-sm "
      />
      <p className="text-text-error text-xs text-left h-8">{statusErr && statusErr}</p>

      {/* 가입 버튼 */}
      <Button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className={`mt-14 w-40 py-3 rounded-md text-white text-sm
          ${canSubmit ? 'bg-primary hover:brightness-90' : 'bg-primary-disabled cursor-not-allowed'}`}
      >
        가입하기
      </Button>
    </div>
  );
}
