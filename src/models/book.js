module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    ISBN: DataTypes.BIGINT(13),
  };

  return sequelize.define('Book', schema);
};
