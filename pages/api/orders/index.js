import nextConnect from 'next-connect';
import Order from '@/models/order/Order';
import { isAuth } from '@/utils/auth/auth';
import db from '@/utils/DB/db';
import { onError } from '@/utils/error/error';

const handler = nextConnect({
  onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();

  const newOrder = new Order({
    ...req.body,
    user: req.user._id /**  */,
  });
  const order = await newOrder.save();
  res.status(201).send(order);
});

export default handler;
