const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      const userId = accessTokenData.id;
      const { type, content } = req.body;

      const makeTodoList = await todos.create({
        userId: userId,
        type: type,
        content: content
      });

      return res.status(200).json({
        data: {
          makeTodoList
        },
        message: 'ok'
      });
    }
  } catch (err) {
    res.status(400).json({ message: 'error' });
    console.log(err);
  }
};
