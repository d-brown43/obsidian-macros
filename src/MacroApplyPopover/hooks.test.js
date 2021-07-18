import { useFocus, useOnFocusOut } from './hooks';
import { renderHook } from '@testing-library/react-hooks';

describe('useFocus', () => {
  it('does not focus if shouldFocus is false', () => {
    const { result } = renderHook(() => useFocus(false));

    const focus = jest.fn();
    result.current.current = {
      focus,
    };

    expect(focus).not.toHaveBeenCalled();
  });

  it('focuses when shouldFocus is true', () => {
    const { result, rerender } = renderHook(
      ({ shouldFocus }) => useFocus(shouldFocus),
      {
        initialProps: {
          shouldFocus: false,
        },
      }
    );

    const focus = jest.fn();
    result.current.current = {
      focus,
    };

    expect(focus).not.toHaveBeenCalled();

    rerender({ shouldFocus: true });

    expect(focus).toBeCalled();

    rerender({ shouldFocus: false });

    expect(focus).toBeCalledTimes(1);

    rerender({ shouldFocus: true });

    expect(focus).toBeCalledTimes(2);
  });
});

describe('useOnFocusOut', () => {
  it('calls the supplied callback when an external element is focused', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useOnFocusOut(callback));

    const container = document.createElement('div');
    result.current.current = container;
    document.body.appendChild(container);

    const externalSpan = document.createElement('span');
    document.body.appendChild(externalSpan);

    const event = new CustomEvent('focus', {
      target: externalSpan,
    });
    externalSpan.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('does not call the supplied callback when internal element is focused', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useOnFocusOut(callback));

    const container = document.createElement('div');
    result.current.current = container;
    document.body.appendChild(container);

    const internalSpan = document.createElement('span');
    container.appendChild(internalSpan);

    const event = new CustomEvent('focus', {
      target: internalSpan,
    });
    internalSpan.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
