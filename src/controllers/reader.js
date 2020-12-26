const { 
  getItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem
} = require('./helpers');

const getReaders = (_, res) => {
  getItems(res, 'reader')
};

const createReader = (req, res) => {
  createItem(res, 'reader', req.body);
}

const updateReader = (req, res) => {
  updateItem(res, 'reader', req.body, req.params.id);
}

const getReaderById = (req, res) => {
  getItemById(res, 'reader', req.params.id);
}

const deleteReader = (req, res) => {
  deleteItem(res, 'reader', req.params.id);
}

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader
}