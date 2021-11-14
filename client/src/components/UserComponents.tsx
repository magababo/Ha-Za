import styled from 'styled-components';
import { Colors } from './utils/_var';

export const Alertbox = styled.div`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.8rem;
`;

export const Backdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  height: 100%;
`;

export const InputField = styled.input`
  background-color: #f2f2f2;
  border: none;
  border-radius: 15px;
  width: 13.5rem;
  height: 2.2rem;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  color: ${Colors.darkGray};
  :focus {
    outline: none;
  }
  &::-webkit-input-placeholder {
    color: ${Colors.gray};
    font-size: 0.8rem;
  }
`;
