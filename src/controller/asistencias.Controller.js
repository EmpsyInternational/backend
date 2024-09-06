const { registrarAsistencia,getAsistencias } = require('../models/auth');

const controller = {}
controller.postRegistrarAsistencia = async (req, res) => {
    const { id_alumno, id_materia, fecha, presente,titulo } = req.body;
    console.log(req.body);
    
    if (!id_alumno || !id_materia || !fecha || !presente || !titulo) {
        return res.status(400).json({
            status: false,
            message: 'Datos incompletos o inválidos'
        });
    }

    try {
        const result = await registrarAsistencia({ id_alumno, id_materia, fecha, presente, titulo });

        return res.status(result.code).json(result);

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            status: false,
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
};


controller.getAsistencias = async (req, res) => {
    try {
        // Llama al método para obtener todas las asistencias
        const result = await getAsistencias();

        // Si el resultado es exitoso, envía la respuesta con el estado 200 y los datos
        if (result.status) {
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            // En caso de error en la obtención de asistencias
            return res.status(result.code).json({
                success: false,
                message: result.message
            });
        }
    } catch (err) {
        // Manejo de errores del servidor
        return res.status(500).json({
            success: false,
            message: 'Error del servidor al obtener asistencias',
            error: err.message
        });
    }
};

module.exports = controller;
