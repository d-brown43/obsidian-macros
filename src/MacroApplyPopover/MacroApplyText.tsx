import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  applyReplacements,
  identifyMacros,
  isVariableForArtefact,
} from '../utils';
import ApplyPreview from './ApplyPreview';
import MacroInput from './MacroInput';
import { Macro, MacroUnion } from '../types';
import { getMacro } from '../redux';
import { useSelector } from 'react-redux';

type Props = {
  macroId: MacroUnion['id'];
  renderIntoTitle: (element: JSX.Element) => JSX.Element;
  apply: (resolvedMacro: string) => void;
  renderApply: ({
    canApplyAllReplacements,
    resolveMacro,
  }: {
    canApplyAllReplacements: boolean;
    resolveMacro: () => string;
  }) => JSX.Element;
};

const MacroApplyText = ({
  macroId,
  renderApply,
  renderIntoTitle,
  apply,
}: Props) => {
  const selector = useMemo(() => getMacro(macroId), [macroId]);
  const macro = useSelector(selector) as Macro;

  const [variableMap, setVariableMap] = useState<{ [key: string]: string }>({});

  const identifiedVariables = useMemo(
    () => identifyMacros(macro.text),
    [macro.text]
  );

  const getContent = useCallback(
    (variableName: string) => variableMap[variableName] || '',
    [variableMap]
  );

  const variablesWithValues = useMemo(
    () => identifiedVariables.variableNames.filter((v) => getContent(v)),
    [identifiedVariables, getContent]
  );

  const doReplacements = useCallback(() => {
    const artefacts = identifiedVariables.artefacts.filter((a) => {
      return variablesWithValues.some((variable) =>
        isVariableForArtefact(a, variable)
      );
    });
    return applyReplacements(
      { artefacts, variableNames: variablesWithValues },
      getContent,
      macro.text
    );
  }, [identifiedVariables, getContent, macro.text, variablesWithValues]);

  const canApplyAllReplacements =
    variablesWithValues.length === identifiedVariables.variableNames.length;

  const doApply = useCallback(() => {
    apply(doReplacements());
  }, [apply, doReplacements]);

  useEffect(() => {
    if (identifiedVariables.variableNames.length === 0) {
      doApply();
    }
  }, [identifiedVariables.variableNames.length, doApply]);

  return (
    <>
      {renderIntoTitle(<ApplyPreview applyMacro={doReplacements} />)}
      <MacroInput
        variableNames={identifiedVariables.variableNames}
        getValue={getContent}
        setValue={(variableName, value) =>
          setVariableMap((prevState) => ({
            ...prevState,
            [variableName]: value,
          }))
        }
        applyMacro={doApply}
      />
      {renderApply({ canApplyAllReplacements, resolveMacro: doReplacements })}
    </>
  );
};

export default MacroApplyText;
