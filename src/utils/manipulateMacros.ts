type IdentifiedVariables = {
  variableNames: string[];
  artefacts: string[];
};

const convertToVariable = (part: string) => {
  return part.replace(/{\s*/, '').replace(/\s*}/, '');
};

const isVariableForArtefact = (artefact: string, variableName: string) => {
  return convertToVariable(artefact) === variableName;
};

export const identifyMacros = (macroString: string): IdentifiedVariables => {
  const parts = macroString.match(/{([^}^{]+)}/g) || [];
  const variableNames = parts.map((part) => convertToVariable(part));
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
  getVariableContent: (variableName: string) => string,
  text: string
) => {
  if (artefacts.length === 0) {
    return text;
  }

  type Reduction = {
    workingText: string;
    parts: {
      start: string;
      end: string;
      variableName: string;
    }[];
  };
  // Scan string and split into string parts, keeping track of which variable
  // caused a split. Need to scan first, as we need to find out where the variables
  // are, to prevent any insertions that also contain things that look like
  // variables from being interpreted as variables during the replacement step
  const stringParts = artefacts.reduce<Reduction>(
    (acc, part) => {
      const { workingText, parts } = acc;

      const partIndex = workingText.indexOf(part);
      if (partIndex === -1) return acc;

      // Split string by the first occurrence of the variable pattern
      const split = [
        workingText.substr(0, partIndex),
        workingText.substr(partIndex + part.length),
      ];
      const variableName = variableNames.find((variable) =>
        isVariableForArtefact(part, variable)
      );
      if (!variableName) return acc;
      return {
        workingText: split[1],
        parts: [
          ...parts,
          {
            start: split[0],
            end: split[1],
            variableName,
          },
        ],
      };
    },
    {
      workingText: text,
      parts: [],
    }
  );

  // rejoin the resolved macro, replacing with the variables' contents
  return stringParts.parts.reduce((acc, part, i) => {
    const reduction = acc.concat(
      part.start,
      getVariableContent(part.variableName)
    );
    let addition = '';
    if (i === stringParts.parts.length - 1) {
      addition = part.end;
    }
    return reduction + addition;
  }, '');
};
