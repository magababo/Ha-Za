import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemContainer from '../components/maincomponents/ItemContainer';
import { Colors } from '../components/utils/_var';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

export const MainpageWrapper = styled.div`
  .main {
    display: flex;
    min-height: calc(100vh - 137px);
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;
const MainContainer = styled.div`
  display: flex;
  /* width: 90rem; */
  justify-content: space-between;
  // border: 1px solid black;
  position: sticky;
  /* modified values */
  width: 100vw;
  padding: 1rem;
  padding-top: 0;
`;

const MakeContainer = styled.div`
  // border: 1px solid white;
  /* width: 75.1%; */
  margin-bottom: 10px;
  /* modified values */
  width: 100vw;
  margin-left: 4rem;
`;

const Mainpage = (): JSX.Element => {
  const level = ['ToDo', 'Doing', 'Done'];
  const [list, setList] = useState<{ id: number; type: string; content: string }[]>([]);
  const listNumber = list.length === 0 ? 1 : list.length + 1;
  const [item, setItem] = useState({
    id: listNumber,
    type: 'ToDo',
    content: ''
  });
  const [openInput, setOpenInput] = useState(false);
  const token = localStorage.getItem('accessToken');
  const handleInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [key]: e.target.value, id: listNumber });
  };
  const handleAddItem = () => {
    if (token) {
      // Login Mode
      axios
        .post(`${process.env.REACT_APP_API_URL}/todo`, item, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then(() => {
          setOpenInput(false);
          window.location.replace('/');
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      // Guest Mode
      list.push(item);
      setList([...list]);
      console.log('list', list);
      console.log('session', sessionStorage);
      sessionStorage.setItem('list', JSON.stringify(list));
      setOpenInput(false);
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/todo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((res: AxiosResponse<any>) => {
          console.log('res:', res.data.data.userTodo);
          setList(res.data.data.userTodo);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (sessionStorage.length > 0) {
        setList(JSON.parse(sessionStorage['list']));
      }
    }
  }, []);

  return (
    <MainpageWrapper>
      <div className="main">
        <MakeContainer>
          {openInput ? (
            <button
              onClick={() => {
                setOpenInput(false);
              }}>
              x
            </button>
          ) : (
            <button
              onClick={() => {
                setOpenInput(true);
              }}>
              +
            </button>
          )}
          {openInput ? (
            <>
              <input onChange={handleInput('content')}></input>
              <button onClick={handleAddItem}>add</button>
            </>
          ) : null}
        </MakeContainer>
        <MainContainer>
          {level.map((el, key) => {
            return <ItemContainer key={key} level={el} list={list} />;
          })}
        </MainContainer>
      </div>
    </MainpageWrapper>
  );
};

export default Mainpage;
