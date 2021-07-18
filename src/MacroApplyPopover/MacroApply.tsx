import { useSelector } from 'react-redux';
import MacroInput from './MacroInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../components';
import { Macro as MacroType } from '../types';
import { applyReplacements, identifyMacros } from '../utils';
import { getSelectedMacro } from '../redux';
import styled from 'styled-components';

const BackButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0.5rem;
  padding: 0;
`;

type Props = {
  applyMacro: (resolved: string) => void;
  back: () => void;
};

const MacroApply = ({ applyMacro, back }: Props) => {
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const macro = useSelector(getSelectedMacro) as MacroType;

  const identifiedVariables = useMemo(
    () => identifyMacros(macro.text),
    [macro.text]
  );

  const getContent = (variableName: string) => content[variableName] || '';

  const apply = useCallback(() => {
    applyMacro(applyReplacements(identifiedVariables, getContent, macro.text));
  }, [applyMacro, identifiedVariables, content, macro.text]);

  useEffect(() => {
    if (identifiedVariables.variableNames.length === 0) {
      apply();
    }
  }, [identifiedVariables.variableNames.length, apply]);

  return (
    <div>
      <BackButton type="button" onClick={back}>
        &#8592;
      </BackButton>
      <MacroInput
        variableNames={identifiedVariables.variableNames}
        getValue={getContent}
        setValue={(variableName, value) =>
          setContent((prevState) => ({
            ...prevState,
            [variableName]: value,
          }))
        }
        applyMacro={apply}
      />
      <Button type="button" onClick={apply} data-testid="confirm-variables">
        Apply
      </Button>
    </div>
  );
};

export default MacroApply;
