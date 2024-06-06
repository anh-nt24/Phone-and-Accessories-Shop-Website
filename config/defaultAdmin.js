const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const user = require('../models/User')
const userService = require('../services/adminService')

const defaultAdmin = async () => {
    admin = await user.find(
        {Role: 'admin'}
    ).exec()
    if(admin.length === 0){
        userService.defaultAdmin()
        return 'Generated default admin account'
    }
    return 'Already have admin account'
}
module.exports = defaultAdmin