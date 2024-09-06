const { verifyUser } = require('../models/auth');

const controller = {}

controller.getAuth = async (req,res) => {
    try {   
        const { correo } = req.body;
        console.log(req.body);
        
        const user = await verifyUser( { correo });

         if (!user.status && user.message === 'User not found') {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.status(user.code).json(user);
        }

    } catch (err) {
        console.log(err);
        
        res.status(500).json({ error: 'Error en el Servidor' });
    }
}


module.exports = controller