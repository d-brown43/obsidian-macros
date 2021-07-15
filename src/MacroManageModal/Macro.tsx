import {Macro as MacroType} from '../types';
import {useState} from "react";
import styled from "styled-components";
import {updateMacro, deleteMacro} from "../redux/macros";
import {useDispatch} from "react-redux";

const StyledButton = styled.button`
  margin: 0;
  margin-left: 0.5rem;
`;

type Props = {
  macro: MacroType;
  className?: string;
}

const Macro = ({macro, className}: Props) => {
  const [text, setText] = useState(macro.text);
  const dispatch = useDispatch();

  const save = () => {
    dispatch(updateMacro({
      ...macro,
      text,
    }));
  };

  const remove = () => {
    dispatch(deleteMacro(macro));
  };

  return (
    <div className={className}>
      <input
        type="text"
        onChange={e => setText(e.target.value)}
        value={text}
      />
      <StyledButton onClick={remove}>X</StyledButton>
      {text !== macro.text && (
        <StyledButton
          onClick={save}
        >
          Save
        </StyledButton>
      )}
    </div>
  )
};

export default Macro;
