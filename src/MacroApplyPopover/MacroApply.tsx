import { useSelector } from 'react-redux';
import MacroInput from './MacroInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { Macro as MacroType } from '../types';
import {
  applyReplacements,
  identifyVariables,
} from '../utils/identifyVariables';
import { getMacro } from '../redux/macros';

const ApplyButton = styled(Button)``;

type Props = {
  selectedMacroId: MacroType['id'];
  applyMacro: (resolved: string) => void;
};

const MacroApply = ({ selectedMacroId, applyMacro }: Props) => {
  const [content, setContent] = useState<{ [key: string]: string }>({});

  const macro = useSelector(
    useMemo(() => getMacro(selectedMacroId), [selectedMacroId])
  ) as MacroType;

  const identifiedVariables = useMemo(
    () => identifyVariables(macro.text),
    [macro.text]
  );

  const getContent = (variableName: string) => content[variableName] || '';

  const apply = useCallback(() => {
    applyMacro(applyReplacements(identifiedVariables, content, macro.text));
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
      <ApplyButton type="button" onClick={apply}>
        Apply
      </ApplyButton>
    </div>
  );
};

export default MacroApply;
