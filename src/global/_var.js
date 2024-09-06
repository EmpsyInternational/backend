require('dotenv').config();

/********* Server **********/

const PORT = process.env.PORT

/********** DATABASE  *********/

const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_NAME = process.env.PG_NAME
const PG_HOST = process.env.PG_HOST

/*********** KEY  *************/

const KEY = process.env.KEY

/*********** ROUTE *************/

const AUTH = process.env.AUTH
const REGISTER = process.env.REGISTER
const GETASISTENCIAS = process.env.GETASISTENCIAS

module.exports = {
    PORT,
    PG_USER,
    PG_PASSWORD,
    PG_NAME,
    PG_HOST,
    KEY,
    AUTH,
    REGISTER,
    GETASISTENCIAS
}