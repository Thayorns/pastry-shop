module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ingredients: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chapter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {});

    return Product;
}