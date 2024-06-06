const { userInfo } = require('os')

userService = require('../services/userService')


class user{
    login = async (req, res) => {
        let object = await userService.login(req.body)
        return res.status(object.status).json(object)
    }
    validateAccount = async (req, res) => {
        let object = await userService.validateAccount(req.params)
        return res.status(object.status).json(object)
    }
    getInfo = async (req, res) => {
        let object = await userService.getInfo(req.body)
        return res.status(object.status).json(object)
    }
}   

module.exports = new user