import Macro from "./Macro";
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux";
import { createMacro } from "src/redux/macros";

const AddMacroButton = styled.button`
  margin-top: 1rem;
`;

const StyledMacro = styled(Macro)`
  margin-top: 0.5rem;
`;

const MacroManageModal = () => {
  const macros = useSelector((state: RootState) => state.macro);
  const dispatch = useDispatch();

  const makeMacro = () => {
    dispatch(createMacro({
      text: 'Macro Content',
    }));
  };

  return (
    <>
      <h2>Manage Macros</h2>
      <p>
        {'"{text}"'} gets replaced with the content you enter when applying a macro.
      </p>
      <p>
        For example with a macro "{'{text}'} stuff goes here", if you enter "my" when
        applying the macro, you would get "my stuff goes here" inserted at the current
        caret location.
      </p>
      {macros.length === 0 && (
        <p>
          No macros yet, create one below
        </p>
      )}
      {macros.map(macro => (
        <div key={macro.id}>
          <StyledMacro
            macro={macro}
          />
        </div>
      ))}
      <AddMacroButton
        type="button"
        onClick={makeMacro}
      >
        Add Macro
      </AddMacroButton>
    </>
  )
};

export default MacroManageModal;
