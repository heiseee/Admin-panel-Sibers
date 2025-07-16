const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {Users, Role} = require('../models/models')
const { where } = require('sequelize');

const generateJwt = (id, username, role) => {
    return jwt.sign(
        {id, username, role},
        'secret_key123',
        {expiresIn: '24h'}
    )
}


class AuthController{
    async create(req, res, next) {
        const {username, password, first_name, last_name, gender, birthdate} = req.body;
        if(!username || !password) {
            return res.status(404).json({message: "Вы ввели неверный логин или пароль."});
        }
        const candidate = await Users.findOne({where:{username}});
        if(candidate){
            return res.status(404).json({message: "Пользователь с таким логином уже существует."});
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await Users.create({username: username, password: hashPassword, first_name: first_name, last_name: last_name, gender: gender, birthdate: birthdate, id_Role: 1})
        res.status(200).json({message: "Пользователь успешно создан."})
    }

    async login(req, res, next){
        const {username, password} = req.body;
        const user = await Users.findOne({where:{username}})
        if(!username) {
            return (res.status(500).json({message: "Неверный пользователь или пароль."}));
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword) {
            return res.status(500).json({message: "Неверный пользователь или пароль."});
        }
        const token = generateJwt(user.id, user.username, user.id_Role);
        return res.json({token});
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { username, first_name, last_name, gender, birthdate, id_Role } = req.body;

        if (!id) {
            return res.status(404).json({message: "ID не указан."});
        }

        const user = await Users.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({message: "Пользователь не найден."});
        }

        if (id_Role) {
            const roleExists = await Role.findOne({ where: { id: id_Role } });
            if (!roleExists) {
                return res.status(404).json({message: "Указанная роль не существует."});
            }
        }

        if (username && username !== user.username) {
            const usernameExists = await Users.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(404).json({message: "Имя пользователя уже занято."});
            }
        }


        const updateData = {
            username: username || user.username,
            password: user.password,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            gender: gender || user.gender,
            birthdate: birthdate || user.birthdate,
            id_Role: id_Role || user.id_Role
        };

        await Users.update(updateData, { where: { id } });

        const updatedUser = await Users.findOne({where: { id }, include: [{ model: Role, attributes: ['role'] }], attributes: { exclude: ['password']}});
        return res.status(200).json({message: `Данные пользователя ${updatedUser.username} успешно изменены.`});
    }

    async delete(req, res, next) {
        const {id} = req.params;
        if (!id) {
            return res.status(404).json({message: "ID не указан."});
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({message: "Пользователь не найден."});
        }

        await Users.destroy({where: {id: id}})
        return res.status(200).json({message: `Пользователь ${user.username} успешно удален.`})
    }

    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.username, req.user.role);
        return res.json({token});
    }
}

module.exports = new AuthController();