import {Macro as MacroType} from "../types";
import Macro from "./Macro";

const MacroManageModal = ({ macros }: { macros: MacroType[] }) => {
  return (
    <>
      <h2>Manage Macros</h2>
      {macros.map(macro => (
        <div>
          <Macro macro={macro} />
        </div>
      ))}
    </>
  )
};

export default MacroManageModal;
