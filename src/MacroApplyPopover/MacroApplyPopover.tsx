import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getMacros, getSelectedMacro } from '../redux';
import MacroList from './MacroList';
import MacroApply from './MacroApply';
import Button from '../components/Button';
import { useOnFocusOut } from './hooks';

type CursorPosition = {
  top: number;
  left: number;
};

const CURSOR_PADDING = 16;

const Container = styled.div`
  position: absolute;
  top: ${({ position }: { position: CursorPosition }) =>
    position.top + CURSOR_PADDING}px;
  left: ${({ position }: { position: CursorPosition }) =>
    position.left + CURSOR_PADDING}px;
  background: var(--background-primary);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 500px;
  height: 200px;
  z-index: 100;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0;
`;

type Props = {
  close: () => void;
  applyMacro: (resolvedValue: string) => void;
  getCursorPosition: () => CursorPosition;
};

const MacroApplyPopover = ({ getCursorPosition, close, applyMacro }: Props) => {
  const selectedMacro = useSelector(getSelectedMacro);
  const macros = useSelector(getMacros);
  const containerRef = useOnFocusOut<HTMLDivElement>(close);

  return (
    <Container
      tabIndex={-1}
      ref={containerRef}
      position={getCursorPosition()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
        }
      }}
    >
      <h2>Apply Macro</h2>
      <CloseButton type="button" onClick={close}>
        X
      </CloseButton>
      {!selectedMacro && <MacroList macros={macros} />}
      {selectedMacro && <MacroApply applyMacro={applyMacro} />}
    </Container>
  );
};

export default MacroApplyPopover;
