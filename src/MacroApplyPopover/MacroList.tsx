import { Macro } from '../types';
import styled from 'styled-components';
import { useFocus, useHasUpdated } from './hooks';
import Button from '../components/Button';
import { useDispatch } from "react-redux";
import { selectMacro } from "../redux/ui";

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
  doFocus,
}: {
  macro: Macro;
  doFocus: boolean;
}) => {
  const ref = useFocus<HTMLButtonElement>(doFocus);
  const dispatch = useDispatch();
  const onClick = () => dispatch(selectMacro(macro.id));

  return (
    <MacroRow>
      <Label>{macro.label}</Label>
      <MacroSelect
        ref={ref}
        key={macro.id}
        onClick={onClick}
      >
        {macro.text}
      </MacroSelect>
    </MacroRow>
  );
};

type Props = {
  macros: Macro[];
};

const MacroList = ({ macros }: Props) => {
  const hasUpdated = useHasUpdated();

  return (
    <>
      {macros.map((macro, i) => (
        <MacroItem
          key={macro.id}
          macro={macro}
          doFocus={!hasUpdated && i === 0}
        />
      ))}
    </>
  );
};

export default MacroList;
