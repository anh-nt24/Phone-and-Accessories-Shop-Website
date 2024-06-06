require('dotenv').config({path:'./config.env'})

const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const routes = require('./routes/router')
const connectDB = require('./config/database')
const defaultAdmin = require('./config/defaultAdmin')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

connectDB()
defaultAdmin()

app.engine('hbs', handlebars.engine({ extname: '.hbs'}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/admin', (req, res) => {
    res.render('admin/home', { partial: 'adminDashboard' });
})

app.get('/admin/employee', (req, res) => {
    res.render('admin/home', { partial: 'adminEmployee' });
})

app.get('/admin/product', (req, res) => {
    res.render('admin/home', { partial: 'adminProduct' });
})

app.get('/admin/statistic', (req, res) => {
    res.render('admin/home', { partial: 'adminStatistic' });
})

app.get('/changepassword', (req, res) => {
    res.render('changepassword', {layout: false});
})

app.get('/profile', (req, res) => {
    res.render('profile', {layout: false});
})

app.get('/statistic', (req, res) => {
    res.render('index', { partial: 'statistic' });
})

app.get('/customer', (req, res) => {
    res.render('index', { partial: 'customer' });
})


app.get('/', (req, res) => {
    res.render('index', { partial: 'home' });
})

app.get('/login', (req, res) => {
    res.render('login');
})

// APIs
routes(app)


// Error handling
app.use((req, res, next) => {
    res.render('404')
});

app.use((err, req, res) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
  })

module.exports = app