// import { useEffect } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../utils/_var';

const Card = styled.div`
  /* border: 1px solid black; */
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-right: 10px;
  padding-left: 10px;
  margin-top: 10px;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  /* modified values */
  border: 1px solid ${Colors.darkGray};
  border-radius: 5px;
  color: ${Colors.mediumGray};
  color: ${Colors.green};
  font-weight: bold;
  background-color: ${Colors.black};
  :active {
    cursor: grabbing;
  }
`;

const Content = styled.div`
  // border: 1px solid black;
  text-align: center;
  width: 100%;
  position: sticky;
  // font-size: 20px;
`;

const ButtonContainer = styled.div`
  // border: 1px solid black;
  width: 100%;
  text-align: right;
`;

const Button = styled.button`
  background-color: ${Colors.mediumGray};
  border-radius: 5px;
  margin-left: 0.2rem;
  border: 0;
  &:hover {
    background-color: ${Colors.green};
  }
`;

const Space = styled.span`
  // border: 1px solid black;
  width: 100%;
  visibility: hidden;
`;

type ItemCardProps = {
  id: number;
  content: string;
  type: string;
  itemList: { id: number; type: string; content: string }[];
};

function ItemCard({ id, content, type, itemList }: ItemCardProps) {
  const token = localStorage.getItem('accessToken');
  const deleteItem = () => {
    console.log(id);
    if (token) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/todo`, {
          headers: {
            authorization: `Bearer ${token}`
          },
          data: {
            id: id
          }
        })
        .then(() => {
          window.location.replace('/');
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      const deletedList = JSON.parse(sessionStorage['list']).filter(
        (el: { id: number; content: string; type: string }) => {
          return el.id !== id;
        }
      );
      console.log(deletedList);
      sessionStorage.setItem('list', JSON.stringify(deletedList));
      window.location.replace('/');
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [item, setItem] = useState({
    id: id,
    type: type,
    content: content
  });
  const handleEditInput =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setItem({ ...item, [key]: e.target.value });
    };

  const editItem = () => {
    if (token) {
      // Login Mode
      axios
        .patch(`${process.env.REACT_APP_API_URL}/todo`, item, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then((res) => {
          console.log(res);
          window.location.replace('/');
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      // Guest Mode
      const list = JSON.parse(sessionStorage['list']);
      const editTodo = list.filter((el: { id: number; content: string; type: string }) => {
        return el.id === id;
      })[0];
      editTodo.type = item.type;
      editTodo.content = item.content;
      sessionStorage.setItem('list', JSON.stringify(list));
      window.location.replace('/');
    }
  };

  return (
    <Card>
      <span>
        <Space>{id}</Space>
        <select onChange={handleEditInput('type')} value={item.type}>
          <option>ToDo</option>
          <option>Doing</option>
          <option>Done</option>
        </select>
      </span>
      {isEdit ? (
        <input placeholder={content} onChange={handleEditInput('content')} />
      ) : (
        <Content>{content}</Content>
      )}
      {isEdit ? (
        <ButtonContainer>
          <Button
            onClick={() => {
              setIsEdit(false);
              editItem();
            }}>
            ok
          </Button>
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          <Button
            onClick={() => {
              setIsEdit(true);
            }}>
            Edit
          </Button>
          <Button onClick={deleteItem}>Delete</Button>
        </ButtonContainer>
      )}
    </Card>
  );
}

export default ItemCard;
