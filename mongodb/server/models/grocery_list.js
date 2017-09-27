module.exports = function(conn, Sequelize) {
    
    return conn.define('grocery_list', {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        upc12: {
            type: Sequelize.BIGINT,
            allowNull: true
        },

        brand: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        name: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'grocery_list',
        timestamps: false
    });
};