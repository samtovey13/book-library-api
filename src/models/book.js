module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Title cannot be empty',
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Author cannot be empty',
        }
      }
    },
    ISBN: {
      type: DataTypes.BIGINT(13),
    }
  };

  return sequelize.define('Book', schema);
};
