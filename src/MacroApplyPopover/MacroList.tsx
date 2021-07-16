import { Macro } from "../types";
import styled from "styled-components";
import { useFocus, useHasUpdated } from "./hooks";
import Button from "../components/Button";

const MacroSelect = styled(Button)`
  margin: 0;
  max-width: 20rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MacroRow = styled.div`
  margin-bottom: 0.5rem !important;
  display: flex;
  flex-direction: row;
`;

const Label = styled.span`
  display: block;
  margin-right: 0.5rem;
  width: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MacroItem = ({
  macro,
  setSelectedMacroId,
  doFocus,
}: {
  macro: Macro;
  setSelectedMacroId: (id: string) => void;
  doFocus: boolean;
}) => {
  const ref = useFocus<HTMLButtonElement>(doFocus);

  return (
    <MacroRow>
      <Label>{macro.label}</Label>
      <MacroSelect
        ref={ref}
        key={macro.id}
        onClick={() => setSelectedMacroId(macro.id)}
      >
        {macro.text}
      </MacroSelect>
    </MacroRow>
  );
};

type Props = {
  macros: Macro[];
  setSelectedMacroId: (id: string) => void;
};

const MacroList = ({ macros, setSelectedMacroId }: Props) => {
  const hasUpdated = useHasUpdated();

  return (
    <>
      {macros.map((macro, i) => (
        <MacroItem
          key={macro.id}
          macro={macro}
          setSelectedMacroId={setSelectedMacroId}
          doFocus={!hasUpdated && i === 0}
        />
      ))}
    </>
  );
};

export default MacroList;
