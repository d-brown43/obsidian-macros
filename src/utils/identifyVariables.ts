type IdentifiedVariables = {
  variableNames: string[];
  artefacts: string[];
};

export const identifyVariables = (macroString: string): IdentifiedVariables => {
  const parts = macroString.match(/{([^}^{]+)}/g) || [];
  const variableNames = parts.map((part) =>
    part.replace(/{\s*/, '').replace(/\s*}/, '')
  );
  const uniqueVariableNames = variableNames.filter(
    (name, i) => variableNames.indexOf(name) === i
  );
  return {
    variableNames: uniqueVariableNames,
    artefacts: parts,
  };
};

export const applyReplacements = (
  { artefacts, variableNames }: IdentifiedVariables,
  variableMap: { [key: string]: string },
  text: string
) => {
  return artefacts.reduce<string>((acc, part) => {
    const variableName = variableNames.find(
      (name) => part.indexOf(name) !== -1
    );
    if (variableName) {
      return acc.replace(part, variableMap[variableName] || '');
    }
    return acc;
  }, text);
};
