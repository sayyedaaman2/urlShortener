module.exports = (sequelize, Sequelize)=>{
    const User = sequelize.define("Users",{
        
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username : {
            type : Sequelize.STRING,
            unique : true
        },
        email : {
            type : Sequelize.STRING,
            unique : true,
            allowNull : false,
            lowerCase : true
        },
        password : {
            type : Sequelize.STRING,
            allowNull : false
        }
    }, {
        tableName : "Users"
    });
    return User;
}