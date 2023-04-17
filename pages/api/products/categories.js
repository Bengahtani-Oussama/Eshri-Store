import nextConnect from 'next-connect';
import Product from '@/models/product/Product';
import db from '@/utils/DB/db';

const handler = nextConnect();

handler.get(async (req, res) => {
  await db.connect();
  const categories = await Product.find().distinct('category');
  await db.disconnect();

  res.send(categories);
});

export default handler;
