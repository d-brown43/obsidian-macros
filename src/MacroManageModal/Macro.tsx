import {Macro as MacroType} from '../types';
import {useState} from "react";

const Macro = ({macro}: { macro: MacroType }) => {
  const [text, setText] = useState(macro.text);
  return (
    <input
      type="text"
      onChange={e => {
        console.log('typing', e.target.value);
        setText(e.target.value);
      }}
      value={text}
    />
  )
};

export default Macro;
