import nc from 'next-connect';
import { isAdmin, isAuth } from '@/utils/auth/auth';
import Product from '@/models/product/Product';
import db from '@/utils/DB/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.category = req.body.category;
    product.image = req.body.image;
    product.price = req.body.price;
    product.brand = req.body.brand;
    product.isNews = Boolean(req.body.isNews);
    product.isFeatured = Boolean(req.body.isFeatured);
    product.MinimumPurchase = req.body.MinimumPurchase;
    product.MaximumPurchase = req.body.MaximumPurchase;
    product.countInStock = req.body.countInStock;
    product.desc = req.body.desc;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findByIdAndDelete(req.query.id);
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } catch (error) {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default handler;
