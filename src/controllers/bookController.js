import Book from "../models/Book.js";
import esClient from "../config/es.js";


export const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);


    await esClient.index({
      index: "books",
      id: book._id.toString(),
      document: {
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price
      }
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await esClient.search({
      index: "books",
      query: {
        multi_match: {
          query: q,
          fields: ["title", "author", "description"]
        }
      }
    });

    res.json(result.hits.hits.map(hit => hit._source));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
