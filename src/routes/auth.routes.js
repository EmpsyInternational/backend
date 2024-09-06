const { AUTH, REGISTER,GETASISTENCIAS } = require('../global/_var.js');
const express = require('express');
const route = express.Router();


/************ Controller  **********/

const getInfoController = require('../controller/getInfo.Controller.js');
const asistenciasController = require('../controller/asistencias.Controller.js')
/*********** Router ************/

route.post(AUTH, getInfoController.getAuth);
route.post(REGISTER,asistenciasController.postRegistrarAsistencia)
route.get(GETASISTENCIAS,asistenciasController.getAsistencias)

module.exports = route;