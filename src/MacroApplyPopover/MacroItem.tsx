import { Macro } from '../types';
import { useFocus } from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../components/Button';
import { getMacro, selectMacro } from '../redux';
import { useMemo } from 'react';

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
      <Label>{macro.label}</Label>
      <MacroSelect
        data-testid={`macro-item-${macroId}`}
        ref={ref}
        onClick={onClick}
      >
        {macro.text}
      </MacroSelect>
    </MacroRow>
  );
};

export default MacroItem;
