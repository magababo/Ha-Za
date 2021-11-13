const SET_ITEMS = 'todo/SET_ITEMS' as const;
const SET_TODO = 'todo/SET_TODO' as const;
const SET_DOING = 'todo/SET_DOING' as const;
const SET_DONE = 'todo/SET_DONE' as const;
const POST_TODO = 'todo/POST_TODO' as const;
const DELETE_TODO = 'todo/DELETE_TODO' as const;
const EDIT_TODO = 'todo/EDIT_TODO' as const;

export const setItems = (allTodos: Array<object>, allDoings: Array<object>, allDones: Array<object>) => ({
  type: SET_ITEMS,
  payload: {allTodos, allDoings, allDones}
});

export const setTodo = (todoInfo: Array<object>) => ({
  type: SET_TODO,
  payload: todoInfo
});

export const setDoing = (todoInfo: Array<object>) => ({
  type: SET_DOING,
  payload: todoInfo
});

export const setDone = (todoInfo: Array<object>) => ({
  type: SET_DONE,
  payload: todoInfo
});

export const postTodo = (todoInfo: object) => ({
  type: POST_TODO,
  payload: todoInfo
});

export const deleteTodo = (id: string, type: string) => ({
  type: DELETE_TODO,
  payload: { id, type }
});

export const editTodo = (id: string, type: string, content: string) => ({
  type: EDIT_TODO,
  payload: { id, type, content }
});

type TodoAction =
  | ReturnType<typeof setItems>
  | ReturnType<typeof setTodo>
  | ReturnType<typeof setDoing>
  | ReturnType<typeof setDone>
  | ReturnType<typeof postTodo>
  | ReturnType<typeof deleteTodo>
  | ReturnType<typeof editTodo>;

type TodoState = {
  todoItem: Array<object>;
  doingItem: Array<object>;
  doneItem: Array<object>;
};

const initialState: TodoState = {
  todoItem: [
    {
      id: '1',
      type: 'todo',
      content: '할 일1'
    },
    {
      id: '2',
      type: 'todo',
      content: '할 일2'
    },
    {
      id: '3',
      type: 'todo',
      content: '할 일3'
    }
  ],
  doingItem: [],
  doneItem: []
};

function todo(state: TodoState = initialState, action: TodoAction): TodoState {
  switch (action.type) {
    case SET_ITEMS:
      return {
        todoItem: action.payload.allTodos,
        doingItem: action.payload.allDoings,
        doneItem: action.payload.allDones
      };
    case SET_TODO:
      return {
        ...state,
        todoItem: action.payload
      };
    case SET_DOING:
      return {
        ...state,
        doingItem: action.payload
      };
    case SET_DONE:
      return {
        ...state,
        doneItem: action.payload
      };
    case POST_TODO:
      return {
        ...state,
        todoItem: [...state.todoItem, action.payload]
      };
    case DELETE_TODO:
      if (action.payload.type === 'ToDo') {
        return {
          ...state,
          todoItem: state.todoItem.filter((el: any) => el.id !== action.payload.id)
        };
      } else if (action.payload.type === 'Doing') {
        return {
          ...state,
          doingItem: state.doingItem.filter((el: any) => el.id !== action.payload.id)
        };
      } else {
        return {
          ...state,
          doneItem: state.doneItem.filter((el: any) => el.id !== action.payload.id)
        };
      }

    case EDIT_TODO:
      if (action.payload.type === 'ToDo') {
        return {
          ...state,
          todoItem: state.todoItem.map((el: any) => el.id === action.payload.id ? {...el, content: action.payload.content} : el)
        };
      } else if (action.payload.type === 'Doing') {
        return {
          ...state,
          doingItem: state.doingItem.map((el: any) => el.id === action.payload.id ? {...el, content: action.payload.content} : el)
        };
      } else {
        return {
          ...state,
          doneItem: state.doneItem.map((el: any) => el.id === action.payload.id ? {...el, content: action.payload.content} : el)
        };
      }
    default:
      return state;
  }
}

export default todo;
