import nextConnect from 'next-connect';
import Order from '@/models/order/Order';
import { isAuth, isAdmin } from '@/utils/auth/auth';
import db from '@/utils/DB/db';
import User from '@/models/user/User';
import Product from '@/models/product/Product';
import { onError } from '@/utils/error/error';

const handler = nextConnect({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const orderPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  await db.disconnect();
  res.send({ usersCount, ordersCount, productsCount, orderPrice, salesData });
});

export default handler;
