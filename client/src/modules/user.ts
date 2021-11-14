const LOG_IN = 'user/LOG_IN' as const;
const LOG_OUT = 'user/LOG_OUT' as const;
const TOKEN_EXPIRED = 'user/TOKEN_EXPIRED' as const;

export const userLogin = (token: string, userID: string) => ({
  type: LOG_IN,
  payload: {
    token,
    userID
  }
});

export const userLogout = () => ({
  type: LOG_OUT
});

export const tokenExpired = (token: string, isExpired: boolean, userID: string) => ({
  type: TOKEN_EXPIRED,
  payload: {
    token,
    isExpired,
    userID
  }
});

type UserAction =
  | ReturnType<typeof userLogin>
  | ReturnType<typeof userLogout>
  | ReturnType<typeof tokenExpired>;

type UserState = {
  token: string;
  isExpired: boolean;
  userID: string;
};

const initialState: UserState = {
  token: '',
  isExpired: false,
  userID: ''
};

function user(state: UserState = initialState, action: UserAction): UserState {
  switch (action.type) {
    case LOG_IN:
      return {
        token: action.payload.token,
        isExpired: false,
        userID: action.payload.userID
      };
    case LOG_OUT:
      return {
        token: '',
        isExpired: false,
        userID: ''
      };
    case TOKEN_EXPIRED:
      return {
        token: action.payload.token,
        isExpired: action.payload.isExpired,
        userID: action.payload.userID
      };
    default:
      return state;
  }
}

export default user;
