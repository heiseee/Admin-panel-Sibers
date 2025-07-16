const {Users, Role} = require('../models/models')

class ShowController {
    async getAll(req, res, next) {
        const { page = 1, perPage = 10, sort = 'username', order = 'ASC', search = '' } = req.query;
        
        const offset = (page - 1) * perPage;
        
        const where = {};
        
        const { count, rows: users } = await Users.findAndCountAll({attributes: ['username, first_name, birthdate'], where,include: [{ model: Role, attributes: ['role'] }],
            attributes: { exclude: ['password'] },
            order: [[sort, order]],
            limit: parseInt(perPage),
            offset: parseInt(offset)
        });
        
        res.json({
            users,
            total: count
        });
    }

    async getOne(req, res, next) {
        let {id} = req.params;
        console.log(id)
        id = JSON.parse(id)
        const users = await Users.findByPk(id);
        return res.json(users);
    }
}

module.exports = new ShowController();