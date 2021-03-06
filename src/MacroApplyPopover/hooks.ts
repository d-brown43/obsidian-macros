import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

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

export const useOnFocusOut = <R extends HTMLElement>(
  callback: () => void,
  containerRef: MutableRefObject<R | null>
) => {
  useEffect(() => {
    const handler = (e: FocusEvent) => {
      if (
        e.target &&
        e.target !== containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener('focus', handler, true);
    return () => document.removeEventListener('focus', handler, true);
  }, [callback, containerRef]);

  return containerRef as RefObject<R>;
};
