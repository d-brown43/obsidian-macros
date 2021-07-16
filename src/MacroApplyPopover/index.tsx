import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useEffect, useRef, useState } from "react";
import MacroList from "./MacroList";
import MacroApply from "./MacroApply";
import Button from "../components/Button";

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
  const [selectedMacroId, setSelectedMacroId] = useState<string | null>(null);
  const macros = useSelector((state: RootState) => state.macro);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: FocusEvent) => {
      if (
        !e.target ||
        (e.target !== containerRef.current &&
          !containerRef.current?.contains(e.target as Node))
      ) {
        close();
      }
    };

    document.addEventListener("focus", handler, true);
    return () => document.removeEventListener("focus", handler, true);
  }, []);

  return (
    <Container
      tabIndex={-1}
      ref={containerRef}
      position={getCursorPosition()}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
        }
      }}
    >
      <h2>Apply Macro</h2>
      <CloseButton type="button" onClick={close}>
        X
      </CloseButton>
      {!selectedMacroId && (
        <MacroList macros={macros} setSelectedMacroId={setSelectedMacroId} />
      )}
      {selectedMacroId && (
        <MacroApply selectedMacroId={selectedMacroId} applyMacro={applyMacro} />
      )}
    </Container>
  );
};

export default MacroApplyPopover;
