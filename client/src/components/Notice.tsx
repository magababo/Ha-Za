import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../components/utils/_var';

interface InnerScreen {
  show: string;
}

const NoticeWrapper = styled.div<InnerScreen>`
  display: ${(props) => props.show};
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${Colors.black};
  z-index: 999;
  .container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  .notice {
    position: absolute;
    width: 22rem;
    height: 3.5rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    font-size: 0.9rem;
    color: ${Colors.lightGray};
  }
`;

function Notice() {
  const [navState, setNavState] = useState('active');

  useEffect(() => window.addEventListener('resize', maintainNavState));

  useEffect(() => {
    if (window.innerWidth < 768) setNavState('deactive');
  }, []);

  const maintainNavState = () => {
    if (window.innerWidth >= 768) {
      if (navState === 'active') setNavState('active');
    } else setNavState('deactive');
  };

  return (
    <NoticeWrapper show={navState === 'deactive' ? 'block' : 'none'}>
      <div className="container">
        <div className="notice">
          본 서비스는 데스크탑에 최적화되어 있습니다. <br />
          화면 사이즈를 조정하거나 PC 혹은 노트북에서 이용해주세요.
        </div>
      </div>
    </NoticeWrapper>
  );
}

export default Notice;
