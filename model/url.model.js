module.exports = (sequelize, Sequelize)=>{
    const urlShortener = sequelize.define('urlShortener',{
        id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        url : {
            type : Sequelize.STRING,
            allowNull : false
        },
        shortenedUrl : {
            type : Sequelize.STRING,
        }
    },{
        tableName : "ShortUrls"
    });
    return urlShortener;
}