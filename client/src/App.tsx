import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './modules';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Mainpage from './pages/Mainpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Mypage from './pages/Mypage';
import Modal from './components/Modal';
import Notification from './components/Notification';
import { Colors } from './components/utils/_var';
import Notice from './components/Notice';

const AppWrapper = styled.div`
  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .App {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: ${Colors.black};
  }
`;

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [openNotice, setOpenNotice] = useState(false);
  const isLogin = useSelector((state: RootState) => state.user).token;

  const handleLoginModalOpen = () => {
    setOpenLogin(true);
  };
  const handleSignupModalOpen = () => {
    setOpenSignup(true);
  };
  const handleLoginModalClose = () => {
    setOpenLogin(false);
  };
  const handleSignupModalClose = () => {
    setOpenSignup(false);
  };
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const handleMessage = (msg: string) => {
    setMessage(msg);
  };
  const handleNotice = (boolean: boolean) => {
    setOpenNotice(boolean);
  };

  return (
    <BrowserRouter>
      <AppWrapper>
        <div className="App">
          <Header
            login={handleLoginModalOpen}
            signup={handleSignupModalOpen}
            modal={handleModalOpen}
            handleMessage={handleMessage}
            handleNotice={handleNotice}
          />
          <Notice />
          {openModal ? <Modal handleModal={handleModalClose} login={handleLoginModalOpen} /> : null}
          <Switch>
            <Route exact path="/">
              <Mainpage
                modal={handleModalOpen}
                handleMessage={handleMessage}
                handleNotice={handleNotice}
              />
            </Route>
            <Route path="/mypage">
              {isLogin ? (
                <Mypage
                  modal={handleModalOpen}
                  handleMessage={handleMessage}
                  handleNotice={handleNotice}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
          </Switch>
          {openNotice ? (
            <Notification
              modal={handleModalOpen}
              message={message}
              handleNotice={handleNotice}
              handleMessage={handleMessage}
            />
          ) : null}
          <Footer />
          {openSignup ? (
            <Signup
              handleModal={handleSignupModalClose}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
            />
          ) : null}
          {openLogin ? (
            <Login
              signup={handleSignupModalOpen}
              handleModal={handleLoginModalClose}
              handleMessage={handleMessage}
              handleNotice={handleNotice}
            />
          ) : null}
        </div>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
