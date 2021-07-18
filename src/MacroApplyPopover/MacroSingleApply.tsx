import { useFocus } from './hooks';
import React from 'react';

type Props = {
  value: string;
  setValue: (value: string) => void;
  doFocus: boolean;
  placeholder: string;
  apply: () => void;
  testId: string;
};

const MacroSingleApply = ({
  value,
  setValue,
  doFocus,
  placeholder,
  apply,
  testId,
}: Props) => {
  const ref = useFocus<HTMLInputElement>(doFocus);

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      apply();
    }
  };

  return (
    <input
      data-testid={testId}
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeydown}
    />
  );
};

export default MacroSingleApply;
