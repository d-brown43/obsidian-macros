import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getIsMacroSelected, resetUi, clearSelectedMacro } from '../redux';
import MacroList from './MacroList';
import MacroApply from './MacroApply';
import Button from '../components/Button';
import { useOnFocusOut } from './hooks';
import {
  BACKGROUND_COLOUR,
  BORDER_COLOUR,
  POPOVER_HEIGHT_REM,
  POPOVER_WIDTH_REM,
} from '../styling';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

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
  border: 2px solid ${BORDER_COLOUR};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: ${POPOVER_WIDTH_REM}rem;
  height: ${POPOVER_HEIGHT_REM}rem;
  z-index: 100;
  box-shadow: 6px 4px 5px 0px rgba(0, 0, 0, 0.49);
  -webkit-box-shadow: 6px 4px 5px 0px rgba(0, 0, 0, 0.49);
  -moz-box-shadow: 6px 4px 5px 0px rgba(0, 0, 0, 0.49);
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled(Button)`
  position: absolute;
  margin: 0;
  top: 0.5rem;
  right: 0.5rem;
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  padding: 0.1rem;
`;

type Props = {
  close: () => void;
  applyMacro: (resolvedValue: string) => void;
  getCursorPosition: () => CursorPosition;
  cursorElement: HTMLElement;
};

const MacroApplyPopover = ({
  getCursorPosition,
  close,
  applyMacro,
  cursorElement,
}: Props) => {
  const dispatch = useDispatch();
  const isMacroSelected = useSelector(getIsMacroSelected);
  const containerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  useOnFocusOut<HTMLDivElement>(close, containerRef);

  const titleElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(resetUi());
    return () => {
      dispatch(resetUi());
    };
  }, [dispatch]);

  const [referenceElement] = useState(cursorElement);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [24, 0],
        },
      },
    ],
  });

  const back = () => dispatch(clearSelectedMacro());

  return (
    <Container
      data-testid="macro-apply-popover"
      ref={(el) => {
        containerRef.current = el;
        setPopperElement(el);
      }}
      position={getCursorPosition()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
        }
      }}
      style={styles.popper}
      {...attributes.popper}
    >
      <h2>Apply Macro</h2>
      <div ref={titleElementRef} />
      <CloseButton type="button" onClick={close}>
        X
      </CloseButton>
      <ScrollableContainer>
        {!isMacroSelected && <MacroList />}
        {isMacroSelected && (
          <MacroApply
            applyMacro={applyMacro}
            back={back}
            renderIntoTitle={(element) =>
              createPortal(element, titleElementRef.current as Element)
            }
          />
        )}
      </ScrollableContainer>
    </Container>
  );
};

export default MacroApplyPopover;
