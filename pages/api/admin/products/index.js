import nextConnect from 'next-connect';
import Product from '@/models/product/Product';
import { isAdmin, isAuth } from '@/utils/auth/auth';
import db from '@/utils/DB/db';

const handler = nextConnect();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'Product name',
    slug: 'Product-slug' + Math.random(),
    category: 'Product category',
    image: '/images/site/men/clothing/Crewneck-Sweatshirt/1.jpg',
    price: 0,
    brand: 'Product brand',
    isNews: false,
    isFeatured: false,
    rating: 0,
    MinimumPurchase: 1,
    MaximumPurchase: 1,
    numReviews: 0,
    countInStock: 0,
    desc: 'Product description',
  });
  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created Successfully!', product });
});

export default handler;
