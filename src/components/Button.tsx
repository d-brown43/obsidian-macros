import styled from 'styled-components';
import { OUTLINE_COLOUR } from '../styling';

export default styled.button`
  &:focus {
    outline: 1px solid ${OUTLINE_COLOUR};
  }
`;
