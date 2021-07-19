import { useSelector } from 'react-redux';
import { Button } from '../components';
import { Macro as MacroType } from '../types';
import { getSelectedMacro } from '../redux';
import styled from 'styled-components';
import MacroApplyText from './MacroApplyText';
import { isBuiltinMacro, isTextMacro } from '../utils';
import MacroApplyBuiltin from './MacroApplyBuiltin';

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
  const macro = useSelector(getSelectedMacro) as MacroType;

  return (
    <ApplyContainer>
      <BackButton type="button" onClick={back}>
        &#8592;
      </BackButton>
      {isTextMacro(macro) && (
        <MacroApplyText
          macroId={macro.id}
          apply={applyMacro}
          renderIntoTitle={renderIntoTitle}
          renderApply={({ canApplyAllReplacements, resolveMacro }) => (
            <Button
              type="button"
              onClick={() => {
                applyMacro(resolveMacro());
              }}
              data-testid="confirm-variables"
              disabled={!canApplyAllReplacements}
            >
              Apply
            </Button>
          )}
        />
      )}
      {isBuiltinMacro(macro) && (
        <MacroApplyBuiltin
          apply={applyMacro}
          renderIntoTitle={renderIntoTitle}
          macroId={macro.id}
          renderApply={() => <>{null}</>}
        />
      )}
    </ApplyContainer>
  );
};

export default MacroApply;
