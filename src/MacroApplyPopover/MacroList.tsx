import { useHasUpdated } from './hooks';
import MacroItem from './MacroItem';
import { useSelector } from 'react-redux';
import { getMacroIds } from '../redux';

const MacroList = () => {
  const hasUpdated = useHasUpdated();
  const macroIds = useSelector(getMacroIds);

  return (
    <>
      {macroIds.map((id, i) => (
        <MacroItem key={id} macroId={id} doFocus={!hasUpdated && i === 0} />
      ))}
    </>
  );
};

export default MacroList;
