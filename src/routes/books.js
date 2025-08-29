import express from "express";
import Book from "../models/Book.js";
import esClient from "../config/es.js";
import { upload } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

import { auth } from "../middleware/auth.js";

const requireLogin = auth();
const requireAdmin = auth(['admin']);

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().limit(20);
    res.json(books);
  } catch (err) {
    console.log("Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books", books: [] });
  }
});

// Add book (admin only)
router.post("/add", requireAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("Adding book with data:", req.body);
    console.log("Uploaded file:", req.file);

    const bookData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock) || 0
    };

    // Add image data if file was uploaded
    if (req.file) {
      bookData.image = req.file.path; // Cloudinary URL
      bookData.imagePublicId = req.file.filename; // Cloudinary public_id
    }

    const book = await Book.create(bookData);

    // Index in Elasticsearch
    await esClient.index({
      index: "books",
      id: book._id.toString(),
      document: {
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        price: book.price,
        image: book.image
      }
    });

    res.status(201).json({ message: "Book added successfully!", book });
  } catch (err) {
    console.log("Error adding book:", err);
    res.status(500).json({ error: err.message || "Failed to add book" });
  }
});

// Search books - accessible to all users
router.get("/search", async (req, res) => {
  try {
    const { q, genre, minPrice, maxPrice } = req.query;
    
    if (!q && !genre && !minPrice && !maxPrice) {
      return res.json({ 
        books: [], 
        query: "",
        filters: { genre: "", minPrice: "", maxPrice: "" },
        totalResults: 0
      });
    }

    let books = [];
    let totalResults = 0;
    let useElasticsearch = true;

    // Try Elasticsearch first
    try {
      // Build the search query
      let searchQuery = {};

      if (q) {
        // Simplified search query
        searchQuery = {
          multi_match: {
            query: q,
            fields: ["title", "author", "genre", "description"],
            fuzziness: "AUTO"
          }
        };
      } else {
        searchQuery = { match_all: {} };
      }

      console.log("Search query:", JSON.stringify(searchQuery, null, 2));

      const result = await esClient.search({
        index: "books",
        query: searchQuery,
        size: 50
      });

      books = result.hits.hits.map(hit => ({
        ...hit._source,
        _id: hit._id,
        _score: hit._score
      }));

      totalResults = result.hits.total.value || result.hits.total;
      console.log(`Elasticsearch found ${books.length} books`);

    } catch (esError) {
      console.log("Elasticsearch error, falling back to MongoDB:", esError.message);
      useElasticsearch = false;
      
      // Fallback to MongoDB search
      let mongoQuery = {};
      
      if (q) {
        mongoQuery = {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        };
      }

      // Add filters for MongoDB
      if (genre) {
        mongoQuery.genre = { $regex: genre, $options: 'i' };
      }

      if (minPrice || maxPrice) {
        mongoQuery.price = {};
        if (minPrice) mongoQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) mongoQuery.price.$lte = parseFloat(maxPrice);
      }

      books = await Book.find(mongoQuery).limit(50);
      totalResults = await Book.countDocuments(mongoQuery);
      console.log(`MongoDB found ${books.length} books`);
    }

    // Apply additional filters if using MongoDB fallback
    if (!useElasticsearch) {
      if (genre) {
        books = books.filter(book => 
          book.genre && book.genre.toLowerCase().includes(genre.toLowerCase())
        );
      }

      if (minPrice || maxPrice) {
        books = books.filter(book => {
          const price = parseFloat(book.price);
          if (minPrice && price < parseFloat(minPrice)) return false;
          if (maxPrice && price > parseFloat(maxPrice)) return false;
          return true;
        });
      }
    }

    res.json({ 
      books,
      query: q || "",
      filters: {
        genre: genre || "",
        minPrice: minPrice || "",
        maxPrice: maxPrice || ""
      },
      totalResults: totalResults,
      searchMethod: useElasticsearch ? "Elasticsearch" : "MongoDB"
    });

  } catch (err) {
    console.log("Search error:", err);
    res.status(500).json({ 
      books: [], 
      query: req.query.q || "",
      filters: { genre: "", minPrice: "", maxPrice: "" },
      error: err.message,
      totalResults: 0
    });
  }
});

// Debug route to check Elasticsearch connection (admin only)
router.get("/debug-es", requireAdmin, async (req, res) => {
  try {
    // Check ES connection
    const health = await esClient.cluster.health();
    console.log("ES Health:", health);

    // Check if books index exists
    const indexExists = await esClient.indices.exists({ index: "books" });
    console.log("Books index exists:", indexExists);

    // Get index mapping
    let mapping = {};
    if (indexExists) {
      mapping = await esClient.indices.getMapping({ index: "books" });
    }

    // Get some sample documents
    let sampleDocs = [];
    if (indexExists) {
      try {
        const sample = await esClient.search({
          index: "books",
          size: 5
        });
        sampleDocs = sample.hits.hits;
      } catch (e) {
        console.log("Error getting sample docs:", e.message);
      }
    }

    res.json({
      health,
      indexExists,
      mapping,
      sampleDocs,
      message: "Elasticsearch debug info"
    });

  } catch (err) {
    console.log("ES Debug error:", err);
    res.status(500).json({
      error: err.message,
      connected: false,
      message: "Elasticsearch connection failed"
    });
  }
});

// Reindex all books (admin only) - useful for fixing search issues
router.post("/reindex", requireAdmin, async (req, res) => {
  try {
    console.log("Starting reindex process...");

    // Delete existing index if it exists
    try {
      await esClient.indices.delete({ index: "books" });
      console.log("Deleted existing books index");
    } catch (e) {
      console.log("No existing index to delete");
    }

    // Create new index with proper mapping
    await esClient.indices.create({
      index: "books",
      body: {
        mappings: {
          properties: {
            title: { type: "text", analyzer: "standard" },
            author: { type: "text", analyzer: "standard" },
            genre: { 
              type: "text", 
              analyzer: "standard",
              fields: {
                keyword: { type: "keyword" }
              }
            },
            description: { type: "text", analyzer: "standard" },
            price: { type: "float" },
            stock: { type: "integer" },
            image: { type: "text", index: false },
            imagePublicId: { type: "text", index: false }
          }
        }
      }
    });

    // Get all books from MongoDB
    const books = await Book.find({});
    console.log(`Found ${books.length} books in MongoDB`);

    // Index each book
    for (const book of books) {
      await esClient.index({
        index: "books",
        id: book._id.toString(),
        body: {
          title: book.title,
          author: book.author,
          genre: book.genre,
          description: book.description,
          price: book.price,
          stock: book.stock,
          image: book.image,
          imagePublicId: book.imagePublicId
        }
      });
    }

    console.log("Reindex completed successfully");
    res.json({
      success: true,
      message: `Successfully reindexed ${books.length} books`,
      booksCount: books.length
    });

  } catch (err) {
    console.log("Reindex error:", err);
    res.status(500).json({
      error: err.message,
      message: "Reindex failed"
    });
  }
});

// Get single book for editing (admin only)
router.get("/edit/:id", requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.log("Error fetching book:", err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// Update book (admin only)
router.put("/edit/:id", requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    console.log("Updating book with data:", req.body);
    console.log("Uploaded file:", req.file);

    const updateData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock) || 0
    };

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (book.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(book.imagePublicId);
        } catch (deleteError) {
          console.log("Error deleting old image:", deleteError);
        }
      }
      
      // Add new image data
      updateData.image = req.file.path; // Cloudinary URL
      updateData.imagePublicId = req.file.filename; // Cloudinary public_id
    }

    // Update book in database
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update in Elasticsearch
    try {
      await esClient.update({
        index: "books",
        id: req.params.id,
        doc: {
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          description: updatedBook.description,
          price: updatedBook.price,
          image: updatedBook.image
        }
      });
    } catch (esError) {
      console.log("Elasticsearch update error:", esError);
      // Don't fail the entire operation if ES update fails
    }

    res.json({ success: true, message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.log("Error updating book:", err);
    res.status(500).json({ error: err.message || "Failed to update book" });
  }
});

// Delete book (admin only)
router.delete("/delete/:id", requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete image from Cloudinary if it exists
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    // Delete from database
    await Book.findByIdAndDelete(req.params.id);

    // Delete from Elasticsearch
    try {
      await esClient.delete({
        index: "books",
        id: req.params.id
      });
    } catch (esError) {
      console.log("Elasticsearch delete error:", esError);
      // Don't fail the entire operation if ES delete fails
    }

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.log("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

export default router;
