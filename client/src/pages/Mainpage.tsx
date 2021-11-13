import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { setTodo, setDoing, setDone, postTodo, editTodo, deleteTodo } from '../modules/todo';
import styled from 'styled-components';
import { Colors } from 'src/components/utils/_var';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Flex } from 'grid-styled';

interface Item {
  id: string;
  content: string;
  type: string;
}
interface IAppState {
  items: Item[];
  doing: Item[];
  done: Item[];
}
interface IMoveResult {
  droppable: Item[];
  droppable2: Item[];
  droppable3: Item[];
}

// container overflow

const MainpageWrapper = styled.div`
  min-height: calc(100vh - 137px);
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  .title {
    color: ${Colors.mediumGray};
    margin-bottom: 0.5rem;
  }
  .icon-container {
    display: inline;
    float: right;
  }
  .icon {
    cursor: pointer;
    text-align: right;
    margin-left: 0.4rem;
    color: ${Colors.lightGray};
    &:hover {
      color: ${Colors.darkGreen};
    }
  }
  input {
    outline: none;
  }
`;

const AddButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  color: ${Colors.lightGray};
  outline: none;
  border: none;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  &:hover {
    color: ${Colors.green};
  }
`;

// const ContentButton = styled.div`
//   cursor: pointer;
//   background-color: transparent;
//   color: ${Colors.lightGray};
//   outline: none;
//   border: none;
//   margin-bottom: 0.5rem;
//   font-size: 1rem;
//   &:hover {
//     color: ${Colors.green};
//   }
// `;

const AddInput = styled.input`
  outline: none;
`;

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): IMoveResult | any => {
  const sourceClone = [...source];
  const destClone = [...destination];
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid: number = 8;

const getItemStyle = (draggableStyle: any, isDragging: boolean): {} => ({
  userSelect: 'none',
  padding: 2 * grid,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? Colors.green : Colors.black,
  color: isDragging ? Colors.black : Colors.green,
  borderRadius: 4,
  border: `1px solid ${Colors.darkGray}`,
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): {} => ({
  backgroundColor: 'black',
  padding: grid,
  width: 300,
  height: '70vh',
  borderRadius: 4,
  border: `1px solid ${Colors.darkGray}`
});

function Mainpage() {
  const todoList = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch();

  // console.log(todoList);
  let tempTodos: Array<any> = todoList.todoItem;
  let tempDoings: Array<any> = todoList.doingItem;
  let tempDones: Array<any> = todoList.doneItem;

  const id2List = {
    droppable: 'items',
    droppable2: 'doing',
    droppable3: 'done'
  };
  const [todos, setTodos] = useState({
    items: tempTodos || [],
    doing: tempDoings || [],
    done: tempDones || []
  });

  function getList(id: string): Item[] {
    return todos[id2List[id]];
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index);

      let state: IAppState = { ...todos };

      if (source.droppableId === 'droppable2') {
        state = { ...state, doing: items };
        dispatch(setDoing(state.doing));
      } else if (source.droppableId === 'droppable3') {
        state = { ...state, done: items };
        dispatch(setDone(state.done));
      } else if (source.droppableId === 'droppable') {
        state = { ...state, items };
        dispatch(setTodo(state.items));
      }
      setTodos(state);
    } else {
      const resultFromMove: IMoveResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      if (source.droppableId !== 'droppable2' && destination.droppableId !== 'droppable2') {
        setTodos({
          ...todos,
          items: resultFromMove.droppable,
          done: resultFromMove.droppable3
        });

        resultFromMove.droppable.map((el) => (el.type = 'todo'));
        resultFromMove.droppable3.map((el) => (el.type = 'done'));
        dispatch(setTodo(resultFromMove.droppable));
        dispatch(setDone(resultFromMove.droppable3));
      } else if (source.droppableId !== 'droppable' && destination.droppableId !== 'droppable') {
        setTodos({
          ...todos,
          doing: resultFromMove.droppable2,
          done: resultFromMove.droppable3
        });
        resultFromMove.droppable2.map((el) => (el.type = 'doing'));
        resultFromMove.droppable3.map((el) => (el.type = 'done'));
        dispatch(setDoing(resultFromMove.droppable2));
        dispatch(setDone(resultFromMove.droppable3));
      } else if (source.droppableId !== 'droppable3' && destination.droppableId !== 'droppable3') {
        setTodos({
          ...todos,
          items: resultFromMove.droppable,
          doing: resultFromMove.droppable2
        });
        resultFromMove.droppable.map((el) => (el.type = 'todo'));
        resultFromMove.droppable2.map((el) => (el.type = 'doing'));
        dispatch(setTodo(resultFromMove.droppable));
        dispatch(setDoing(resultFromMove.droppable2));
      }
    }
  }

  const [addOpen, setAddOpen] = useState(false);
  const [input, setInput] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState('');

  const handleAddOpen = () => {
    if (!addOpen) setAddOpen(true);
    else setAddOpen(false);
  };
  const handleEditOpen = (item: any) => {
    console.log(item.id);
    if (!editOpen) {
      setEditOpen(true);
      setEditId(item.id);
      setEditInput('');
    } else if (editOpen && item.id === editId) {
      dispatch(editTodo(item.id, item.type, editInput));
      window.location.replace('/');
    } else {
      setEditOpen(false);
      setEditId(null);
      setEditInput('');
    }
  };

  const addTodo = () => {
    if (input.length) {
      const todoItem = {
        id: String(tempTodos.length + tempDoings.length + tempDones.length + 1),
        type: 'todo',
        content: input
      };
      console.log(todoItem);
      dispatch(postTodo(todoItem));
      window.location.replace('/');
    } else console.log('empty input'); // 추후에 모달창으로 대체
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value);
  };
  const handleDelete = (item: any) => {
    // console.log(item);
    dispatch(deleteTodo(item.id, item.type));
    window.location.replace('/');
  };

  return (
    <MainpageWrapper>
      {!addOpen ? (
        <AddButton onClick={handleAddOpen}>+ 할 일 추가</AddButton>
      ) : (
        <>
          <AddInput onChange={handleInput} />
          <AddButton onClick={addTodo}>추가</AddButton>
          <AddButton onClick={handleAddOpen}>취소</AddButton>
        </>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex justifyContent={'space-between'}>
          <Flex flexDirection="column">
            <Droppable droppableId="droppable">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  <div className="title">To Do</div>
                  {todos.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(
                        providedDraggable: DraggableProvided,
                        snapshotDraggable: DraggableStateSnapshot
                      ) => (
                        <div>
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={getItemStyle(
                              providedDraggable.draggableProps.style,
                              snapshotDraggable.isDragging
                            )}>
                            {editOpen && item.id === editId ? (
                              <input onChange={handleEditInput} />
                            ) : (
                              item.content
                            )}
                            <div className="icon-container">
                              <FontAwesomeIcon
                                className="icon"
                                onClick={() => handleEditOpen({ id: item.id, type: 'ToDo' })}
                                icon={faEdit}
                                size="1x"
                              />
                              <FontAwesomeIcon
                                className="icon"
                                onClick={() => handleDelete({ id: item.id, type: 'ToDo' })}
                                icon={faTrash}
                                size="1x"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Flex>
          <Droppable droppableId="droppable2">
            {(
              providedDroppable2: DroppableProvided,
              snapshotDroppable2: DroppableStateSnapshot
            ) => (
              <div
                ref={providedDroppable2.innerRef}
                style={getListStyle(snapshotDroppable2.isDraggingOver)}>
                <div className="title">Doing</div>
                {todos.doing.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(
                      providedDraggable2: DraggableProvided,
                      snapshotDraggable2: DraggableStateSnapshot
                    ) => (
                      <div>
                        <div
                          ref={providedDraggable2.innerRef}
                          {...providedDraggable2.draggableProps}
                          {...providedDraggable2.dragHandleProps}
                          style={getItemStyle(
                            providedDraggable2.draggableProps.style,
                            snapshotDraggable2.isDragging
                          )}>
                          {item.content}
                          <div className="icon-container">
                            <FontAwesomeIcon
                              className="icon"
                              onClick={() => handleEditOpen({ id: item.id, type: 'Doing' })}
                              icon={faEdit}
                              size="1x"
                            />
                            <FontAwesomeIcon
                              className="icon"
                              onClick={() => handleDelete({ id: item.id, type: 'Doing' })}
                              icon={faTrash}
                              size="1x"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable2.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable3">
            {(
              providedDroppable3: DroppableProvided,
              snapshotDroppable3: DroppableStateSnapshot
            ) => (
              <div
                ref={providedDroppable3.innerRef}
                style={getListStyle(snapshotDroppable3.isDraggingOver)}>
                <div className="title">Done</div>
                {todos.done.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(
                      providedDraggable3: DraggableProvided,
                      snapshotDraggable3: DraggableStateSnapshot
                    ) => (
                      <div>
                        <div
                          ref={providedDraggable3.innerRef}
                          {...providedDraggable3.draggableProps}
                          {...providedDraggable3.dragHandleProps}
                          style={getItemStyle(
                            providedDraggable3.draggableProps.style,
                            snapshotDraggable3.isDragging
                          )}>
                          {item.content}
                          <div className="icon-container">
                            <FontAwesomeIcon
                              className="icon"
                              onClick={() => handleEditOpen({ id: item.id, type: 'Done' })}
                              icon={faEdit}
                              size="1x"
                            />
                            <FontAwesomeIcon
                              className="icon"
                              onClick={() => handleDelete({ id: item.id, type: 'Done' })}
                              icon={faTrash}
                              size="1x"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable3.placeholder}
              </div>
            )}
          </Droppable>
        </Flex>
      </DragDropContext>
    </MainpageWrapper>
  );
}

export default Mainpage;
