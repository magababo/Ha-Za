import styled from 'styled-components';
import { NoticeButton } from './Notification';
import { Colors } from '../components/utils/_var';

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  height: 100vh;
`;

export const ModalView = styled.div`
  box-sizing: border-box;
  background-color: ${Colors.black};
  position: relative;
  text-align: center;
  color: ${Colors.darkGray};
  color: white;
  width: 16.5rem;
  height: 9.5rem;
  padding-top: 1.2rem;
`;

export const Content = styled.div`
  margin: 0.6rem auto 0;
  padding: auto 0.3rem;
  font-size: 1rem;
`;

export const LogOutButton = styled.button`
  margin-top: 0.5rem;
  background-color: ${Colors.gray};
  border: none;
  border-radius: 10px;
  width: 7rem;
  height: 1.7rem;
  padding-top: 0.1rem;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  :hover {
    color: black;
    background-color: ${Colors.lightGray};
  }
`;

type ModalProp = {
  login: () => void;
  handleModal: () => void;
};

function Modal({ handleModal, login }: ModalProp) {
  const goLogin = () => {
    handleModal();
    login();
  };

  const logout = () => {
    localStorage.clear();
    handleModal();
    window.location.replace('/');
  };

  return (
    <ModalBackdrop>
      <ModalView>
        <Content>[토큰 만료] 다시 로그인 하시겠습니까?</Content>
        <NoticeButton onClick={goLogin}>로그인</NoticeButton>
        <div>
          <LogOutButton onClick={logout}>로그아웃</LogOutButton>
        </div>
      </ModalView>
    </ModalBackdrop>
  );
}

export default Modal;
