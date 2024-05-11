const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');

const Database = require('./db');
const db = new Database();
db.initialize();

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(favicon(__dirname + '/public/favicon.ico'));


app.use((req, res, next) => {
    console.log("Adding Db to request");
    req.db = db;
    next();
})

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            id: req.session.user.id,
            username: req.session.user.username
        }
    }
    next()
})

app.set('view engine', 'pug');
const authRoutes = require('./serverroutes/authenticate');
app.use('/', authRoutes);

const renderRoutes = require('./serverroutes/render');
app.use('/', renderRoutes);

app.listen(8080, () => {
    console.log('Server is running  on port 8080')
});


