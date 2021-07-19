import { BuiltinMacro, MacroUnion } from '../types';
import { useEffect, useMemo } from 'react';
import { getMacro } from '../redux';
import { useSelector } from 'react-redux';
import { useApplyBuiltin } from '../utils';

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

const MacroApplyBuiltin = ({ macroId, apply }: Props) => {
  const selector = useMemo(() => getMacro(macroId), [macroId]);
  const macro = useSelector(selector) as BuiltinMacro;

  const appliedMacro = useApplyBuiltin(macro);

  useEffect(() => {
    switch (macro.type) {
      case 'currentTime':
        apply(appliedMacro);
        break;
    }
  }, [macro.type, appliedMacro, apply]);

  return null;
};

export default MacroApplyBuiltin;
