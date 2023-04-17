const { default: mongoose } = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// check if this model exist or create a new model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
