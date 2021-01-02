module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: [true],
          msg: 'Genre cannot be empty'
        },
        notEmpty: {
          args: [true],
          msg: 'Genre cannot be empty'
        },
      }
    }
  }
  return sequelize.define('Genre', schema);
}
