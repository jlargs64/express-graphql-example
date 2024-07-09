import mongoose, { Schema } from 'mongoose';

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Book', BookSchema);
