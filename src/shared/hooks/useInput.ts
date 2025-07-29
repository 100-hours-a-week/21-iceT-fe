import { useState } from 'react';

const useInput = (initialValue = '') => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const setInputValue = (value: string) => {
    setValue(value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return { value, onChange, reset, setInputValue };
};

export default useInput;
