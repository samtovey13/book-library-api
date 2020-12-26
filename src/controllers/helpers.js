const { Reader, Book } = require('../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader
  };
  return models[model];
}

const get404Error = (model) => ({ error: `The ${model} could not be found.`});

const getItems = (res, model) => {
  const Model = getModel(model);
  Model.findAll().then(items => {
    res.status(200).json(items);
  });
}

const createItem = (res, model, item) => {
  const Model = getModel(model);

  Model
    .create(item)
    .then(newItemCreated => res.status(201).json(newItemCreated))
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);
      return res.status(404).json({ error: errorMessages});
    });
}

const updateItem = (res, model, item, id) => {
  const Model = getModel(model);

  Model
    .update(item, { where: { id } })
    .then(([recordsUpdated]) => {
      if (!recordsUpdated) {
        res.status(404).json(get404Error(model));
    } else {
      Model.findByPk(id).then((updatedRecord) => {
        res.status(200).json(updatedRecord);
      })}
    })
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);
      return res.status(404).json({ error: errorMessages});
    });
}

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id).then(item => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      res.status(200).json(item);
    }
  });
}

const deleteItem = (res, model, id) => {
  const Model = getModel(model);

  Model
    .findByPk(id)
    .then(item => {
      if (!item) {
        res.status(404).json(get404Error(model));
      } else {
        Model
          .destroy({ where: { id } })
          .then(() => {
            res.status(204).send();
        });
    }
  });
}

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem
}