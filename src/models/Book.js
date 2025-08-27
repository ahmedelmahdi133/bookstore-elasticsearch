import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String },
    image: { 
        type: String,
        default: 'https://via.placeholder.com/500x700?text=No+Image'
    },
    imagePublicId: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;