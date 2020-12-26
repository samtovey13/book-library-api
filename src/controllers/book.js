const { Book } = require('../models');

const getBooks = (_, res) => {
  Book.findAll().then(books => {
    res.status(200).json(books);
  });
}

const createBook = (req, res) => {
  const newBook = req.body;

  Book
    .create(newBook)
    .then(newBookCreated => res.status(201).json(newBookCreated))
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);
      return res.status(404).json({ error: errorMessages});
    });
}

const updateBook = (req, res) => {
  const { id } = req.params;
  const newDetails = req.body;

  Book
    .update(newDetails, { where: { id } })
    .then(([recordsUpdated]) => {
      if (!recordsUpdated) {
        res.status(404).json({ error: 'The book could not be found.' });
    } else {
      Book.findByPk(id).then((updatedBook) => {
        res
        .status(200)
        .json(updatedBook);
      })}
    })
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);
      return res.status(404).json({ error: errorMessages});
    });
}

const getBookById = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then(book => {
    if (!book) {
      res
        .status(404)
        .json({ error: 'The book could not be found.' });
    } else {
      res
        .status(200)
        .json(book);
    }
  });
}

const deleteBook = (req, res) => {
  const { id } = req.params;

  Book
    .findByPk(id)
    .then(foundBook => {
      if (!foundBook) {
        res.status(404).json({ error: 'The book could not be found.' });
      } else {
        Book
          .destroy({ where: { id } })
          .then(() => {
            res.status(204).send();
        });
    }
  });
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}