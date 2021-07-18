import { useSelector } from 'react-redux';
import MacroInput from './MacroInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { Macro as MacroType } from '../types';
import { applyReplacements, identifyMacros } from '../utils';
import { getSelectedMacro } from '../redux';

const ApplyButton = styled(Button)``;

type Props = {
  applyMacro: (resolved: string) => void;
};

const MacroApply = ({ applyMacro }: Props) => {
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
      <ApplyButton
        type="button"
        onClick={apply}
        data-testid="confirm-variables"
      >
        Apply
      </ApplyButton>
    </div>
  );
};

export default MacroApply;
