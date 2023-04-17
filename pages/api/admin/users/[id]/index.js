import nextConnect from 'next-connect';
import { isAuth, isAdmin } from '@/utils/auth/auth';
import User from '@/models/user/User';
import db from '@/utils/DB/db';

const handler = nextConnect();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();

  const user = await User.findById(req.query.id);

  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);

    await user.save();
    await db.disconnect();
    res.send({ message: 'User Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User Not Found' });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findByIdAndDelete(req.query.id);
    await db.disconnect();
    res.send({ message: 'User Deleted!' });
  } catch (error) {
    await db.disconnect();
    res.status(404).send({ message: 'User Not found!' });
  }
});
export default handler;
