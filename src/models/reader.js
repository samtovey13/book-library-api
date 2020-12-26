module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Email cannot be empty',
        },
        isEmail: {
          args: [true],
          msg: 'Not a valid email',
        },
        
      }      
      
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Name cannot be empty',
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Password cannot be empty',
        },
        len: {
          args: [8, 30],
          msg: 'Password must have at least 8 characters',
        },
      }
      
    },
  };

  return sequelize.define('Reader', schema);
};
