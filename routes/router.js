const adminRoutes = require('./adminRoute')
const userRoutes = require('./userRoute')
const productRoutes = require('./productRoute')
const clientRoute = require('./clientRoute')
const orderRoutes = require('./orderRoute')
const analyseRoutes = require('./analyseRoutes')
const loginRoutes = require('./loginRoute')
const jwt = require('jsonwebtoken')
const { decode } = require('punycode')
function route(app){
    app.use('/api/login', loginRoutes)
    app.use('/api/*', async (req, res, next) => {
        try {
            req.headers.authorization = req.headers.authorization.split(' ')
            req.headers.authorization = req.headers.authorization[req.headers.authorization.length - 1]
            const decoded = await new Promise((resolve, reject) => {
            jwt.verify(req.headers.authorization, process.env.ADMIN_CODE, (err, decoded) => {
                if (err) {
                reject(err)
                } else {
                resolve(decoded)
                }
            })
            })
            req.body.Gmail = decoded.Gmail
            req.body.UserName = decoded.UserName
            req.body.Role = decoded.Role
            req.body.FullName = decoded.FullName
            if(decoded.FirstLogin == false){
                next()
            }
            else{
                res.status(401).json({ error: 'Unauthorized' })
            }
        } catch (error) {
            // Handle error, for example, send an unauthorized response
            res.status(401).json({ error: 'Unauthorized' })
        }
    })
    app.use('/api/user', userRoutes)
    app.use('/api/product', productRoutes)
    app.use('/api/customer', clientRoute)
    app.use('/api/order', orderRoutes)
    app.use('/api/analyse', analyseRoutes)
    app.use('/api/*', async (req, res, next) => {
        try {
            const decoded = await new Promise((resolve, reject) => {
            jwt.verify(req.headers.authorization, process.env.ADMIN_CODE, (err, decoded) => {
                if (err) {
                reject(err)
                } else {
                resolve(decoded)
                }
            })
            })
            if(decoded.Role == 'admin'){
                next()
            }
            else{
                res.status(401).json({ error: 'Unauthorized' })
            }
            
        } catch (error) {
            // Handle error, for example, send an unauthorized response
            res.status(401).json({ error: 'Unauthorized' })
        }
    })
    app.use('/api/admin', adminRoutes)
    app.use('/api/*', (err,req, res) => {
        res.status(404).json({error: "Link not found"})
    })
}

module.exports = route