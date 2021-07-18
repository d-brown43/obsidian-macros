import { useMemo } from 'react';
import styled from 'styled-components';
import { getMacro } from '../redux';
import { useSelector } from 'react-redux';
import { BORDER_COLOUR, CLEVER_TEXT_WRAP } from '../styling';

const Preview = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  padding-bottom: 1rem;
  ${CLEVER_TEXT_WRAP}
`;

const Row = styled.div`
  margin: 0;
  &:not(:last-child) {
    border-bottom 1px solid ${BORDER_COLOUR};
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
`;

const Result = styled.div`
  max-height: 3rem;
  line-height: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow-y: auto;
  width: 100%;
`;

const Heading = styled.strong`
  display: block;
`;

type Props = {
  macroId: string;
  doReplacements: () => string;
};

const ApplyPreview = ({ macroId, doReplacements }: Props) => {
  const selector = useMemo(() => getMacro(macroId), [macroId]);
  const macro = useSelector(selector);
  const result = useMemo(doReplacements, [doReplacements]);

  if (!macro) {
    return null;
  }

  return (
    <Preview>
      <Row>
        <Heading>Preview</Heading>
        <Result>{result}</Result>
      </Row>
    </Preview>
  );
};

export default ApplyPreview;
