import { applyReplacements, identifyVariables } from './identifyVariables';

describe('identifyVariables', () => {
  it('returns the same string if no variables', () => {
    expect(identifyVariables('my string')).toEqual({
      variableNames: [],
      artefacts: [],
    });
  });

  it('identifies a single variable', () => {
    expect(identifyVariables('my {variable} string')).toEqual({
      variableNames: ['variable'],
      artefacts: ['{variable}'],
    });
  });

  it('deduplicates duplicated variables', () => {
    expect(
      identifyVariables('my {variable} duplicated {variable} string')
    ).toEqual({
      variableNames: ['variable'],
      artefacts: ['{variable}', '{variable}'],
    });
  });

  it('handles multiple variables', () => {
    expect(
      identifyVariables('my {variable} string with {multiple} variables')
    ).toEqual({
      variableNames: ['variable', 'multiple'],
      artefacts: ['{variable}', '{multiple}'],
    });
  });

  it('handles multiple and duplicated variables', () => {
    expect(
      identifyVariables(
        'my {variable} string {variable} duplicated {multiple} {variable}'
      )
    ).toEqual({
      variableNames: ['variable', 'multiple'],
      artefacts: ['{variable}', '{variable}', '{multiple}', '{variable}'],
    });
  });

  it('handles variables next to each other', () => {
    expect(identifyVariables('my {string}{variable} string')).toEqual({
      variableNames: ['string', 'variable'],
      artefacts: ['{string}', '{variable}'],
    });
  });

  it.each`
    string                         | expected
    ${'my {   macrostring} to'}    | ${{ variableNames: ['macrostring'], artefacts: ['{   macrostring}'] }}
    ${'my {   macrostring   } to'} | ${{ variableNames: ['macrostring'], artefacts: ['{   macrostring   }'] }}
    ${'my {macrostring   } to'}    | ${{ variableNames: ['macrostring'], artefacts: ['{macrostring   }'] }}
    ${'my { macrostring } to'}     | ${{ variableNames: ['macrostring'], artefacts: ['{ macrostring }'] }}
  `(
    'handles arbitrary number of spaces between the curly braces',
    ({ string, expected }) => {
      expect(identifyVariables(string)).toEqual(expected);
    }
  );

  it('handles spaces inside the variable names', () => {
    expect(identifyVariables('my { string with variables } string')).toEqual({
      variableNames: ['string with variables'],
      artefacts: ['{ string with variables }'],
    });
  });

  it('handles non-closed braces', () => {
    expect(
      identifyVariables('my {variable} { string with variables string {here}')
    ).toEqual({
      variableNames: ['variable', 'here'],
      artefacts: ['{variable}', '{here}'],
    });
  });

  it('handles non-opened braces', () => {
    expect(
      identifyVariables('my {variable} string with variables string} {here}')
    ).toEqual({
      variableNames: ['variable', 'here'],
      artefacts: ['{variable}', '{here}'],
    });
  });

  it('handles braces inside braces', () => {
    expect(
      identifyVariables(
        'my {{variable}} string with variables string} {{{{here}}}}'
      )
    ).toEqual({
      variableNames: ['variable', 'here'],
      artefacts: ['{variable}', '{here}'],
    });
  });
});

describe('apply macro', () => {
  it.each`
    macro                                                  | variableMap                          | expected
    ${'{variable} my string'}                              | ${{ variable: 'replaced' }}          | ${'replaced my string'}
    ${'{ variable} my string'}                             | ${{ variable: 'replaced' }}          | ${'replaced my string'}
    ${'{variable } my string'}                             | ${{ variable: 'replaced' }}          | ${'replaced my string'}
    ${'{{ nested }} my string'}                            | ${{ nested: 'replaced' }}            | ${'{replaced} my string'}
    ${'{ nested }} my string'}                             | ${{ nested: 'replaced' }}            | ${'replaced} my string'}
    ${'{{ nested } my string'}                             | ${{ nested: 'replaced' }}            | ${'{replaced my string'}
    ${'{ { nested } } my string'}                          | ${{ nested: 'replaced' }}            | ${'{ replaced } my string'}
    ${'{multiple} stuff here {variables}'} | ${{
  multiple: 'replaced',
  variables: 'other replaced',
}} | ${'replaced stuff here other replaced'}
    ${'{repeating} my string {repeating} yes {repeating}'} | ${{ repeating: 'replaced' }}         | ${'replaced my string replaced yes replaced'}
    ${'{ string variable    } gets replaced'}              | ${{ 'string variable': 'replaced' }} | ${'replaced gets replaced'}
  `("replaces to '$expected'", ({ macro, variableMap, expected }) => {
    expect(
      applyReplacements(identifyVariables(macro), variableMap, macro)
    ).toEqual(expected);
  });
});
