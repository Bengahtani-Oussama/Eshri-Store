import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import { onError } from '@/utils/error/error';
import db from '@/utils/DB/db';
import Product from '@/models/product/Product';
import { isAuth } from '@/utils/auth/auth';

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  await db.disconnect();

  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ message: 'Product Not Found!' });
  }
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  if (product) {
    const existReview = product.reviews.find((rev) => rev.user == req.user._id);
    if (existReview) {
      await Product.updateOne(
        { _id: req.query.id, 'reviews._id': existReview._id },
        {
          $set: {
            'reviews.$.comment': req.body.comment,
            'reviews.$.rating': Number(req.body.rating),
          },
        }
      );
      await db.disconnect();
      return res.send({ message: 'Review Is Updated!' });
    } else {
      const review = {
        user: new mongoose.Types.ObjectId(req.user._id),
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      await product.save();
      await db.disconnect();
      res.status(201).send({ message: 'Review Submitted !' });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found!' });
  }
});

export default handler;
