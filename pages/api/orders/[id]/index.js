import nextConnect from 'next-connect';
import db from '@/utils/DB/db';
import Order from '@/models/order/Order';
import { isAuth } from '@/utils/auth/auth';

const handler = nextConnect();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const order = await Order.findById(req.query.id);

  await db.disconnect();

  res.send(order);
});

export default handler;
