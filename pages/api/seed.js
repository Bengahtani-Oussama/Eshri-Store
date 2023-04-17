import nextConnect from 'next-connect';

import db from '@/utils/DB/db';
import Product from '@/models/product/Product';
import data from '@/utils/data/data';
import User from '@/models/user/User';

const handler = nextConnect();

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany(); // Users => Model Of user
  await User.insertMany(data.users);
  await Product.deleteMany(); // Products => Model Of Product
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'seeded successfully!' });
});

export default handler;
