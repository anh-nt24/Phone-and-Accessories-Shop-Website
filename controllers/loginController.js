loginService = require('../services/loginService')

class login{
    login = async (req, res) => {
        let object = await loginService.login(req.body)
        return res.status(object.status).json(object)
    }
    validateAccount = async (req, res) => {
        let object = await loginService.validateAccount(req.params)
        return res.status(object.status).json(object)
    }
    changeInfo = async (req, res) => {
        let object = await loginService.changeInfo(req.body)
        return res.status(object.status).json(object)
    }
}

module.exports = new login