import nextConnect from 'next-connect';
import Product from '@/models/product/Product';
import db from '@/utils/DB/db';


const handler = nextConnect();

handler.get(async (req, res) => {
  await db.connect();

  const products = await Product.find({});

  await db.disconnect();

  res.send(products);
});

export default handler;
