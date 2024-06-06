analyseService = require('../services/analyseService')

class analyse{
    getAnalyticReport = async (req, res) => {
        let object = await analyseService.getAnalyticReport(req.body)
        return res.status(object.status).json(object)
    }
}

module.exports = new analyse