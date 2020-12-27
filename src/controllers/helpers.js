const { Reader, Book } = require('../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader
  };
  return models[model];
}

const get404Error = (model) => ({ error: `The ${model} could not be found.`});

const removePassword = (obj) => {
  if (obj.hasOwnProperty('password')) {
    delete obj.password;
  }
  return obj;
};

const getItems = (res, model) => {
  const Model = getModel(model);
  Model.findAll().then(items => {
    const itemsWithoutPassword = items.map((item) => removePassword(item.dataValues));
    res.status(200).json(itemsWithoutPassword);
  });
}

const createItem = (res, model, item) => {
  const Model = getModel(model);

  Model
    .create(item)
    .then(newItem => {
      const itemWithoutPassword = removePassword(newItem.dataValues);
      res.status(201).json(itemWithoutPassword)
    })
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
        const itemWithoutPassword = removePassword(updatedRecord.dataValues);
        res.status(200).json(itemWithoutPassword);
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
      const itemWithoutPassword = removePassword(item.dataValues);
      res.status(200).json(itemWithoutPassword);
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