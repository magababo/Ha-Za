module.exports = {
  login: require('./user/login'),
  signup: require('./user/signup'),
  logout: require('./user/logout'),
  userinfo: require('./mypage/user-info'),
  edituserinfo: require('./mypage/edit-user-info'),
  withdrawal: require('./mypage/withdrawal'),
  getTodo: require('./mainpage/getTodo'),
  makeTodo: require('./mainpage/makeTodo'),
  editTodo: require('./mainpage/editTodo'),
  editType: require('./mainpage/editType'),
  deleteTodo: require('./mainpage/deleteTodo')
};
