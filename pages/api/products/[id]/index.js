import nextConnect from 'next-connect';
import Product from '@/models/product/Product';
import db from '@/utils/DB/db';

const handler = nextConnect();

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
