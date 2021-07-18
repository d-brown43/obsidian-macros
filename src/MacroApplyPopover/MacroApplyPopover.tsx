import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getIsMacroSelected } from '../redux';
import MacroList from './MacroList';
import MacroApply from './MacroApply';
import Button from '../components/Button';
import { useOnFocusOut } from './hooks';
import { BACKGROUND_COLOUR, BORDER_STYLING } from '../styling';

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
  background: ${BACKGROUND_COLOUR};
  border: 2px solid ${BORDER_STYLING};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 500px;
  height: 200px;
  z-index: 100;
  box-shadow: 6px 4px 5px 0px rgba(0,0,0,0.49);
  -webkit-box-shadow: 6px 4px 5px 0px rgba(0,0,0,0.49);
  -moz-box-shadow: 6px 4px 5px 0px rgba(0,0,0,0.49);
`;

const CloseButton = styled(Button)`
  position: absolute;
  margin: 0;
  top: 0.5rem;
  right: 0.5rem;
`;

type Props = {
  close: () => void;
  applyMacro: (resolvedValue: string) => void;
  getCursorPosition: () => CursorPosition;
};

const MacroApplyPopover = ({ getCursorPosition, close, applyMacro }: Props) => {
  const isMacroSelected = useSelector(getIsMacroSelected);
  const containerRef = useOnFocusOut<HTMLDivElement>(close);

  return (
    <Container
      data-testid="macro-apply-popover"
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
      {!isMacroSelected && <MacroList />}
      {isMacroSelected && <MacroApply applyMacro={applyMacro} />}
    </Container>
  );
};

export default MacroApplyPopover;
