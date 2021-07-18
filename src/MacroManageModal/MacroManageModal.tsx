import Macro from './Macro';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getMacroIds } from '../redux';
import { createMacro } from 'src/redux/macros';
import Button from '../components/Button';
import { TEXT_COLOUR } from '../styling';

const Content = styled.div`
  margin-top: 0.5rem;
`;

const AddMacroButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledMacro = styled(Macro)`
  margin-bottom: 0.5rem;
`;

const Separator = styled.div`
  border-bottom: 1px solid ${TEXT_COLOUR};
  width: 100%;
  margin-bottom: 2rem;
`;

const MacroManageModal = () => {
  const macroIds = useSelector(getMacroIds);
  const dispatch = useDispatch();

  const makeMacro = () => {
    dispatch(
      createMacro({
        label: '',
        text: 'Macro Content',
      })
    );
  };

  return (
    <>
      <h2>Manage Macros</h2>
      <p>
        Text enclosed in curly braces gets interpreted as a variable name. When
        applying a macro, you these will get replaced with whatever you enter
        for your variable names.
      </p>
      <p>
        For example with a macro "{'{text}'} stuff goes here", if you enter "my"
        when applying the macro, you would get "my stuff goes here" inserted at
        the current caret location.
      </p>
      <Separator />
      <Content>
        {macroIds.length === 0 && (
          <p data-testid="no-macros-notice">No macros yet, create one below</p>
        )}
        {macroIds.map((macroId) => (
          <div key={macroId}>
            <StyledMacro macroId={macroId} />
          </div>
        ))}
      </Content>
      <AddMacroButton
        data-testid="create-macro"
        type="button"
        onClick={makeMacro}
      >
        Add Macro
      </AddMacroButton>
    </>
  );
};

export default MacroManageModal;
