import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../modules/user';
import { setItems } from '../modules/todo';
import axios, { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { Colors } from '../components/utils/_var';
import { Alertbox, Backdrop, InputField } from '../components/UserComponents';
import CloseButton from '../components/CloseButton';
import logo from '../images/logo.png';

export const LoginView = styled.div`
  box-sizing: border-box;
  width: 19rem;
  height: 21rem;
  background-color: ${Colors.black};
  position: relative;
  text-align: center;
  padding-top: 0.7rem;
  .logo {
    width: 7.5rem;
    margin: 0.7rem auto 1rem;
  }
`;

export const LoginInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

export const LoginButton = styled.button`
  margin: 0.2rem 0.4rem 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: ${Colors.green};
  width: 13.2rem;
  height: 2.5rem;
  border-radius: 7px;
  border: none;
  color: white;
  :hover {
    background-color: ${Colors.darkGreen};
  }
`;

export const SignupSpan = styled.span`
  font-size: 0.85rem;
  margin: auto 0.2rem auto 0.1rem;
  text-align: right;
  color: ${(props) => props.color};
  cursor: pointer;
  :hover {
    color: ${(props) => (props.color === Colors.green ? Colors.darkGreen : props.color)};
  }
`;

type LoginProp = {
  signup: () => void;
  handleModal: () => void;
  handleMessage: (a: string) => void;
  handleNotice: (a: boolean) => void;
};

function Login({ signup, handleModal, handleMessage, handleNotice }: LoginProp) {
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({
    userId: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoginRequest();
    }
  };

  const handleLoginRequest = () => {
    if (loginInfo.userId === '' || loginInfo.password === '') {
      setErrorMsg('모든 항목을 입력해 주세요');
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, loginInfo, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then((res: AxiosResponse<any>) => {
          localStorage.setItem('accessToken', res.data.accessToken);
          handleModal();
          handleNotice(true);
          handleMessage('로그인 성공!');
          return res.data.accessToken;
        })
        .then((token) => {
          axios
            .get(process.env.REACT_APP_API_URL + '/user-info', {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            .then((res: AxiosResponse<any>) => {
              dispatch(userLogin(token, res.data.data.userId));
              localStorage.setItem('userId', JSON.stringify(res.data.data.userId));
            })
            .then(() => {
              axios
                .get(process.env.REACT_APP_API_URL + '/todo', {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                })
                .then((res: AxiosResponse<any>) => {
                  const todoList = res.data.data.userTodo;
                  const todoItems: Array<object> = [];
                  const doingItems: Array<object> = [];
                  const doneItems: Array<object> = [];
                  todoList.map((el: any) => {
                    if (el.type === 'todo') {
                      todoItems.push(el);
                    } else if (el.type === 'doing') {
                      doingItems.push(el);
                    } else if (el.type === 'done') {
                      doneItems.push(el);
                    }
                  });
                  dispatch(setItems(todoItems, doingItems, doneItems));
                });
            });
        })
        .catch((error) => {
          if (error.response.data.message === 'please check your password and try again') {
            setErrorMsg('잘못된 비밀번호입니다');
          }
          if (error.response.data.message === 'Invalid user') {
            setErrorMsg('등록되지 않은 아이디입니다');
          }
          console.log(error.response.data.message);
        });
    }
  };

  const goSignup = () => {
    handleModal();
    signup();
  };

  return (
    <Backdrop>
      <LoginView>
        <CloseButton onClick={handleModal} />
        <img className="logo" src={logo} alt="logo" />
        <LoginInputContainer>
          <InputField
            onChange={handleInputValue('userId')}
            onKeyPress={(e) => {
              enter(e);
            }}
            placeholder="아이디"
          />
          <InputField
            type="password"
            onChange={handleInputValue('password')}
            onKeyPress={(e) => {
              enter(e);
            }}
            placeholder="비밀번호"
          />
        </LoginInputContainer>
        <LoginButton onClick={handleLoginRequest}>로그인</LoginButton>
        <div>
          <SignupSpan color={Colors.lightGray}>아직 회원이 아니신가요?</SignupSpan>
          <SignupSpan color={Colors.green} onClick={goSignup}>
            회원가입
          </SignupSpan>
        </div>
        <Alertbox>{errorMsg}</Alertbox>
      </LoginView>
    </Backdrop>
  );
}

export default Login;
