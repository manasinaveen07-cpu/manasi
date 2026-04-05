const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/libraryDB");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  available: { type: Boolean, default: true },
  issuedTo: String,
  dueDate: Date,
});

const Book = mongoose.model("Book", BookSchema);

// Add Book
app.post("/addBook", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.send("Book Added");
});

// Get Books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Search
app.get("/search", async (req, res) => {
  const { title } = req.query;
  const books = await Book.find({
    title: { $regex: title, $options: "i" },
  });
  res.json(books);
});

// Issue
app.post("/issue/:id", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, {
    available: false,
    issuedTo: req.body.user,
    dueDate: req.body.dueDate,
  });
  res.send("Issued");
});

// Return
app.post("/return/:id", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, {
    available: true,
    issuedTo: "",
    dueDate: null,
  });
  res.send("Returned");
});

// Delete
app.delete("/delete/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

app.listen(5000, () => console.log("Server running on 5000"));