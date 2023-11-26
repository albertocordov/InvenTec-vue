const express = require('express');
const router = express.Router();
const sql = require('mssql');
const cors = require('cors');

const config = {
    user: 'userinventec',
    password: '12345678',
    server: 'DAVID-D14\\SQLEXPRESS',
    database: 'inventec',
    options: {
        encrypt: false, // Deshabilita SSL/TLS
    },
};

router.post('/api/vales/registraVale', async (req, res) => {
    const nuevoUsuario = req.body;

    console.log('Nuevo vale recibido:', nuevoUsuario);

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('nombre', sql.NVarChar, nuevoUsuario.nombre)
            .input('email', sql.VarChar, nuevoUsuario.email)
            .input('esAdmin', sql.Int, nuevoUsuario.esAdmin ? 1 : 0)
            .query(`
          INSERT INTO usuarios (UsrNombre, UsrCorreo, UsrTipo)
          VALUES (@nombre, @email, @esAdmin);
        `);

        console.log('Resultado de la inserción:', result);

        res.status(200).json({
            success: true,
            message: 'Usuario guardado en SQL Server.'
        });
    } catch (error) {
        console.error('Error al guardar el usuario en SQL Server:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar el usuario en SQL Server.'
        });
    }
});

module.exports = router;