import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '@/models/user/User';
import db from '@/utils/DB/db';
import { isAuth, singToken } from '@/utils/auth/auth';

const handler = nextConnect();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();

  const user = await User.findById(req.user._id);
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;

  await user.save();

  await db.disconnect();

  const token = singToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
