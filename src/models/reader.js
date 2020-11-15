module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  };

  return sequelize.define('Reader', schema);
};
