import { useSelector } from "react-redux";
import { RootState } from "../redux";
import MacroInput from "./MacroInput";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { Macro as MacroType } from "../types";

const ApplyButton = styled(Button)``;

type Props = {
  selectedMacroId: string;
  applyMacro: (resolved: string) => void;
};

const MacroApply = ({ selectedMacroId, applyMacro }: Props) => {
  const [content, setContent] = useState<{ [key: string]: string }>({});

  const macro = useSelector((state: RootState) =>
    state.macro.find((macro) => macro.id === selectedMacroId)
  ) as MacroType;

  const parts = macro.text.match(/{([^}]+)}/g) || [];
  const variableNames = parts.map((part) =>
    part.replace("{", "").replace("}", "")
  );
  const uniqueVariableNames = variableNames.filter(
    (name, i) => variableNames.indexOf(name) === i
  );

  const apply = () => {
    const result = parts.reduce<string>((acc, part) => {
      const variableName = uniqueVariableNames.find(
        (name) => part.indexOf(name) !== -1
      );
      if (variableName) {
        return acc.replace(new RegExp(part, "g"), content[variableName] || "");
      }
      return acc;
    }, macro.text);

    applyMacro(result);
  };

  useEffect(() => {
    if (uniqueVariableNames.length === 0) {
      apply();
    }
  }, [uniqueVariableNames.length]);

  return (
    <div>
      <MacroInput
        variableNames={uniqueVariableNames}
        getValue={(variableName) => content[variableName] || ""}
        setValue={(variableName, value) =>
          setContent((prevState) => ({
            ...prevState,
            [variableName]: value,
          }))
        }
      />
      <ApplyButton type="button" onClick={apply}>
        Apply
      </ApplyButton>
    </div>
  );
};

export default MacroApply;
