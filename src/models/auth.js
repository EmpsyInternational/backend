const pool = require('../utils/mysql.connect');
const { KEY } = require('../global/_var.js');
const jwt = require('jsonwebtoken');

const verifyUser = async ({ correo }) => {
    let msg = {
        status: false,
        message: 'Email not Found',
        code: 404
    };

    let connection;
    try {
        connection = await pool.getConnection();

        // Verificar existencia del profesor
        const sqlUser = 'SELECT id_profesor, nombre, correo, password FROM profesores WHERE correo = ?';
        const [rows] = await connection.execute(sqlUser, [correo]);

        if (rows.length > 0) {
            const user = rows[0];
            const currentDate = new Date();
            const dateCreated = currentDate.toISOString().split('T')[0];
            const dateExpires = new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().split('T')[0];

            // Obtener grados del profesor
            const sqlGrados = `
                SELECT g.id_grado, g.nombre 
                FROM grados g 
                JOIN profesores_grados pg ON g.id_grado = pg.id_grado 
                WHERE pg.id_profesor = ?;
            `;
            const [grados] = await connection.execute(sqlGrados, [user.id_profesor]);

            // Obtener materias que el profesor enseña
            const sqlMaterias = `
                SELECT m.id_materia, m.nombre 
                FROM materias m 
                JOIN profesores_materias pm ON m.id_materia = pm.id_materia 
                WHERE pm.id_profesor = ?;
            `;
            const [materias] = await connection.execute(sqlMaterias, [user.id_profesor]);

            // Obtener alumnos asignados al profesor
            const sqlAlumnos = `
                SELECT a.id_alumno, a.nombre, a.apellido, a.edad, g.nombre as grado 
                FROM alumnos a 
                JOIN alumnos_profesores ap ON a.id_alumno = ap.id_alumno 
                JOIN grados g ON ap.id_grado = g.id_grado 
                WHERE ap.id_profesor = ?;
            `;
            const [alumnos] = await connection.execute(sqlAlumnos, [user.id_profesor]);

            // Obtener asistencias de los alumnos en las materias impartidas por el profesor
            const sqlAsistencias = `
                SELECT asis.id_asistencia, asis.id_alumno, a.nombre as alumno_nombre, asis.id_materia, m.nombre as materia_nombre, asis.fecha, asis.presente, asis.titulo 
                FROM asistencias asis 
                JOIN alumnos a ON asis.id_alumno = a.id_alumno 
                JOIN materias m ON asis.id_materia = m.id_materia 
                JOIN profesores_materias pm ON m.id_materia = pm.id_materia 
                WHERE pm.id_profesor = ?;
            `;
            const [asistencias] = await connection.execute(sqlAsistencias, [user.id_profesor]);

            // Crear el token con toda la información
            let dataToken = {
                id_profesor: user.id_profesor,
                nombre: user.nombre,
                correo: user.correo,
                grados: grados,
                materias: materias,
                alumnos: alumnos,
                asistencias: asistencias,
                dateCreated: dateCreated,
                dateExpires: dateExpires
            };

            const token = jwt.sign(dataToken, KEY, { algorithm: 'HS256' });

            msg = {
                status: true,
                message: 'Login Successful',
                code: 200,
                token: token
            };
        }

    } catch (err) {
        msg = {
            status: false,
            message: 'Server error',
            code: 500,
            error: err
        };
    } finally {
        if (connection) connection.release();
    }

    return msg;
};


// Función para registrar asistencias
const registrarAsistencia = async (asistencia) => {
    let msg = {
        status: false,
        message: 'Error al registrar asistencia',
        code: 500
    };

    let connection;
    try {
        connection = await pool.getConnection();

        const sqlInsert = `
            INSERT INTO asistencias (id_alumno, id_materia, fecha, presente,titulo) 
            VALUES (?, ?, ?, ?, ?);
        `;

        // Ejecutar la consulta para insertar la asistencia
        const [result] = await connection.execute(sqlInsert, [
            asistencia.id_alumno,
            asistencia.id_materia,
            asistencia.fecha,
            asistencia.presente,
            asistencia.titulo
        ]);

        if (result.affectedRows > 0) {
            msg = {
                status: true,
                message: 'Asistencia registrada exitosamente',
                code: 200
            };
        }

    } catch (err) {
        msg.error = err;
        console.log(err);
        
    } finally {
        if (connection) connection.release();
    }

    return msg;
};


const getAsistencias = async () => {
    let msg = {
        status: false,
        message: 'Error al obtener asistencias',
        code: 500,
        data: null
    };

    let connection;
    try {
        connection = await pool.getConnection();
        
        // Cambia la consulta SQL para obtener todas las asistencias
        const sqlSelect = 'SELECT * FROM asistencias';

        const [rows] = await connection.query(sqlSelect);

        if (rows.length > 0) {
            msg = {
                status: true,
                message: 'Asistencias obtenidas con éxito',
                code: 200,
                data: rows
            };
        }

    } catch (err) {
        msg = {
            status: false,
            message: 'Error del servidor al obtener asistencias',
            code: 500,
            error: err
        };
    } finally {
        if (connection) connection.release(); // Asegura la liberación de la conexión
    }

    return msg;
}

module.exports = { verifyUser, registrarAsistencia,getAsistencias };
