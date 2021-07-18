import { useFocus } from './hooks';
import React from 'react';
import styled from "styled-components";

const LabelText = styled.div`
  padding-left: 0.15rem;
`;

type Props = {
  value: string;
  setValue: (value: string) => void;
  doFocus: boolean;
  placeholder: string;
  label: string;
  apply: () => void;
  testId: string;
};

const MacroSingleApply = ({
  value,
  setValue,
  doFocus,
  label,
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
    <label>
      <LabelText>{label}</LabelText>
      <input
        data-testid={testId}
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeydown}
      />
    </label>
  );
};

export default MacroSingleApply;
