const { default: mongoose } = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    desc: { type: String, required: true },
    reviews: [reviewSchema],
    featuredImage: { type: String },
    featuredImage: {
      image: { type: String },
      caption: { type: String },
    },

    isFeatured: { type: Boolean, required: true, default: false },
    isNews: { type: Boolean, required: true, default: false },
    MinimumPurchase: { type: Number, required: true },
    MaximumPurchase: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// check if this model exist or create a new model
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
