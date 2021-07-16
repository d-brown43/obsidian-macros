import { useEffect, useRef, useState } from "react";

export const useHasUpdated = () => {
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    setHasUpdated(true);
  }, []);

  return hasUpdated;
};

export const useFocus = <T extends { focus: () => void }>(
  shouldFocus: boolean
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current?.focus();
    }
  }, [shouldFocus]);

  return ref;
};
