import { Macro } from '../types';
import { useFocus } from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import Button from '../components/Button';
import { getMacro, selectMacro } from '../redux';
import { useMemo } from 'react';
import { POPOVER_WIDTH_REM } from '../styling';
import { isTextMacro } from "../utils";

const overflow = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MacroSelect = styled(Button)`
  margin: 0;
  width: 10rem;
  margin-right: 1rem;
  flex-shrink: 0;
  ${overflow}
`;

const MacroText = styled.span`
  display: block;
  max-width: ${POPOVER_WIDTH_REM * (2 / 3)}rem;
  flex-grow: 1;
  ${overflow};
`;

const MacroRow = styled.div`
  margin-bottom: 0.5rem !important;
  display: flex;
  flex-direction: row;
`;

type Props = {
  macroId: Macro['id'];
  doFocus: boolean;
};

const MacroItem = ({ macroId, doFocus }: Props) => {
  const ref = useFocus<HTMLButtonElement>(doFocus);
  const selector = useMemo(() => getMacro(macroId), [macroId]);
  const macro = useSelector(selector);
  const dispatch = useDispatch();

  if (!macro) return null;

  const onClick = () => dispatch(selectMacro(macroId));

  return (
    <MacroRow>
      <MacroSelect
        data-testid={`macro-item-${macroId}`}
        ref={ref}
        onClick={onClick}
      >
        {macro.label}
      </MacroSelect>
      {isTextMacro(macro) && <MacroText>{macro.text}</MacroText>}
    </MacroRow>
  );
};

export default MacroItem;
