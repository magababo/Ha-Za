const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    // const accessTokenData = { id: req.headers.authorization };

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      // const { userId } = req.body;
      const userId = accessTokenData.id;

      let userTodo = await todos.findAll({
        where: {
          userId: userId
        }
      });

      userTodo = Sequelize.getValues(userTodo);
      userTodo = userTodo.map((el) => {
        return { id: el.todoId, type: el.type, content: el.content };
      });

      return res.status(200).json({
        data: {
          userTodo
        },
        message: 'ok'
      });
    }
  } catch (err) {
    res.status(400).json({ message: 'error' });
    console.log(err);
  }
};
