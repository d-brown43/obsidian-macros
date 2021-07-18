import { Macro as MacroType } from '../types';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { updateMacro, deleteMacro, getMacro } from '../redux';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';

const StyledButton = styled(Button)`
  margin: 0;
  margin-left: 0.5rem;
`;

const StyledInput = styled.input`
  margin-left: 0.5rem;
`;

type Props = {
  macroId: MacroType['id'];
  className?: string;
};

const Macro = ({ macroId, className }: Props) => {
  const dispatch = useDispatch();
  const selector = useMemo(() => getMacro(macroId), [macroId]);
  const macro = useSelector(selector) as MacroType;

  const [macroText, setMacroText] = useState(macro.text);
  const [label, setLabel] = useState(macro.label);

  const save = () => {
    const trimmedLabel = label.trim();
    let computedLabel = trimmedLabel;
    if (trimmedLabel === '') {
      computedLabel = macroText;
    }
    if (computedLabel === '') {
      computedLabel = 'Macro Label';
    }
    setLabel(computedLabel);
    dispatch(
      updateMacro({
        ...macro,
        label: computedLabel,
        text: macroText,
      })
    );
  };

  const hasChanged = label !== macro.label || macroText !== macro.text;

  const remove = () => dispatch(deleteMacro(macroId));

  return (
    <div className={className} data-testid={`edit-macro-${macroId}`}>
      <label>
        Label:
        <StyledInput
          data-testid={`edit-macro-label-${macroId}`}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
        />
      </label>
      <StyledInput
        data-testid={`edit-macro-pattern-${macroId}`}
        type="text"
        onChange={(e) => setMacroText(e.target.value)}
        value={macroText}
        placeholder="Macro"
      />
      <StyledButton data-testid={`delete-macro-${macroId}`} onClick={remove}>
        X
      </StyledButton>
      {hasChanged && (
        <StyledButton
          data-testid={`edit-macro-confirm-${macroId}`}
          onClick={save}
        >
          Save
        </StyledButton>
      )}
    </div>
  );
};

export default Macro;
