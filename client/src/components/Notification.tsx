import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Colors } from './utils/_var';
require('dotenv').config();

interface InnerScreen {
  topMargin: string;
}

export const NoticeBackdrop = styled.div`
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

export const NoticeView = styled.div`
  box-sizing: border-box;
  position: relative;
  text-align: center;
  width: 16.5rem;
  height: 9.5rem;
  background-color: ${Colors.black};
  color: ${Colors.lightGray};
  padding: 0.8rem;
`;

export const Message = styled.div<InnerScreen>`
  margin-top: ${(props) => props.topMargin};
  font-size: 1rem;
`;

export const NoticeButton = styled.button`
  margin-top: 1rem;
  background-color: ${Colors.green};
  border: none;
  border-radius: 10px;
  height: 1.7rem;
  font-size: 0.9rem;
  width: 7rem;
  color: white;
  cursor: pointer;
  :hover {
    background-color: ${Colors.darkGreen};
  }
`;

export const NoticeClose = styled.button`
  margin-top: 1rem;
  background-color: ${Colors.green};
  border: none;
  border-radius: 10px;
  width: 7rem;
  height: 1.7rem;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  :hover {
    background-color: ${Colors.darkGreen};
  }
`;

export const CloseIcon = styled.div`
  display: flex;
  justify-content: right;
  padding-bottom: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
`;

type NotiProp = {
  modal: () => void;
  message: string;
  handleMessage: (a: string) => void;
  handleNotice: (a: boolean) => void;
};

function Notification({ modal, message, handleNotice, handleMessage }: NotiProp) {
  const token = useSelector((state: RootState) => state.user).token;

  const withdrawalRequest = () => {
    axios
      .delete(process.env.REACT_APP_API_URL + '/withdrawal', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 200) {
          handleNotice(true);
          handleMessage('회원탈퇴가 완료되었습니다.');
          localStorage.clear();
        }
      })
      .catch((error) => {
        if (error.response.data.message === "You're not logged in") {
          modal();
        } else console.log(error.response.data.message);
      });
  };

  return (
    <NoticeBackdrop>
      <NoticeView>
        <CloseIcon>
          <FontAwesomeIcon
            icon={faTimes}
            color={Colors.gray}
            onClick={() => {
              handleNotice(false);
            }}
          />
        </CloseIcon>
        <Message
          topMargin={
            message === '정말 탈퇴하시겠습니까?' ||
            message === '로그인 성공!' ||
            message === '로그아웃 성공!' ||
            message === '회원가입 성공!' ||
            message === '회원탈퇴가 완료되었습니다.'
              ? '.4rem'
              : '1rem'
          }>
          {message}
        </Message>
        {message === '로그인 성공!' ||
        message === '로그아웃 성공!' ||
        message === '회원가입 성공!' ||
        message === '회원탈퇴가 완료되었습니다.' ? (
          <NoticeButton
            onClick={() => {
              window.location.replace('/');
            }}>
            메인화면으로
          </NoticeButton>
        ) : message === '비밀번호가 변경되었습니다.' ? (
          <NoticeClose
            onClick={() => {
              window.location.replace('/mypage');
            }}>
            확인
          </NoticeClose>
        ) : message === '정말 탈퇴하시겠습니까?' ? (
          <NoticeButton onClick={withdrawalRequest}>탈퇴하기</NoticeButton>
        ) : null}
      </NoticeView>
    </NoticeBackdrop>
  );
}

export default Notification;
