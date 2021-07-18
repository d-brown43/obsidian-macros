import { useFocus } from './hooks';
import React from "react";

type Props = {
  value: string;
  setValue: (value: string) => void;
  doFocus: boolean;
  placeholder: string;
  apply: () => void;
};

const MacroSingleApply = ({ value, setValue, doFocus, placeholder, apply }: Props) => {
  const ref = useFocus<HTMLInputElement>(doFocus);

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      apply();
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={onKeydown}
    />
  );
};

export default MacroSingleApply;
