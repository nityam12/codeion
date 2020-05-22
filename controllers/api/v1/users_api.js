const jwt = require('jsonwebtoken');

const User = require('../../../models/user');
// sign in and create a session for the user
module.exports.createSession = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.password !== req.body.password) {
      return res.json(422, {
        message: 'invalid username or password',
      });
    }
    // to make a token json token
    return res.json(200, {
      message: 'sign in successful here is your token keep it safe',
      data: {
        token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: '100000' }), //encryption key)
      },
    });
  } catch (err) {
    console.log('***', err);
    return res.json(500, {
      message: 'internal server error',
    });
  }
};
