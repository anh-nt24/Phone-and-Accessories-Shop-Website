adminService = require('../services/adminService')

class admin{
    createUserAccount = async (req, res) => {
        let object = await adminService.createUserAccount(req.body)
        if(object.status == 200){
            await adminService.sendValidateMail(req.body, req.headers.host)
        }
        return res.status(object.status).json(object)
    }
    changePassword = async (req, res) => {
        object = adminService.changePassword(req.body)
        return res.status(object.status).json(object)
    }
    sendValidateMail = async(req, res) => {
        let object = await adminService.sendValidateMail(req.body, req.headers.host)
        return res.status(object.status).json(object)
    }
    validateMail = async(req, res) => {
        
    }
    getEmployeesList = async (req, res) => {
        let object = await adminService.getEmployeesList()
        return res.status(object.status).json(object)
    }
    getEmployeeById = async (req, res) => {
        let object = await adminService.getEmployeeById(req.params)
        return res.status(object.status).json(object)
    }
    lockOrUnlock = async (req, res) => {
        let object = await adminService.lockOrUnlock(req.params, req.body)
        return res.status(object.status).json(object)
    }
    getSaleOfEmployee = async (req, res) => {
        let object = await adminService.getSaleOfEmployee(req.params, req.body)
        return res.status(object.status).json(object)
    }
}

module.exports = new admin