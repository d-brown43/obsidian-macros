import {Macro} from "../types";
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";

const MacroSelect = styled.button`
  margin-top: 0.5rem;
`;

const MacroItem = ({
  macro,
  setSelectedMacroId,
  doFocus,
}: {
  macro: Macro,
  setSelectedMacroId: (id: string) => void,
  doFocus: boolean
}) => {
  const ref = useRef<null | HTMLButtonElement>(null);

  useEffect(() => {
    if (doFocus) {
      ref.current?.focus();
    }
  }, [doFocus]);

  return (
    <MacroSelect
      ref={ref}
      key={macro.id}
      onClick={() => setSelectedMacroId(macro.id)}
    >
      {macro.text}
    </MacroSelect>
  );
};

type Props = {
  macros: Macro[];
  setSelectedMacroId: (id: string) => void;
};

const MacroList = ({ macros, setSelectedMacroId }: Props) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setFocused(true);
  }, []);

  return (
    <>
      {macros.map((macro, i) => (
        <MacroItem
          key={macro.id}
          macro={macro}
          setSelectedMacroId={setSelectedMacroId}
          doFocus={!focused && i === 0}
        />
      ))}
    </>
  )
};

export default MacroList;
