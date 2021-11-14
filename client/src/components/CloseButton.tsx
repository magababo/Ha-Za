import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Colors } from './utils/_var';

export const CloseIcon = styled.div`
  display: flex;
  justify-content: right;
  padding-right: 1rem;
  font-size: 1.1rem;
  cursor: pointer;
`;

type CloseProp = {
  onClick: (a: any) => void;
};

const CloseButton = ({onClick}: CloseProp)  => {
  return (
    <CloseIcon onClick={onClick}>
      <FontAwesomeIcon icon={faTimes} color={Colors.gray} />
    </CloseIcon>
  );
};

export default CloseButton;
