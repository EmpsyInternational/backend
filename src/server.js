const express =  require('express');
const app = express();
const cors = require('cors');
const _var = require('./global/_var.js');

/*********** Dependency ***********/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true}));

/*********** Route ***********/

const Router = require('./routes/auth.routes.js')

app.listen(_var.PORT, (err) => {
    if (err) throw err;
    console.log(`Servidor corriendo en el puerto: http://localhost:${_var.PORT}`);
})

app.use(Router)