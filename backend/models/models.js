const { DataTypes } = require('sequelize')
const sequelize = require('../db')


const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type:DataTypes.STRING, unique:true, allowNull:false},
    password: {type:DataTypes.STRING, allowNull:false},
    first_name: {type:DataTypes.STRING},
    last_name: {type:DataTypes.STRING},
    gender: {type:DataTypes.STRING},
    birthdate:{type: DataTypes.DATE},
    id_Role: {type: DataTypes.INTEGER}
},{
    timestamps:false,
    tableName:'users'
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role: {type: DataTypes.STRING}
},{
    timestamps:false,
    tableName:'role'
})

Role.hasMany(Users, {foreignKey: 'id_Role'});
Users.belongsTo(Role,  {foreignKey: 'id_Role'});

module.exports = {
    Users,
    Role
}