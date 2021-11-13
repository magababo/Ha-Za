const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      // const { userId } = req.body;
      const userId = accessTokenData.id;

      const userTodo = await todos.findAll({
        where: {
          userId: userId
        }
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
