import {useEffect, useRef} from "react";

type Props = {
  value: string;
  setValue: (value: string) => void;
  doFocus: boolean;
  placeholder: string;
}

const MacroSingleApply = ({ value, setValue, doFocus, placeholder }: Props) => {
  const ref = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (doFocus) {
      ref.current?.focus();
    }
  }, [doFocus]);

  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
};

export default MacroSingleApply;
