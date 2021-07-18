import { applyReplacements, identifyMacros } from './manipulateMacros';

describe('identifyMacros', () => {
  it('returns the same string if no variables', () => {
    expect(identifyMacros('my string')).toEqual({
      variableNames: [],
      artefacts: [],
    });
  });

  it('identifies a single variable', () => {
    expect(identifyMacros('my {variable} string')).toEqual({
      variableNames: ['variable'],
      artefacts: ['{variable}'],
    });
  });

  it('deduplicates duplicated variables', () => {
    expect(
      identifyMacros('my {variable} duplicated {variable} string')
    ).toEqual({
      variableNames: ['variable'],
      artefacts: ['{variable}', '{variable}'],
    });
  });

  it('handles multiple variables', () => {
    expect(
      identifyMacros('my {variable} string with {multiple} variables')
    ).toEqual({
      variableNames: ['variable', 'multiple'],
      artefacts: ['{variable}', '{multiple}'],
    });
  });

  it('handles multiple and duplicated variables', () => {
    expect(
      identifyMacros(
        'my {variable} string {variable} duplicated {multiple} {variable}'
      )
    ).toEqual({
      variableNames: ['variable', 'multiple'],
      artefacts: ['{variable}', '{variable}', '{multiple}', '{variable}'],
    });
  });

  it('handles variables next to each other', () => {
    expect(identifyMacros('my {string}{variable} string')).toEqual({
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
      expect(identifyMacros(string)).toEqual(expected);
    }
  );

  it('handles spaces inside the variable names', () => {
    expect(identifyMacros('my { string with variables } string')).toEqual({
      variableNames: ['string with variables'],
      artefacts: ['{ string with variables }'],
    });
  });

  it('handles non-closed braces', () => {
    expect(
      identifyMacros('my {variable} { string with variables string {here}')
    ).toEqual({
      variableNames: ['variable', 'here'],
      artefacts: ['{variable}', '{here}'],
    });
  });

  it('handles non-opened braces', () => {
    expect(
      identifyMacros('my {variable} string with variables string} {here}')
    ).toEqual({
      variableNames: ['variable', 'here'],
      artefacts: ['{variable}', '{here}'],
    });
  });

  it('handles braces inside braces', () => {
    expect(
      identifyMacros(
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
    ${'my string'}                                         | ${{}}                                | ${'my string'}
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
    ${'{ordered} replacement {works}'} | ${{
  ordered: '{works}',
  works: 'stuff',
}} | ${'{works} replacement stuff'}
    ${'{sub} substring var {substr}'} | ${{
  sub: 'a',
  substr: 'b',
}} | ${'a substring var b'}
    ${'{substr} substring var {sub}'} | ${{
  sub: 'a',
  substr: 'b',
}} | ${'b substring var a'}
  `("replaces to '$expected'", ({ macro, variableMap, expected }) => {
    const getContent = (name: string) => variableMap[name] || '';
    expect(applyReplacements(identifyMacros(macro), getContent, macro)).toEqual(
      expected
    );
  });
});
