import nextConnect from 'next-connect';
import Order from '@/models/order/Order';
import { isAuth } from '@/utils/auth/auth';
import db from '@/utils/DB/db';
import { onError } from '@/utils/error/error';


const handler = nextConnect({
  onError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const orders = await Order.find({user: req.user._id});
  
  res.send(orders);
});

export default handler;
