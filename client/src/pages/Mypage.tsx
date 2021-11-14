import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import styled from 'styled-components';
import axios from 'axios';
import { Colors } from '../components/utils/_var';
import { Alertbox, InputField } from '../components/UserComponents';

export const MypageWrapper = styled.div`
  .main {
    display: flex;
    min-height: calc(100vh - 137px);
  }
`;

export const MypageView = styled.div`
  margin: 6rem auto;
  padding-top: 0.7rem;
  box-sizing: border-box;
  width: 19rem;
  height: 15rem;
  position: relative;
  text-align: center;

  input:disabled {
    background: ${Colors.mediumGray};
  }
`;

export const MypageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MypageButton = styled.button`
  cursor: pointer;
  width: 5.8rem;
  margin: 0.3rem 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 7px;
  border: 2px solid ${(props) => props.color};
  background-color: ${(props) => props.color};
  font-size: 0.85rem;
  color: white;
  :hover {
    background-color: ${Colors.darkGreen};
    border-color: ${Colors.darkGreen};
  }
  &:last-of-type {
    border: 2px solid ${Colors.gray};
    background-color: ${Colors.gray};
    color: white;
  }
  &:last-of-type:hover {
    background-color: white;
    color: black;
    border-color: ${Colors.lightGray};
    background-color: ${Colors.lightGray};
  }
`;

type MypageProp = {
  modal: () => void;
  handleMessage: (a: string) => void;
  handleNotice: (a: boolean) => void;
};

const Mypage = ({ modal, handleMessage, handleNotice }: MypageProp) => {
  const token = useSelector((state: RootState) => state.user).token;
  const userID = useSelector((state: RootState) => state.user).userID;

  const [checkPassword, setCheckPassword] = useState(false);
  const [checkRetypePassword, setCheckRetypePassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [userInfo, setUserInfo] = useState({
    password: ''
  });

  const handleInputValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  const isValidPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
    if (regExp.test(e.target.value)) {
      setCheckPassword(true);
    } else {
      setCheckPassword(false);
    }
  };

  const handleCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '' && e.target.value === userInfo.password) {
      setCheckRetypePassword(true);
    } else {
      setCheckRetypePassword(false);
    }
  };

  const inputCheck = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputValue(key)(e);
    if (key === 'password') {
      isValidPassword(e);
    }
  };

  const handleEditRequest = () => {
    if (userInfo.password === '') {
      setErrorMsg('변경할 비밀번호를 입력해주세요');
    } else if (checkPassword !== true) {
      setErrorMsg('비밀번호 형식을 확인해주세요');
    } else if (checkRetypePassword !== true) {
      setErrorMsg('비밀번호가 일치하지 않습니다');
    } else {
      axios
        .patch(process.env.REACT_APP_API_URL + '/user-info', userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 200) {
            handleNotice(true);
            handleMessage('비밀번호가 변경되었습니다.');
          }
        })
        .catch((error) => {
          if (error.response.data.message === "You're not logged in") {
            modal();
          } else console.log(error.response.data.message);
        });
    }
  };

  const handleWithdrawalRequest = () => {
    handleNotice(true);
    handleMessage('정말 탈퇴하시겠습니까?');
  };

  return (
    <MypageWrapper>
      <div className="main">
        <MypageView>
          <MypageInputContainer>
            <InputField disabled placeholder={userID} />
            <InputField
              type="password"
              onChange={inputCheck('password')}
              placeholder="비밀번호 (영문, 숫자 반드시 포함)"
            />
            <InputField
              type="password"
              onChange={handleCheckPassword}
              placeholder="비밀번호 재확인"
            />
          </MypageInputContainer>
          <MypageButton onClick={handleEditRequest} color={Colors.green}>
            정보수정
          </MypageButton>
          <MypageButton onClick={handleWithdrawalRequest} color={Colors.darkGray}>
            회원탈퇴
          </MypageButton>
          <Alertbox>{errorMsg}</Alertbox>
        </MypageView>
      </div>
    </MypageWrapper>
  );
};

export default Mypage;
