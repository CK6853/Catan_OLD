const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const enmap = require("enmap");
const cors = require("cors");

let getsRouter = require('./routes/get');
let setsRouter = require('./routes/set');
let gameRouter = require('./routes/game')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up database
const DB = new enmap({ name: 'DB' });
DB.defer;
console.log("Loaded database");

// Attach the database to the request object
app.use((req, res, next) => {
    req.DB = DB;
    next();
})

// Index - placeholder (this is the back-end, nobody should be coming here)
// Todo - have API docs? 
app.get('/', function(req, res, next) {
    res.json("Hi there");
})

// API call to reset all data
app.get('/reset', async function(req, res, next) {
    await DB.deleteAll();
    DB.set("settlements", [])
    console.log("Reset DB");
    res.json("Reset");
})

// API routes
app.use('/get', getsRouter);
app.use('/set', setsRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
