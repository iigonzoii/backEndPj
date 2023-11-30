const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { enviroment } = require('./config');
const routes = require ('./routes')
const { ValidationError } = require('sequelize');
const bcrypt = require ('bcryptjs')
const isProduction = enviroment === 'production';
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
if (!isProduction) {
    app.use(cors());
}
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)
app.use(routes)
//* catch unhandled requests and forward to error handler
app.use((req, res, next) => {
    const err = new Error('The requested resource couldn\'t be found.');
    err.title = 'Resource Not Found';
    err.errors = {message: 'The requested resource couldn\'t be found.'};
    err.status = 404
    next(err)
});
//* Process sequelize errors
app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err)
})
//* error formatter
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    let stackerr = {}
    isProduction ? null :(stackErr = {stack: err.stack || null})
    res.json({
        message: err.message,
        errors: err.errors,
        ...stackerr
    });
});

module.exports = app;
