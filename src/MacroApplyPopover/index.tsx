import styled from "styled-components";
import {useSelector} from "react-redux";
import {RootState} from "../redux";
import {useRef, useState} from "react";
import MacroList from "./MacroList";
import MacroApply from "./MacroApply";

const Container = styled.div`
  position: absolute;
  background: var(--background-primary);
  width: 500px;
  height: 200px;
  z-index: 100;
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

type Props = {
  close: () => void;
  applyMacro: (resolvedValue: string) => void;
}

const MacroApplyPopover = ({ close, applyMacro }: Props) => {
  const [selectedMacroId, setSelectedMacroId] = useState<string | null>(null);
  const macros = useSelector((state: RootState) => state.macro);
  const containerRef = useRef<null | HTMLDivElement>(null);

  return (
    <Container
      ref={containerRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
        }
      }}
    >
      <CloseButton
        type="button"
        onClick={close}
      >
        X
      </CloseButton>
      {!selectedMacroId && (
        <MacroList
          macros={macros}
          setSelectedMacroId={setSelectedMacroId}
        />
      )}
      {selectedMacroId && (
        <MacroApply
          selectedMacroId={selectedMacroId}
          applyMacro={applyMacro}
        />
      )}
    </Container>
  );
};

export default MacroApplyPopover;