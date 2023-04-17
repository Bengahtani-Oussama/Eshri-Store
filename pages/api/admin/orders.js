import nextConnect from 'next-connect';
import Order from '@/models/order/Order';
import { isAuth, isAdmin } from '@/utils/auth/auth';
import db from '@/utils/DB/db';
import { onError } from '@/utils/error/error';

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({}).populate('user', 'name');
  await db.disconnect();
  res.send(orders);
});

export default handler;
