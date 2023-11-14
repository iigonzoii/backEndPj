const router = require ('express').Router()

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });
const { restoreUser } = require('../../utils/auth.js');
const { setTokenCookie } = require('../../utils/auth.js');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

module.exports = router
