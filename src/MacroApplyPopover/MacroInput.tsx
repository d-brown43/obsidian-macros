import MacroSingleApply from './MacroSingleApply';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const VariableRow = styled.div`
  margin-bottom: 0.5rem;
`;

type Props = {
  variableNames: string[];
  getValue: (variableName: string) => string;
  setValue: (variableName: string, value: string) => void;
  applyMacro: () => void;
};

const MacroInput = ({
  variableNames,
  getValue,
  setValue,
  applyMacro,
}: Props) => {
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    if (focusIndex === variableNames.length) {
      applyMacro();
    }
  }, [focusIndex]);

  const apply = () => setFocusIndex((prevIndex) => prevIndex + 1);

  return (
    <>
      {variableNames.map((variableName, i) => {
        const shouldFocus = focusIndex === i;
        return (
          <VariableRow key={variableName}>
            <MacroSingleApply
              placeholder={variableName}
              label={variableName}
              value={getValue(variableName)}
              setValue={(value) => setValue(variableName, value)}
              doFocus={shouldFocus}
              apply={apply}
              testId={`variable-input-${variableName}`}
            />
          </VariableRow>
        );
      })}
    </>
  );
};
export default MacroInput;
