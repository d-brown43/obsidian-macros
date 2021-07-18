import { useSelector } from 'react-redux';
import MacroInput from './MacroInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../components';
import { Macro as MacroType } from '../types';
import { applyReplacements, identifyMacros } from '../utils';
import { getSelectedMacro } from '../redux';
import styled from 'styled-components';
import ApplyPreview from './ApplyPreview';

const BackButton = styled(Button)`
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  padding: 0;
`;

const ApplyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

type Props = {
  applyMacro: (resolved: string) => void;
  back: () => void;
  renderIntoTitle: (element: JSX.Element) => JSX.Element;
};

const MacroApply = ({ applyMacro, back, renderIntoTitle }: Props) => {
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const macro = useSelector(getSelectedMacro) as MacroType;

  const identifiedVariables = useMemo(
    () => identifyMacros(macro.text),
    [macro.text]
  );

  const getContent = useCallback(
    (variableName: string) => content[variableName] || '',
    [content]
  );

  const doReplacements = useCallback(() => {
    return applyReplacements(identifiedVariables, getContent, macro.text);
  }, [identifiedVariables, getContent, macro.text]);

  const doTentativeReplacements = useCallback(() => {
    const variablesWithValues = identifiedVariables.variableNames.filter((v) =>
      getContent(v)
    );
    const artefacts = identifiedVariables.artefacts.filter((a) => {
      return variablesWithValues.some((v) => a.indexOf(v) !== -1);
    });
    return applyReplacements(
      { artefacts, variableNames: variablesWithValues },
      getContent,
      macro.text
    );
  }, [identifiedVariables, getContent, macro.text]);

  const apply = useCallback(() => {
    applyMacro(doReplacements());
  }, [applyMacro, doReplacements]);

  useEffect(() => {
    if (identifiedVariables.variableNames.length === 0) {
      apply();
    }
  }, [identifiedVariables.variableNames.length, apply]);

  return (
    <ApplyContainer>
      <BackButton type="button" onClick={back}>
        &#8592;
      </BackButton>
      {renderIntoTitle(
        <ApplyPreview
          doReplacements={doTentativeReplacements}
          macroId={macro.id}
        />
      )}
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
    </ApplyContainer>
  );
};

export default MacroApply;
