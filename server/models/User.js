module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coffee_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    friend: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  return User;
};
