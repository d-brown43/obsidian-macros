import { useEffect, useState } from 'react';
import MacroSingleApple from './MacroSingleApply';
import styled from 'styled-components';

const VariableRow = styled.div`
  margin-bottom: 0.5rem;
`;

type Props = {
  variableNames: string[];
  getValue: (variableName: string) => string;
  setValue: (variableName: string, value: string) => void;
};

const MacroInput = ({ variableNames, getValue, setValue }: Props) => {
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    setHasFocused(true);
  }, []);

  return (
    <>
      {variableNames.map((variableName, i) => (
        <VariableRow key={variableName}>
          <MacroSingleApple
            placeholder={variableName}
            value={getValue(variableName)}
            setValue={(value) => setValue(variableName, value)}
            doFocus={!hasFocused && i === 0}
          />
        </VariableRow>
      ))}
    </>
  );
};

export default MacroInput;
