const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      const todoList = req.body;
      const todoTypes = Object.keys(req.body);

      if (todoTypes.includes('todo') && todoTypes.includes('done')) {
        const todoIds = todoList.todo.map((el) => el.id);
        const doneIds = todoList.done.map((el) => el.id);
        await todos.update({ type: 'todo' }, { where: { todoId: todoIds } });
        await todos.update({ type: 'done' }, { where: { todoId: doneIds } });
      } else if (todoTypes.includes('doing') && todoTypes.includes('done')) {
        const doingIds = todoList.doing.map((el) => el.id);
        const doneIds = todoList.done.map((el) => el.id);
        await todos.update({ type: 'doing' }, { where: { todoId: doingIds } });
        await todos.update({ type: 'done' }, { where: { todoId: doneIds } });
      } else if (todoTypes.includes('todo') && todoTypes.includes('doing')) {
        const todoIds = todoList.todo.map((el) => el.id);
        const doingIds = todoList.doing.map((el) => el.id);
        await todos.update({ type: 'doing' }, { where: { todoId: todoIds } });
        await todos.update({ type: 'doing' }, { where: { todoId: doingIds } });
      }

      res.status(200).json({ message: 'ok' });
    }
  } catch (err) {
    res.status(400).json({ message: 'error' });
  }
};
