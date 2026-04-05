const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let books = [];

// Add Book
app.post("/addBook", (req, res) => {
  const book = { id: Date.now(), ...req.body, available: true };
  books.push(book);
  res.send("Book Added");
});

// Get Books
app.get("/books", (req, res) => {
  res.json(books);
});

// Search
app.get("/search", (req, res) => {
  const { title } = req.query;
  const result = books.filter(b =>
    b.title.toLowerCase().includes(title.toLowerCase())
  );
  res.json(result);
});

// Issue
app.post("/issue/:id", (req, res) => {
  books = books.map(b =>
    b.id == req.params.id
      ? { ...b, available: false, issuedTo: req.body.user, dueDate: req.body.dueDate }
      : b
  );
  res.send("Issued");
});

// Return
app.post("/return/:id", (req, res) => {
  books = books.map(b =>
    b.id == req.params.id
      ? { ...b, available: true, issuedTo: "", dueDate: null }
      : b
  );
  res.send("Returned");
});

// Delete
app.delete("/delete/:id", (req, res) => {
  books = books.filter(b => b.id != req.params.id);
  res.send("Deleted");
});

app.listen(5000, () => console.log("Server running on 5000"));