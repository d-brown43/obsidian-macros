import { Macro as MacroType } from "../types";
import { useState } from "react";
import styled from "styled-components";
import { updateMacro, deleteMacro } from "../redux/macros";
import { useDispatch } from "react-redux";
import Button from "../components/Button";

const StyledButton = styled(Button)`
  margin: 0;
  margin-left: 0.5rem;
`;

const StyledInput = styled.input`
  margin-left: 0.5rem;
`;

type Props = {
  macro: MacroType;
  className?: string;
};

const Macro = ({ macro, className }: Props) => {
  const [macroText, setMacroText] = useState(macro.text);
  const [label, setLabel] = useState(macro.label);
  const dispatch = useDispatch();

  const save = () => {
    const trimmedLabel = label.trim();
    let computedLabel = trimmedLabel;
    if (trimmedLabel === "") {
      computedLabel = macroText;
      setLabel(macroText);
    }
    dispatch(
      updateMacro({
        ...macro,
        label: computedLabel,
        text: macroText,
      })
    );
  };

  const hasChanged = label !== macro.label || macroText !== macro.text;

  const remove = () => {
    dispatch(deleteMacro(macro));
  };

  return (
    <div className={className}>
      <label>
        Label:
        <StyledInput
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
        />
      </label>
      <StyledInput
        type="text"
        onChange={(e) => setMacroText(e.target.value)}
        value={macroText}
        placeholder="Macro"
      />
      <StyledButton onClick={remove}>X</StyledButton>
      {hasChanged && <StyledButton onClick={save}>Save</StyledButton>}
    </div>
  );
};

export default Macro;
