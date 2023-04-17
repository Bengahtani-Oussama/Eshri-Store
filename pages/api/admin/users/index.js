import nextConnect from 'next-connect';
import User from '@/models/user/User';
import { isAdmin, isAuth } from '@/utils/auth/auth';
import db from '@/utils/DB/db';

const handler = nextConnect();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
